const {
  extensionFromMime,
  getSupabaseConfig,
  parseDataUrl,
  readJsonBody,
  requirePasscode,
  sanitizeGalleryKey,
  sanitizePhoto,
  sendError,
  sendJson,
  setCorsHeaders,
  storagePublicUrl,
  supabaseFetch,
} = require("./_shared");

function cleanPathPart(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 120);
}

async function uploadObject(path, dataUrl) {
  const { bucket } = getSupabaseConfig();
  const { mimeType, buffer } = parseDataUrl(dataUrl);

  await supabaseFetch(`/storage/v1/object/${encodeURIComponent(bucket)}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": mimeType,
      "x-upsert": "true",
    },
    body: buffer,
  });

  return {
    mimeType,
    publicUrl: storagePublicUrl(path),
  };
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

    const { tripId } = getSupabaseConfig();
    const galleryKey = sanitizeGalleryKey(body.galleryKey);
    const photo = sanitizePhoto(body.photo);
    const safeId = cleanPathPart(photo.id) || `${galleryKey}-${Date.now()}`;
    const preview = parseDataUrl(photo.src);
    const original = parseDataUrl(photo.originalSrc || photo.src);
    const previewPath = `${cleanPathPart(tripId)}/${galleryKey}/${safeId}-preview.${extensionFromMime(preview.mimeType)}`;
    const originalPath = `${cleanPathPart(tripId)}/${galleryKey}/${safeId}-original.${extensionFromMime(original.mimeType)}`;

    const previewUpload = await uploadObject(previewPath, photo.src);
    const originalUpload = await uploadObject(originalPath, photo.originalSrc || photo.src);
    const savedPhoto = {
      ...photo,
      src: previewUpload.publicUrl,
      originalSrc: originalUpload.publicUrl,
      custom: true,
    };

    await supabaseFetch("/rest/v1/custom_photos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([
        {
          id: photo.id,
          trip_id: tripId,
          gallery_key: galleryKey,
          data: savedPhoto,
          sort_index: Number.isFinite(Number(body.sortIndex)) ? Number(body.sortIndex) : 0,
        },
      ]),
    });

    sendJson(res, 200, { ok: true, photo: savedPhoto });
  } catch (error) {
    sendError(res, 500, error.message || "Nao consegui salvar a foto.");
  }
};
