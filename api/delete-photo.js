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
  if (!id) {
    throw new Error("Foto invalida.");
  }
  return id;
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

    if (!requirePasscode(req, res, body)) {
      return;
    }

    if (!safeEqual(sha256(body.removePassword), removePasswordHash)) {
      sendError(res, 401, "Senha de remocao invalida.");
      return;
    }

    const photoId = sanitizePhotoId(body.photoId);
    const { tripId } = getSupabaseConfig();
    const encodedTripId = encodeURIComponent(tripId);
    const stateRows = await supabaseFetch(
      `/rest/v1/trip_state?id=eq.${encodedTripId}&select=favorites,photo_order`
    );
    const state = Array.isArray(stateRows) ? stateRows[0] : null;
    const currentOrder = sanitizePhotoOrder(state?.photo_order || {});
    const favorites = Array.isArray(state?.favorites) ? state.favorites.filter((id) => id !== photoId) : [];
    const hidden = new Set(currentOrder.__hidden || []);
    hidden.add(photoId);

    Object.keys(currentOrder).forEach((key) => {
      if (Array.isArray(currentOrder[key])) {
        currentOrder[key] = currentOrder[key].filter((id) => id !== photoId);
      }
    });
    currentOrder.__hidden = [...hidden];

    await supabaseFetch(`/rest/v1/custom_photos?id=eq.${encodeURIComponent(photoId)}&trip_id=eq.${encodedTripId}`, {
      method: "DELETE",
      headers: {
        Prefer: "return=minimal",
      },
    });

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

    sendJson(res, 200, { ok: true, hiddenPhotos: currentOrder.__hidden });
  } catch (error) {
    sendError(res, 500, error.message || "Nao consegui remover a foto.");
  }
};
