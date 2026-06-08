const crypto = require("crypto");
const {
  getSupabaseConfig,
  readJsonBody,
  sanitizePhotoOrder,
  sendError,
  sendJson,
  setCorsHeaders,
  supabaseFetch,
} = require("./_shared");

const adminHash = "a8cbefd46f2ab2656c3e6cc348c2b44705223b4e652b961ec11f1c0c49517dbf";
const analyticsIdSuffix = "admin-analytics";
const maxEvents = 900;
const maxVisitors = 500;
const cityLabels = { madrid: "Madrid", alicante: "Alicante", amsterdam: "Amsterdam" };
const officialCounts = { madrid: 13, alicante: 16, amsterdam: 28 };

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function secret() {
  const { serviceKey } = getSupabaseConfig();
  return process.env.ADMIN_SESSION_SECRET || `${serviceKey}:${adminHash}`;
}

function createToken() {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const nonce = crypto.randomBytes(12).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function validToken(token) {
  const [expiresAt, nonce, sig] = String(token || "").split(".");
  if (!expiresAt || !nonce || !sig || Number(expiresAt) < Date.now()) return false;
  const expected = crypto.createHmac("sha256", secret()).update(`${expiresAt}.${nonce}`).digest("hex");
  return safeEqual(sig, expected);
}

function requireAdmin(req, res, body = {}) {
  const token = req.headers["x-admin-token"] || body.adminToken;
  if (!validToken(token)) {
    sendError(res, 401, "Login admin necessario.");
    return false;
  }
  return true;
}

function clean(value, fallback = "") {
  return String(value || fallback).replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 240);
}

function clientIp(req) {
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || String(req.headers["x-real-ip"] || "").trim();
  if (!ip) return "";
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + "::";
  const parts = ip.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : ip;
}

function geo(req) {
  return {
    country: clean(req.headers["x-vercel-ip-country"] || req.headers["cf-ipcountry"] || ""),
    city: clean(decodeURIComponent(String(req.headers["x-vercel-ip-city"] || ""))),
  };
}

function emptyAnalytics() {
  return { visitors: {}, events: [], updatedAt: null };
}

function analyticsId() {
  return `${getSupabaseConfig().tripId}-${analyticsIdSuffix}`;
}

async function readAnalytics() {
  const rows = await supabaseFetch(`/rest/v1/trip_state?id=eq.${encodeURIComponent(analyticsId())}&select=photo_order`);
  const data = Array.isArray(rows) ? rows[0]?.photo_order : null;
  return data && typeof data === "object" && !Array.isArray(data) ? { ...emptyAnalytics(), ...data } : emptyAnalytics();
}

async function writeAnalytics(data) {
  await supabaseFetch("/rest/v1/trip_state", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([{ id: analyticsId(), favorites: [], photo_order: data, updated_at: new Date().toISOString() }]),
  });
}

