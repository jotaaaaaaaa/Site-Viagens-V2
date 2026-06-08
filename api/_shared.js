const defaultTripId = "madrid-alicante-amsterdam-2026";
const defaultBucket = "site-viagem-fotos";
const validGalleryKeys = new Set(["madrid", "alicante", "amsterdam"]);

function getEnv(name, fallback = "") {
  return process.env[name] || fallback;
}

function getSupabaseConfig() {
  const url = getEnv("SUPABASE_URL", getEnv("NEXT_PUBLIC_SUPABASE_URL")).replace(/\/+$/, "");
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY", getEnv("SUPABASE_SECRET_KEY"));

  if (!url || !serviceKey) {
    throw new Error("Supabase nao foi configurado nas variaveis da Vercel.");
  }

  return {
    url,
    serviceKey,
    bucket: getEnv("SUPABASE_STORAGE_BUCKET", defaultBucket),
    tripId: getEnv("SITE_TRIP_ID", defaultTripId),
  };
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-site-passcode");
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

function requirePasscode(req, res, body = {}) {
  const expected = getEnv("SITE_ACCESS_CODE");
  const received = req.headers["x-site-passcode"] || body.passcode;

  if (!expected) {
    sendError(res, 500, "SITE_ACCESS_CODE nao foi configurado na Vercel.");
    return false;
  }

  if (received !== expected) {
    sendError(res, 401, "Senha invalida.");
    return false;
  }

  return true;
}

async function supabaseFetch(path, options = {}) {
  const { url, serviceKey } = getSupabaseConfig();
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const detail = typeof payload === "string" ? payload : payload?.message || payload?.error || response.statusText;
    throw new Error(detail);
  }

  return payload;
}

function sanitizeStringList(value, limit = 1200) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item) => typeof item === "string" && item.length <= 160))].slice(0, limit);
}

function sanitizePhotoOrder(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    [
      ...[...validGalleryKeys].map((galleryKey) => [galleryKey, sanitizeStringList(value[galleryKey], 2000)]),
      ["__hidden", sanitizeStringList(value.__hidden, 4000)],
    ]
  );
}

function sanitizeGalleryKey(value) {
  if (!validGalleryKeys.has(value)) {
    throw new Error("Cidade invalida.");
  }

  return value;
}

function sanitizePhoto(photo) {
  if (!photo || typeof photo !== "object") {
    throw new Error("Foto invalida.");
  }

  const id = String(photo.id || "").slice(0, 180);
  const src = String(photo.src || "");

  if (!id || !src.startsWith("data:image/")) {
    throw new Error("Foto invalida.");
  }

  return {
    id,
    number: String(photo.number || "").slice(0, 20),
    title: String(photo.title || "foto adicionada").slice(0, 180),
    note: String(photo.note || "").slice(0, 100),
    size: String(photo.size || "span-medium").slice(0, 40),
    gradient: String(photo.gradient || "").slice(0, 260),
    drift: Array.isArray(photo.drift) ? photo.drift.slice(0, 5).map((item) => String(item).slice(0, 40)) : undefined,
    src,
    originalSrc: String(photo.originalSrc || src),
    width: Number.isFinite(Number(photo.width)) ? Number(photo.width) : undefined,
    height: Number.isFinite(Number(photo.height)) ? Number(photo.height) : undefined,
    custom: true,
  };
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Imagem invalida.");
  }

  const mimeType = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], "base64");

  if (!buffer.length) {
    throw new Error("Imagem vazia.");
  }

  if (buffer.length > 9 * 1024 * 1024) {
    throw new Error("Imagem muito grande. Tente uma foto menor.");
  }

  return { mimeType, buffer };
}

function extensionFromMime(mimeType) {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpg";
}

function storagePublicUrl(path) {
  const { url, bucket } = getSupabaseConfig();
  return `${url}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

module.exports = {
  defaultBucket,
  extensionFromMime,
  getSupabaseConfig,
  parseDataUrl,
  readJsonBody,
  requirePasscode,
  sanitizeGalleryKey,
  sanitizePhoto,
  sanitizePhotoOrder,
  sanitizeStringList,
  sendError,
  sendJson,
  setCorsHeaders,
  storagePublicUrl,
  supabaseFetch,
};
