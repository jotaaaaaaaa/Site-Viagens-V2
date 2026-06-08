const crypto = require("crypto");
const {
  getSupabaseConfig,
  readJsonBody,
  requirePasscode,
  sanitizePhotoOrder,
  sendError,
  sendJson,
  setCorsHeaders,
  supabaseFetch,
} = require("./_shared");

const removePasswordHash = "e9ee5ffc3639dc24442bdb7987c1db5f61803cc59bb836864d933b6a717731a7";
const adminPasswordHash = "a8cbefd46f2ab2656c3e6cc348c2b44705223b4e652b961ec11f1c0c49517dbf";

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sanitizePhotoId(value) {
  const id = String(value || "").slice(0, 180);
  if (!id) throw new Error("Foto invalida.");
  return id;
}

function validSecret(body) {
  if (body.adminPassword) return safeEqual(sha256(body.adminPassword), adminPasswordHash);
  return safeEqual(sha256(body.removePassword), removePasswordHash);
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendError(res, 405, "Metodo nao permitido.");
    return;
  }

  try {
    const body = await readJsonBody(req);

    if (!requirePasscode(req, res, body)) return;

    if (!validSecret(body)) {
      sendError(res, 401, "Senha invalida.");
      return;
    }

    const photoId = sanitizePhotoId(body.photoId);
    const action = body.action === "restore" ? "restore" : "hide";
    const { tripId } = getSupabaseConfig();
    const encodedTripId = encodeURIComponent(tripId);
    const stateRows = await supabaseFetch(
      `/rest/v1/trip_state?id=eq.${encodedTripId}&select=favorites,photo_order`
    );
    const state = Array.isArray(stateRows) ? stateRows[0] : null;
    const currentOrder = sanitizePhotoOrder(state?.photo_order || {});
    const favorites = Array.isArray(state?.favorites) ? state.favorites.filter((id) => id !== photoId) : [];
    const hidden = new Set(currentOrder.__hidden || []);

    if (action === "restore") {
      hidden.delete(photoId);
    } else {
      hidden.add(photoId);
      Object.keys(currentOrder).forEach((key) => {
        if (Array.isArray(currentOrder[key]) && key !== "__hidden") {
          currentOrder[key] = currentOrder[key].filter((id) => id !== photoId);
        }
      });
    }

    currentOrder.__hidden = [...hidden];

    await supabaseFetch("/rest/v1/trip_state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([
        {
          id: tripId,
          favorites,
          photo_order: currentOrder,
          updated_at: new Date().toISOString(),
        },
      ]),
    });

    sendJson(res, 200, { ok: true, action, hiddenPhotos: currentOrder.__hidden });
  } catch (error) {
    sendError(res, 500, error.message || "Nao consegui alterar a foto.");
  }
};