function sanitizeEvent(body, req) {
  const details = body.details && typeof body.details === "object" && !Array.isArray(body.details) ? body.details : {};
  return {
    id: `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    at: new Date().toISOString(),
    type: clean(body.type, "page_view").slice(0, 80),
    label: clean(body.label),
    visitorId: clean(body.visitorId, "visitante").slice(0, 90),
    page: clean(body.page || req.headers.referer || "/"),
    device: clean(body.device),
    browser: clean(body.browser),
    os: clean(body.os),
    screen: clean(body.screen),
    language: clean(body.language),
    timezone: clean(body.timezone),
    online: body.online !== false,
    ip: clientIp(req),
    geo: geo(req),
    details: Object.fromEntries(Object.entries(details).slice(0, 10).map(([key, value]) => [clean(key).slice(0, 60), clean(value).slice(0, 180)])),
  };
}

function addEvent(data, event) {
  const visitor = data.visitors[event.visitorId] || { id: event.visitorId, firstSeenAt: event.at, accessCount: 0 };
  data.visitors[event.visitorId] = {
    ...visitor,
    lastSeenAt: event.at,
    lastPage: event.page,
    device: event.device,
    browser: event.browser,
    os: event.os,
    screen: event.screen,
    language: event.language,
    timezone: event.timezone,
    ip: event.ip,
    geo: event.geo,
    online: event.online,
    accessCount: Number(visitor.accessCount || 0) + (event.type === "page_view" ? 1 : 0),
  };
  data.events.push(event);
  data.events = data.events.slice(-maxEvents);
  data.visitors = Object.fromEntries(Object.entries(data.visitors).sort((a, b) => String(b[1].lastSeenAt).localeCompare(String(a[1].lastSeenAt))).slice(0, maxVisitors));
  data.updatedAt = new Date().toISOString();
}

async function readSiteState() {
  const { tripId } = getSupabaseConfig();
  const rows = await supabaseFetch(`/rest/v1/trip_state?id=eq.${encodeURIComponent(tripId)}&select=favorites,photo_order,updated_at`);
  const row = Array.isArray(rows) ? rows[0] : null;
  return { favorites: row?.favorites || [], photoOrder: sanitizePhotoOrder(row?.photo_order || {}), updatedAt: row?.updated_at || null };
}

async function writePhotoOrder(photoOrder, favorites) {
  const { tripId } = getSupabaseConfig();
  await supabaseFetch("/rest/v1/trip_state", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify([{ id: tripId, favorites, photo_order: photoOrder, updated_at: new Date().toISOString() }]),
  });
}

function officialPhotos(hidden) {
  return Object.entries(officialCounts).flatMap(([city, count]) =>
    Array.from({ length: count }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      const id = `${city}-${number}`;
      return { id, name: `${cityLabels[city]} ${number}`, gallery: city, city: cityLabels[city], type: "oficial", hidden: hidden.has(id), thumbnail: "", original: "" };
    })
  );
}

async function customPhotos(hidden) {
  const { tripId } = getSupabaseConfig();
  const rows = await supabaseFetch(`/rest/v1/custom_photos?trip_id=eq.${encodeURIComponent(tripId)}&select=gallery_key,data,created_at&order=created_at.desc&limit=400`);
  return (rows || []).map((row) => ({
    id: row.data?.id || "",
    name: row.data?.title || row.data?.number || "foto adicionada",
    gallery: row.gallery_key,
    city: cityLabels[row.gallery_key] || row.gallery_key,
    type: row.data?.mimeType || "imagem adicionada",
    size: row.data?.fileSize || "",
    uploadedAt: row.created_at,
    thumbnail: row.data?.src || "",
    original: row.data?.originalSrc || row.data?.src || "",
    hidden: hidden.has(row.data?.id || ""),
  }));
}

function metrics(data, photos) {
  const events = data.events || [];
  const visitors = Object.values(data.visitors || {});
  const today = new Date().toISOString().slice(0, 10);
  const permissions = events.filter((event) => event.type === "permission");
  return {
    totalAccesses: events.filter((event) => event.type === "page_view").length,
    uniqueVisitors: visitors.length,
    todayAccesses: events.filter((event) => event.type === "page_view" && String(event.at).startsWith(today)).length,
    lastAccess: events.filter((event) => event.type === "page_view").at(-1)?.at || null,
    uploadedPhotos: photos.filter((photo) => photo.type !== "oficial").length,
    permissionsAccepted: permissions.filter((event) => event.details?.state === "granted").length,
    permissionsDenied: permissions.filter((event) => event.details?.state === "denied").length,
  };
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-site-passcode, x-admin-token");

  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }

  try {
    const body = req.method === "GET" ? {} : await readJsonBody(req);
    const action = clean(req.query?.action || body.action || "dashboard");

    if (req.method === "POST" && action === "login") {
      if (!safeEqual(sha256(String(body.password || "").trim()), adminHash)) { sendError(res, 401, "Senha admin invalida."); return; }
      sendJson(res, 200, { ok: true, token: createToken() });
      return;
    }

    if (req.method === "POST" && action === "event") {
      const data = await readAnalytics();
      addEvent(data, sanitizeEvent(body, req));
      await writeAnalytics(data);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (!requireAdmin(req, res, body)) return;

    if (req.method === "POST" && action === "photo") {
      const id = clean(body.photoId).slice(0, 180);
      const photoAction = body.photoAction === "restore" ? "restore" : "hide";
      const state = await readSiteState();
      const hidden = new Set(state.photoOrder.__hidden || []);
      if (photoAction === "restore") hidden.delete(id); else hidden.add(id);
      state.photoOrder.__hidden = [...hidden];
      Object.keys(state.photoOrder).forEach((key) => {
        if (key !== "__hidden" && Array.isArray(state.photoOrder[key]) && photoAction === "hide") {
          state.photoOrder[key] = state.photoOrder[key].filter((photoId) => photoId !== id);
        }
      });
      await writePhotoOrder(state.photoOrder, state.favorites.filter((photoId) => photoId !== id));
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && action === "clear-test") {
      await writeAnalytics(emptyAnalytics());
      sendJson(res, 200, { ok: true });
      return;
    }

    const analytics = await readAnalytics();
    const state = await readSiteState();
    const hidden = new Set(state.photoOrder.__hidden || []);
    const photos = [...officialPhotos(hidden), ...(await customPhotos(hidden))];
    const events = (analytics.events || []).slice().reverse();

    sendJson(res, 200, {
      ok: true,
      metrics: metrics(analytics, photos),
      visitors: Object.values(analytics.visitors || {}).sort((a, b) => String(b.lastSeenAt).localeCompare(String(a.lastSeenAt))),
      permissions: events.filter((event) => event.type === "permission"),
      events,
      interactions: events.filter((event) => !["page_view", "permission"].includes(event.type)),
      photos,
      system: { status: "online", version: process.env.VERCEL_GIT_COMMIT_SHA || "local", environment: process.env.VERCEL_ENV || "production", storage: "Supabase", updatedAt: analytics.updatedAt },
    });
  } catch (error) {
    sendError(res, 500, error.message || "Erro no painel admin.");
  }
};
