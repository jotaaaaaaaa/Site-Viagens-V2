const {
  getSupabaseConfig,
  readJsonBody,
  requirePasscode,
  sanitizePhotoOrder,
  sanitizeStringList,
  sendError,
  sendJson,
  setCorsHeaders,
  supabaseFetch,
} = require("./_shared");

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  let body = {};

  try {
    if (req.method !== "GET") {
      body = await readJsonBody(req);
    }

    if (!requirePasscode(req, res, body)) {
      return;
    }

    const { tripId } = getSupabaseConfig();
    const encodedTripId = encodeURIComponent(tripId);

    if (req.method === "GET") {
      const stateRows = await supabaseFetch(
        `/rest/v1/trip_state?id=eq.${encodedTripId}&select=favorites,photo_order,updated_at`
      );
      const photoRows = await supabaseFetch(
        `/rest/v1/custom_photos?trip_id=eq.${encodedTripId}&select=gallery_key,data,sort_index,created_at&order=sort_index.asc,created_at.asc`
      );

      const customPhotos = {
        madrid: [],
        alicante: [],
        amsterdam: [],
      };

      (photoRows || []).forEach((row) => {
        if (customPhotos[row.gallery_key] && row.data?.id && row.data?.src) {
          customPhotos[row.gallery_key].push(row.data);
        }
      });

      const state = Array.isArray(stateRows) ? stateRows[0] : null;

      sendJson(res, 200, {
        exists: Boolean(state),
        favorites: state?.favorites || [],
        photoOrder: state?.photo_order || {},
        customPhotos,
        updatedAt: state?.updated_at || null,
      });
      return;
    }

    if (req.method === "PATCH" || req.method === "POST") {
      const payload = {
        id: tripId,
        updated_at: new Date().toISOString(),
      };

      if (Object.prototype.hasOwnProperty.call(body, "favorites")) {
        payload.favorites = sanitizeStringList(body.favorites);
      }

      if (Object.prototype.hasOwnProperty.call(body, "photoOrder")) {
        payload.photo_order = sanitizePhotoOrder(body.photoOrder);
      }

      await supabaseFetch("/rest/v1/trip_state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify([payload]),
      });

      sendJson(res, 200, { ok: true });
      return;
    }

    sendError(res, 405, "Metodo nao permitido.");
  } catch (error) {
    sendError(res, 500, error.message || "Erro ao acessar o Supabase.");
  }
};
