const { getSupabaseConfig, sendJson, setCorsHeaders } = require("./_shared");

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const { bucket, tripId } = getSupabaseConfig();
    sendJson(res, 200, {
      ok: true,
      bucket,
      tripId,
      supabase: "configurado",
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error.message || "Configuracao incompleta.",
    });
  }
};
