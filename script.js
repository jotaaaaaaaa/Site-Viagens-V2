const favoriteKey = "site-viagem-favoritos";
const orderKey = "site-viagem-ordem-fotos";
const customPhotosKey = "site-viagem-fotos-adicionadas";
const cloudApiHost = "siteviagensv2.vercel.app";
const cloudApiBase = window.location.hostname && window.location.hostname !== cloudApiHost ? `https://${cloudApiHost}` : "";
const cloudStateEndpoint = "/api/state";
const cloudUploadEndpoint = "/api/upload-photo";
const cloudDeleteEndpoint = "/api/delete-photo";
const authSalt = "site-viagem-auth-v1-2026-06-05";
const authIterations = 210000;
const authHash = "TvMcNPwhy9+dNmcUk4MiIZC0+J7uhD+TQu8Wv6zlesE=";
const uploadedPhotoSizes = ["span-medium", "span-small", "span-wide", "span-tall", "span-large"];
const uploadedPhotoDrifts = [
  ["8px", "-7px", "0.45deg", "10.2s", "-1.4s"],
  ["-7px", "8px", "-0.5deg", "11.1s", "-3.2s"],
  ["6px", "9px", "0.6deg", "9.7s", "-2.6s"],
  ["-8px", "-6px", "-0.42deg", "12s", "-4.5s"],
  ["9px", "5px", "0.52deg", "10.8s", "-5.1s"],
];

const galleries = {
  madrid: {
    label: "Madrid",
    target: "madridGallery",
    photos: [
      {
        id: "madrid-01",
        number: "01",
        title: "primeira luz",
        note: "Madrid",
        size: "span-large",
        gradient: "linear-gradient(135deg, #5d2f2a 0%, #b75f45 48%, #e5bc75 100%)",
        drift: ["10px", "-9px", "0.8deg", "9.5s", "-1.1s"],
      },
      {
        id: "madrid-02",
        number: "02",
        title: "ruas abertas",
        note: "Gran Via",
        size: "span-small",
        gradient: "linear-gradient(135deg, #7a392f 0%, #d3925e 58%, #f1d59a 100%)",
        drift: ["-8px", "7px", "-0.7deg", "10.8s", "-3.4s"],
      },
      {
        id: "madrid-03",
        number: "03",
        title: "fim de tarde",
        note: "Cielo dorado",
        size: "span-tall",
        gradient: "linear-gradient(135deg, #402120 0%, #a2503d 42%, #d9a25e 100%)",
        drift: ["7px", "11px", "0.45deg", "12s", "-5s"],
      },
      {
        id: "madrid-04",
        number: "04",
        title: "janelas antigas",
        note: "Centro",
        size: "span-medium",
        gradient: "linear-gradient(135deg, #a75842 0%, #cf8861 48%, #ead7b4 100%)",
        drift: ["-11px", "-6px", "0.65deg", "9.2s", "-2.6s"],
      },
      {
        id: "madrid-05",
        number: "05",
        title: "passos lentos",
        note: "Retiro",
        size: "span-wide",
        gradient: "linear-gradient(135deg, #263f36 0%, #99744b 46%, #d7b56d 100%)",
        drift: ["9px", "6px", "-0.55deg", "11.4s", "-4.3s"],
      },
      {
        id: "madrid-06",
        number: "06",
        title: "mesa para dois",
        note: "Noche",
        size: "span-medium",
        gradient: "linear-gradient(135deg, #2b1c21 0%, #79332f 44%, #bd6a4f 100%)",
        drift: ["-7px", "10px", "0.8deg", "10.6s", "-1.8s"],
      },
      {
        id: "madrid-07",
        number: "07",
        title: "calor bonito",
        note: "Sol",
        size: "span-small",
        gradient: "linear-gradient(135deg, #884035 0%, #c87c54 52%, #f0c77c 100%)",
        drift: ["8px", "-7px", "-0.6deg", "8.8s", "-3.1s"],
      },
      {
        id: "madrid-08",
        number: "08",
        title: "noite macia",
        note: "Plaza",
        size: "span-large",
        gradient: "linear-gradient(135deg, #221c1d 0%, #6f3332 46%, #cba160 100%)",
        drift: ["-9px", "8px", "0.45deg", "12.4s", "-6s"],
      },
    ],
  },
  alicante: {
    label: "Alicante",
    target: "alicanteGallery",
    photos: [
      {
        id: "alicante-01",
        number: "01",
        title: "azul aberto",
        note: "Costa",
        size: "span-wide",
        gradient: "linear-gradient(135deg, #0f5f7a 0%, #2ca7bf 43%, #f5efe2 72%, #de7a42 100%)",
        drift: ["8px", "-10px", "-0.5deg", "10.2s", "-2.2s"],
      },
      {
        id: "alicante-02",
        number: "02",
        title: "sal na pele",
        note: "Playa",
        size: "span-medium",
        gradient: "linear-gradient(135deg, #0e4f6a 0%, #7cc9cf 50%, #f1d49a 100%)",
        drift: ["-10px", "8px", "0.65deg", "11.6s", "-4.4s"],
      },
      {
        id: "alicante-03",
        number: "03",
        title: "sol laranja",
        note: "Atardecer",
        size: "span-tall",
        gradient: "linear-gradient(135deg, #1f7493 0%, #f4d3a7 47%, #d86c3d 100%)",
        drift: ["9px", "9px", "0.55deg", "9.8s", "-1.3s"],
      },
      {
        id: "alicante-04",
        number: "04",
        title: "fachada clara",
        note: "Barrio",
        size: "span-small",
        gradient: "linear-gradient(135deg, #f7f2e8 0%, #e1b57d 45%, #b65548 100%)",
        drift: ["-7px", "-9px", "-0.7deg", "12.2s", "-5.7s"],
      },
      {
        id: "alicante-05",
        number: "05",
        title: "vento doce",
        note: "Mar",
        size: "span-large",
        gradient: "linear-gradient(135deg, #0b425c 0%, #1599b0 48%, #eedbb6 100%)",
        drift: ["10px", "6px", "0.45deg", "10.9s", "-3.6s"],
      },
      {
        id: "alicante-06",
        number: "06",
        title: "calma branca",
        note: "Siesta",
        size: "span-medium",
        gradient: "linear-gradient(135deg, #fff8eb 0%, #e7c389 54%, #cc6d47 100%)",
        drift: ["-8px", "10px", "0.75deg", "9.1s", "-2.8s"],
      },
      {
        id: "alicante-07",
        number: "07",
        title: "caminho alto",
        note: "Castillo",
        size: "span-wide",
        gradient: "linear-gradient(135deg, #244f64 0%, #8cb9ae 42%, #cba365 72%, #773a35 100%)",
        drift: ["7px", "-8px", "-0.45deg", "11.8s", "-6.2s"],
      },
      {
        id: "alicante-08",
        number: "08",
        title: "verão eterno",
        note: "Luz",
        size: "span-small",
        gradient: "linear-gradient(135deg, #dc7343 0%, #efb767 54%, #fff3d6 100%)",
        drift: ["-9px", "7px", "0.6deg", "10s", "-4s"],
      },
    ],
  },
  amsterdam: {
    label: "Amsterdam",
    target: "amsterdamGallery",
    photos: [
      {
        id: "amsterdam-01",
        number: "01",
        title: "canal quieto",
        note: "Canal",
        size: "span-large",
        gradient: "linear-gradient(135deg, #13222b 0%, #34535e 42%, #82958e 100%)",
        drift: ["8px", "9px", "0.55deg", "11.2s", "-2.4s"],
      },
      {
        id: "amsterdam-02",
        number: "02",
        title: "céu baixo",
        note: "Noord",
        size: "span-tall",
        gradient: "linear-gradient(135deg, #233540 0%, #6e8588 48%, #c8bfa5 100%)",
        drift: ["-7px", "-10px", "-0.55deg", "12.6s", "-5.4s"],
      },
      {
        id: "amsterdam-03",
        number: "03",
        title: "ponte acesa",
        note: "Bridge",
        size: "span-small",
        gradient: "linear-gradient(135deg, #121a20 0%, #344853 50%, #b99262 100%)",
        drift: ["9px", "-7px", "0.7deg", "9.4s", "-1.7s"],
      },
      {
        id: "amsterdam-04",
        number: "04",
        title: "vidro e água",
        note: "Reflexo",
        size: "span-wide",
        gradient: "linear-gradient(135deg, #23363e 0%, #466c73 45%, #b6c0b4 100%)",
        drift: ["-9px", "8px", "0.42deg", "10.7s", "-3.9s"],
      },
      {
        id: "amsterdam-05",
        number: "05",
        title: "rua estreita",
        note: "Centro",
        size: "span-medium",
        gradient: "linear-gradient(135deg, #18242b 0%, #40515a 46%, #76624f 100%)",
        drift: ["7px", "10px", "-0.72deg", "12.1s", "-6.1s"],
      },
      {
        id: "amsterdam-06",
        number: "06",
        title: "janela quente",
        note: "Noite",
        size: "span-small",
        gradient: "linear-gradient(135deg, #10161a 0%, #2f4248 44%, #d0a665 100%)",
        drift: ["-8px", "-6px", "0.68deg", "9.7s", "-2.9s"],
      },
      {
        id: "amsterdam-07",
        number: "07",
        title: "bicicletas",
        note: "Rua",
        size: "span-large",
        gradient: "linear-gradient(135deg, #24323a 0%, #657a76 45%, #b5a17a 100%)",
        drift: ["10px", "-8px", "-0.48deg", "10.4s", "-4.7s"],
      },
      {
        id: "amsterdam-08",
        number: "08",
        title: "frio elegante",
        note: "Canais",
        size: "span-medium",
        gradient: "linear-gradient(135deg, #15242d 0%, #385864 56%, #9aa99f 100%)",
        drift: ["-9px", "9px", "0.62deg", "11.9s", "-5.9s"],
      },
    ],
  },
};

const officialPhotoFiles = {
  madrid: [
    "WhatsApp Image 2026-06-06 at 16.50.02.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.03.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.04.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.05.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.08.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.09.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.10.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.11 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.11.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.12 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.12.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.13.jpeg",
    "WhatsApp Image 2026-06-06 at 16.50.14.jpeg",
  ],
  alicante: [
    "WhatsApp Image 2026-06-06 at 17.00.18.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.19 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.19 (2).jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.19 (3).jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.19.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.20.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.22.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.24.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.26.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.27.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.29 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.29.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.30 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.30.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.31.jpeg",
    "WhatsApp Image 2026-06-06 at 17.00.32.jpeg",
  ],
  amsterdam: [
    "WhatsApp Image 2026-06-06 at 17.04.12 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.12.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.13.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.14.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.15.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.17.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.18.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.20 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.20 (2).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.20 (3).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.20.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.22 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.22 (2).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.22.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.23 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.23 (2).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.23 (3).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.23 (4).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.23 (5).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.23 (6).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.23 (7).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.23.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.24.jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.25 (1).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.25 (2).jpeg",
    "WhatsApp Image 2026-06-06 at 17.04.25.jpeg",
    "WhatsApp Image 2026-06-06 at 17.05.23.jpeg",
    "WhatsApp Image 2026-06-06 at 17.05.24.jpeg",
  ],
};

const officialWidePhotos = new Set([
  "madrid/WhatsApp Image 2026-06-06 at 16.50.08.jpeg",
  "madrid/WhatsApp Image 2026-06-06 at 16.50.11 (1).jpeg",
  "alicante/WhatsApp Image 2026-06-06 at 17.00.22.jpeg",
  "alicante/WhatsApp Image 2026-06-06 at 17.00.26.jpeg",
  "alicante/WhatsApp Image 2026-06-06 at 17.00.27.jpeg",
  "alicante/WhatsApp Image 2026-06-06 at 17.00.29 (1).jpeg",
  "alicante/WhatsApp Image 2026-06-06 at 17.00.29.jpeg",
  "alicante/WhatsApp Image 2026-06-06 at 17.00.30 (1).jpeg",
  "alicante/WhatsApp Image 2026-06-06 at 17.00.31.jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.12.jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.15.jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.23 (1).jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.23 (2).jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.23 (3).jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.23 (4).jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.24.jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.25 (1).jpeg",
  "amsterdam/WhatsApp Image 2026-06-06 at 17.04.25.jpeg",
]);

const officialPanoramaPhotos = new Set([
  "alicante/WhatsApp Image 2026-06-06 at 17.00.29.jpeg",
]);

applyOfficialPhotos();

let customPhotos = readCustomPhotos();
applyCustomPhotos();

let favorites = readFavorites();
let photoOrder = readPhotoOrder();
let allPhotos = collectAllPhotos();
let photoById = new Map(allPhotos.map((photo) => [photo.id, photo]));
let revealObserver;
let pendingDrag = null;
let dragState = null;
let suppressPhotoOpen = false;
let photoPress = null;
let lastPhotoOpenAt = 0;
let currentLightboxPhotoId = "";
let lightboxSwipe = null;
let suppressLightboxClick = false;
let cloudSync = {
  passcode: "",
  applying: false,
  saveTimer: 0,
};

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function timingSafeEqual(left, right) {
  const maxLength = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return diff === 0;
}

async function derivePasswordHash(password) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(authSalt),
      iterations: authIterations,
      hash: "SHA-256",
    },
    key,
    256
  );

  return bytesToBase64(new Uint8Array(bits));
}

async function verifyPassword(password) {
  if (!window.crypto?.subtle) {
    throw new Error("Crypto API unavailable");
  }

  const candidateHash = await derivePasswordHash(password);
  return timingSafeEqual(candidateHash, authHash);
}

function shuffledPhotosForGate() {
  const photos = allPhotos.filter((photo) => photo.src);

  return [...photos]
    .map((photo) => ({ photo, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ photo }) => photo)
    .slice(0, 28);
}

function createGateStreamPhoto(photo, index) {
  const frame = document.createElement("span");
  frame.className = `gate-stream-photo ${index % 5 === 0 ? "is-wide" : index % 4 === 0 ? "is-tall" : ""}`.trim();

  const image = document.createElement("img");
  image.src = photo.src;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.draggable = false;
  image.setAttribute("aria-hidden", "true");

  frame.appendChild(image);
  return frame;
}

function setupGatePhotoStream() {
  const stream = document.getElementById("gatePhotoStream");

  if (!stream) {
    return;
  }

  const photos = shuffledPhotosForGate();
  const columnCount = window.matchMedia("(max-width: 720px)").matches ? 3 : 4;
  const photosPerColumn = Math.max(5, Math.ceil(photos.length / columnCount));
  stream.innerHTML = "";

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const column = document.createElement("div");
    column.className = "gate-photo-column";
    column.style.setProperty("--stream-duration", `${42 + columnIndex * 6}s`);
    column.style.setProperty("--stream-duration-alt", `${48 + columnIndex * 7}s`);

    const columnPhotos = photos.slice(columnIndex * photosPerColumn, (columnIndex + 1) * photosPerColumn);
    const loopPhotos = [...columnPhotos, ...columnPhotos];

    loopPhotos.forEach((photo, photoIndex) => {
      column.appendChild(createGateStreamPhoto(photo, photoIndex + columnIndex));
    });

    stream.appendChild(column);
  }
}

function setupPasswordGate() {
  const gate = document.getElementById("passwordGate");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("passwordInput");
  const submit = document.getElementById("passwordSubmit");
  const message = document.getElementById("gateMessage");
  const warning = document.getElementById("gateWarning");
  const next = document.getElementById("gateNext");

  if (!gate || !form || !input || !submit || !message || !warning) {
    document.body.classList.remove("site-locked");
    return;
  }

  setupGatePhotoStream();
  setupGateImageFallbacks();
  next?.addEventListener("click", () => {
    const slides = [...document.querySelectorAll("[data-gate-slide]")];
    const currentIndex = Math.max(slides.findIndex((slide) => slide.classList.contains("is-active")), 0);
    setGateSlide((currentIndex + 1) % slides.length);
  });

  window.setTimeout(() => input.focus(), 120);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = input.value.trim();

    submit.disabled = true;
    submit.textContent = "Verificando...";
    message.textContent = "";
    message.classList.remove("is-success");
    warning.hidden = true;

    try {
      if (await verifyPassword(password)) {
        message.textContent = "abrindo o mural...";
        message.classList.add("is-success");
        input.disabled = true;
        enableCloudSync(password);
        unlockSite(gate);
        syncSharedStateFromCloud();
        return;
      }

      showWrongPassword(form, input, message, warning);
    } catch {
      message.textContent = "Este navegador nao conseguiu validar a senha.";
    } finally {
      if (!document.body.classList.contains("site-unlocking")) {
        submit.disabled = false;
        submit.textContent = "Entrar";
      }
    }
  });
}

function setupGateImageFallbacks() {
  document.querySelectorAll(".gate-photo img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";
      image.src = image.dataset.fallback;
    });
  });
}

function resetGateImages() {
  document.querySelectorAll(".gate-photo img[data-src]").forEach((image) => {
    if (image.src.endsWith(image.dataset.src.replace("./", ""))) {
      return;
    }

    image.dataset.fallbackApplied = "false";
    image.src = image.dataset.src;
  });
}

function setGateSlide(index) {
  document.querySelectorAll("[data-gate-slide]").forEach((slide) => {
    const isActive = slide.dataset.gateSlide === String(index);
    slide.classList.toggle("is-active", isActive);
  });
}

function showWrongPassword(form, input, message, warning) {
  message.textContent = "senha errada";
  resetGateImages();
  warning.hidden = false;
  warning.classList.remove("is-visible");
  setGateSlide(0);
  input.value = "";
  input.focus();
  form.classList.remove("is-wrong");
  window.requestAnimationFrame(() => {
    form.classList.add("is-wrong");
    warning.classList.add("is-visible");
  });
}

function unlockSite(gate) {
  document.body.classList.add("site-unlocking");

  window.setTimeout(() => {
    document.body.classList.remove("site-locked");
    document.body.classList.add("site-unlocked");
  }, 420);

  window.setTimeout(() => {
    gate.hidden = true;
    document.body.classList.remove("site-unlocking");
  }, 940);
}

function canUseCloudSync() {
  return ["https:", "http:", "file:"].includes(window.location.protocol);
}

function enableCloudSync(passcode) {
  if (!canUseCloudSync()) {
    return;
  }

  cloudSync.passcode = passcode;
}

function getJsonHeaders() {
  return {
    "Content-Type": "application/json",
    "x-site-passcode": cloudSync.passcode,
  };
}

async function requestCloud(path, options = {}) {
  if (!canUseCloudSync() || !cloudSync.passcode) {
    return null;
  }

  const response = await fetch(`${cloudApiBase}${path}`, {
    ...options,
    headers: {
      ...getJsonHeaders(),
      ...(options.headers || {}),
    },
  });

  let payload = null;
  const text = await response.text();

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || "Falha na sincronizacao.");
  }

  return payload;
}

function sanitizeStoredPhotos(value) {
  return Object.fromEntries(
    Object.keys(galleries).map((galleryKey) => [
      galleryKey,
      Array.isArray(value?.[galleryKey]) ? value[galleryKey].filter((photo) => photo?.id && photo?.src) : [],
    ])
  );
}

function sanitizeStoredFavorites(value) {
  return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
}

function sanitizeStoredOrder(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return {
    ...Object.fromEntries(
    Object.keys(galleries).map((galleryKey) => [
      galleryKey,
      Array.isArray(value[galleryKey]) ? value[galleryKey].filter((id) => typeof id === "string") : [],
    ])
    ),
    __hidden: Array.isArray(value.__hidden) ? value.__hidden.filter((id) => typeof id === "string") : [],
  };
}

function hasSharedPhotos(photoCollections) {
  return Object.values(photoCollections || {}).some((photos) => Array.isArray(photos) && photos.length);
}

function hasSharedOrder(order) {
  return Object.values(order || {}).some((ids) => Array.isArray(ids) && ids.length);
}

function persistSharedStateLocally() {
  localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
  localStorage.setItem(orderKey, JSON.stringify(photoOrder));
  saveCustomPhotos(customPhotos);
}

function rebuildGalleriesFromCustomPhotos() {
  applyOfficialPhotos();
  applyCustomPhotos();
  refreshPhotoIndex();
  renderGalleries();
  syncHearts();
  renderFavoritesPage();

  Object.values(galleries).forEach((gallery) => {
    const target = document.getElementById(gallery.target);
    if (target) {
      observeReveals(target);
    }
  });
}

function applySharedState(state) {
  const remotePhotos = sanitizeStoredPhotos(state?.customPhotos);
  const remoteFavorites = sanitizeStoredFavorites(state?.favorites);
  const remoteOrder = sanitizeStoredOrder(state?.photoOrder);
  const hasRemoteData = state?.exists || hasSharedPhotos(remotePhotos) || remoteFavorites.length || hasSharedOrder(remoteOrder);

  cloudSync.applying = true;

  if (hasRemoteData) {
    customPhotos = remotePhotos;
    favorites = new Set(remoteFavorites);
    photoOrder = remoteOrder;
  }

  persistSharedStateLocally();
  rebuildGalleriesFromCustomPhotos();
  cloudSync.applying = false;

  if (!hasRemoteData) {
    scheduleSharedStateSave();
  }
}

async function syncSharedStateFromCloud() {
  if (!canUseCloudSync() || !cloudSync.passcode) {
    return;
  }

  try {
    const state = await requestCloud(cloudStateEndpoint);
    applySharedState(state);
  } catch (error) {
    console.warn("Nao consegui carregar o salvamento compartilhado.", error);
  }
}

function scheduleSharedStateSave() {
  if (!canUseCloudSync() || !cloudSync.passcode || cloudSync.applying) {
    return;
  }

  window.clearTimeout(cloudSync.saveTimer);
  cloudSync.saveTimer = window.setTimeout(saveSharedStateToCloud, 520);
}

async function saveSharedStateToCloud() {
  if (!canUseCloudSync() || !cloudSync.passcode || cloudSync.applying) {
    return;
  }

  try {
    await requestCloud(cloudStateEndpoint, {
      method: "PATCH",
      body: JSON.stringify({
        favorites: [...favorites],
        photoOrder,
      }),
    });
  } catch (error) {
    console.warn("Nao consegui salvar as mudancas no Supabase.", error);
  }
}

async function savePhotoToCloud(galleryKey, photo, sortIndex) {
  const payload = await requestCloud(cloudUploadEndpoint, {
    method: "POST",
    body: JSON.stringify({
      galleryKey,
      photo,
      sortIndex,
    }),
  });

  return payload?.photo || photo;
}

function collectAllPhotos() {
  const hidden = getHiddenPhotoIds();
  return Object.entries(galleries).flatMap(([galleryKey, gallery]) =>
    gallery.photos
      .filter((photo) => !hidden.has(photo.id))
      .map((photo) => ({ ...photo, city: gallery.label, cityKey: galleryKey }))
  );
}

function refreshPhotoIndex() {
  allPhotos = collectAllPhotos();
  photoById = new Map(allPhotos.map((photo) => [photo.id, photo]));
}

function applyOfficialPhotos() {
  Object.entries(officialPhotoFiles).forEach(([galleryKey, fileNames]) => {
    const gallery = galleries[galleryKey];
    if (!gallery || !fileNames.length) {
      return;
    }

    gallery.photos = fileNames.map((fileName, index) => createOfficialPhoto(fileName, galleryKey, index));
  });
}

function createOfficialPhoto(fileName, galleryKey, index) {
  const gallery = galleries[galleryKey];
  const number = String(index + 1).padStart(2, "0");
  const dimensions = getOfficialPhotoDimensions(galleryKey, fileName);

  return normalizeUploadedPhoto(
    {
      id: `${galleryKey}-${number}`,
      number,
      title: `${gallery.label} ${number}`,
      note: gallery.label,
      width: dimensions.width,
      height: dimensions.height,
      src: `./assets/fotos/${encodeURI(`${galleryKey}-${fileName}`)}`,
      originalSrc: `./assets/fotos/${encodeURI(`${galleryKey}-${fileName}`)}`,
    },
    galleryKey,
    index
  );
}

function getOfficialPhotoDimensions(galleryKey, fileName) {
  const photoKey = `${galleryKey}/${fileName}`;

  if (officialPanoramaPhotos.has(photoKey)) {
    return { width: 16, height: 9 };
  }

  if (officialWidePhotos.has(photoKey)) {
    return { width: 4, height: 3 };
  }

  return { width: 3, height: 4 };
}

function choosePhotoSize(photo, index) {
  const width = Number(photo.width);
  const height = Number(photo.height);

  if (!width || !height) {
    return photo.size || uploadedPhotoSizes[index % uploadedPhotoSizes.length];
  }

  const ratio = width / height;

  if (ratio >= 1.52) {
    return "span-wide";
  }

  if (ratio >= 1.12) {
    return index % 5 === 0 ? "span-large" : "span-wide";
  }

  if (ratio <= 0.84) {
    return "span-tall";
  }

  return index % 4 === 0 ? "span-large" : "span-medium";
}

function readCustomPhotos() {
  try {
    const stored = JSON.parse(localStorage.getItem(customPhotosKey) || "{}");
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
      return {};
    }

    return Object.fromEntries(
      Object.keys(galleries).map((galleryKey) => [
        galleryKey,
        Array.isArray(stored[galleryKey]) ? stored[galleryKey].filter((photo) => photo?.src) : [],
      ])
    );
  } catch {
    return {};
  }
}

function saveCustomPhotos(nextPhotos = customPhotos) {
  localStorage.setItem(customPhotosKey, JSON.stringify(nextPhotos));
}

function applyCustomPhotos() {
  Object.entries(customPhotos).forEach(([galleryKey, photos]) => {
    const gallery = galleries[galleryKey];
    if (!gallery) {
      return;
    }

    const existingIds = new Set(gallery.photos.map((photo) => photo.id));
    const baseCount = gallery.photos.length;
    photos.forEach((photo, index) => {
      if (!photo?.id || existingIds.has(photo.id)) {
        return;
      }

      gallery.photos.push(normalizeUploadedPhoto(photo, galleryKey, baseCount + index));
      existingIds.add(photo.id);
    });
  });
}

function normalizeUploadedPhoto(photo, galleryKey, index) {
  const gallery = galleries[galleryKey];
  const sizeIndex = index % uploadedPhotoSizes.length;

  return {
    id: photo.id,
    number: photo.number || String(index + 1).padStart(2, "0"),
    title: photo.title || "foto adicionada",
    note: photo.note || gallery.label,
    size: choosePhotoSize(photo, index),
    gradient: photo.gradient || "linear-gradient(135deg, #2b2521 0%, #8b5a44 54%, #d5c08d 100%)",
    drift: Array.isArray(photo.drift) ? photo.drift : uploadedPhotoDrifts[sizeIndex],
    src: photo.src,
    originalSrc: photo.originalSrc || photo.src,
    width: photo.width,
    height: photo.height,
    custom: photo.custom === true,
  };
}

function createUploadedPhoto(file, galleryKey, prepared, index = galleries[galleryKey].photos.length) {
  const gallery = galleries[galleryKey];
  const cleanName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  const src = typeof prepared === "string" ? prepared : prepared.src;
  const originalSrc = typeof prepared === "string" ? prepared : prepared.originalSrc || prepared.src;

  return normalizeUploadedPhoto(
    {
      id: `${galleryKey}-custom-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      number: String(index + 1).padStart(2, "0"),
      title: cleanName || "foto adicionada",
      note: gallery.label,
      src,
      originalSrc,
      width: prepared.width,
      height: prepared.height,
      custom: true,
    },
    galleryKey,
    index
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function resizeImage(dataUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => {
      const maxSide = options.maxSide || 1400;
      const quality = options.quality || 0.78;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve({
        src: canvas.toDataURL("image/jpeg", quality),
        width: canvas.width,
        height: canvas.height,
      });
    });

    image.addEventListener("error", reject);
    image.src = dataUrl;
  });
}

async function prepareImage(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const resized = await resizeImage(dataUrl, { maxSide: 1400, quality: 0.78 });
  const original = await resizeImage(dataUrl, { maxSide: 2400, quality: 0.9 });

  return {
    ...resized,
    originalSrc: original.src,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createPhotoFillMarkup(photo) {
  if (photo.src) {
    return `
      <div class="photo-fill has-image">
        <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.title)}" loading="lazy" decoding="async" draggable="false" />
      </div>
    `;
  }

  return `
    <div class="photo-fill" style="background: ${photo.gradient}">
      <span class="photo-number">${escapeHtml(photo.number)}</span>
    </div>
  `;
}

function getPhotoOriginalSrc(photo) {
  return photo.originalSrc || photo.src;
}

function createLightboxMarkup(photo) {
  const originalSrc = getPhotoOriginalSrc(photo);

  if (originalSrc) {
    return `
      <img
        class="lightbox-image"
        src="${escapeHtml(originalSrc)}"
        alt="${escapeHtml(photo.title)}"
        decoding="async"
        draggable="false"
        style="display:block;width:auto;height:auto;max-width:calc(100vw - 44px);max-height:calc(100vh - 112px);max-height:calc(100dvh - 112px);object-fit:contain;"
      />
    `;
  }

  return createPhotoFillMarkup(photo);
}

function createDownloadName(photo) {
  const baseName = `${photo.city || photo.note || "foto"}-${photo.number || "hd"}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${baseName || "foto-hd"}.jpg`;
}

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(favoriteKey) || "[]");
    return new Set(Array.isArray(stored) ? stored : []);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
  scheduleSharedStateSave();
}

function readPhotoOrder() {
  try {
    const stored = JSON.parse(localStorage.getItem(orderKey) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

function savePhotoOrder() {
  localStorage.setItem(orderKey, JSON.stringify(photoOrder));
  scheduleSharedStateSave();
}

function getHiddenPhotoIds() {
  return new Set(Array.isArray(photoOrder?.__hidden) ? photoOrder.__hidden : []);
}

function hidePhotoId(id) {
  const hidden = getHiddenPhotoIds();
  hidden.add(id);
  photoOrder.__hidden = [...hidden];

  Object.keys(galleries).forEach((galleryKey) => {
    if (Array.isArray(photoOrder[galleryKey])) {
      photoOrder[galleryKey] = photoOrder[galleryKey].filter((photoId) => photoId !== id);
    }
  });
}

async function deletePhotoFromCloud(photoId, removePassword) {
  const payload = await requestCloud(cloudDeleteEndpoint, {
    method: "POST",
    body: JSON.stringify({
      photoId,
      removePassword,
    }),
  });

  return payload;
}

function removePhotoLocally(photoId) {
  const photo = photoById.get(photoId);
  if (!photo) {
    return;
  }

  hidePhotoId(photoId);
  favorites.delete(photoId);

  if (photo.custom && customPhotos[photo.cityKey]) {
    customPhotos = {
      ...customPhotos,
      [photo.cityKey]: customPhotos[photo.cityKey].filter((item) => item.id !== photoId),
    };
    saveCustomPhotos(customPhotos);
  }

  localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
  savePhotoOrder();
  rebuildGalleriesFromCustomPhotos();
}

function getOrderedPhotos(galleryKey) {
  const hidden = getHiddenPhotoIds();
  const photos = galleries[galleryKey].photos.filter((photo) => !hidden.has(photo.id));
  const savedOrder = Array.isArray(photoOrder[galleryKey]) ? photoOrder[galleryKey] : [];
  const savedRank = new Map(savedOrder.map((id, index) => [id, index]));
  const defaultRank = new Map(photos.map((photo, index) => [photo.id, index]));

  return [...photos].sort((a, b) => {
    const aRank = savedRank.has(a.id) ? savedRank.get(a.id) : 1000 + defaultRank.get(a.id);
    const bRank = savedRank.has(b.id) ? savedRank.get(b.id) : 1000 + defaultRank.get(b.id);
    return aRank - bRank;
  });
}

function getLightboxPhotoList(photo) {
  const galleryKey = photo?.cityKey;
  const gallery = galleries[galleryKey];

  if (!gallery) {
    return allPhotos;
  }

  return getOrderedPhotos(galleryKey).map((item) => ({
    ...item,
    city: gallery.label,
    cityKey: galleryKey,
  }));
}

function createPhotoCard(photo, variant = "memory-card", galleryKey = "") {
  const article = document.createElement("article");
  article.className =
    variant === "favorite-tile"
      ? "favorite-tile reveal"
      : `memory-card ${photo.size} reveal`;
  article.dataset.photoId = photo.id;

  if (variant !== "favorite-tile") {
    article.dataset.cityKey = galleryKey;
    const [x, y, r, dur, delay] = photo.drift || uploadedPhotoDrifts[0];
    article.style.setProperty("--drift-x", x);
    article.style.setProperty("--drift-y", y);
    article.style.setProperty("--drift-r", r);
    article.style.setProperty("--dur", dur);
    article.style.setProperty("--delay", delay);
  }

  article.innerHTML = `
    <div class="drift-layer">
      <div class="photo-frame" role="button" tabindex="0" data-open-photo="${escapeHtml(photo.id)}" aria-label="Ampliar foto ${escapeHtml(photo.number)} de ${escapeHtml(photo.city)}">
        ${createPhotoFillMarkup(photo)}
        <button class="heart-button" type="button" data-heart-id="${escapeHtml(photo.id)}" aria-label="Favoritar ${escapeHtml(photo.title)}">
          <span aria-hidden="true">♥</span>
        </button>
      </div>
    </div>
  `;

  return article;
}

function renderGalleries() {
  Object.entries(galleries).forEach(([galleryKey, gallery]) => {
    const target = document.getElementById(gallery.target);
    if (!target) {
      return;
    }

    target.innerHTML = "";

    getOrderedPhotos(galleryKey).forEach((photo) => {
      target.appendChild(createPhotoCard({ ...photo, city: gallery.label }, "memory-card", galleryKey));
    });
  });

  syncGalleryCounts();
}

function syncGalleryCounts() {
  Object.entries(galleries).forEach(([galleryKey, gallery]) => {
    const count = gallery.photos.length;
    const target = document.querySelector(`[data-steps-city="${galleryKey}"]`);
    if (target) {
      target.textContent = count === 1 ? "1 foto" : `${count} fotos`;
    }
  });
}

function renderFavoritesPage() {
  const grid = document.getElementById("favoritesGrid");
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  const favoritePhotos = allPhotos.filter((photo) => favorites.has(photo.id));

  if (!favoritePhotos.length) {
    const empty = document.createElement("p");
    empty.className = "favorites-empty reveal";
    empty.textContent = "Nenhuma foto curtida ainda.";
    grid.appendChild(empty);
  } else {
    favoritePhotos.forEach((photo) => {
      grid.appendChild(createPhotoCard(photo, "favorite-tile"));
    });
  }

  syncHearts();
  observeReveals(grid);
}

function syncHearts() {
  const favoriteCount = document.getElementById("favoriteCount");
  if (favoriteCount) {
    favoriteCount.textContent = favorites.size;
  }

  const favoritesTotal = document.getElementById("favoritesTotal");
  if (favoritesTotal) {
    favoritesTotal.textContent = favorites.size === 1 ? "1 foto" : `${favorites.size} fotos`;
  }

  document.querySelectorAll("[data-heart-id]").forEach((button) => {
    const isFavorite = favorites.has(button.dataset.heartId);
    button.classList.toggle("is-favorited", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
  });
}

function toggleFavorite(id, sourceButton) {
  if (!photoById.has(id)) {
    return;
  }

  if (favorites.has(id)) {
    favorites.delete(id);
  } else {
    favorites.add(id);
  }

  saveFavorites();
  syncHearts();

  document.querySelectorAll(`[data-heart-id="${id}"]`).forEach((button) => {
    button.classList.remove("is-popping");
    window.requestAnimationFrame(() => button.classList.add("is-popping"));
  });

  if (sourceButton) {
    window.setTimeout(() => {
      sourceButton.classList.remove("is-popping");
    }, 460);
  }

  renderFavoritesPage();
}

function observeReveals(root = document) {
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
    revealObserver.observe(element);
  });
}

function setupRevealObserver() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );
}

function setupFavoritesButton() {
  syncHearts();
}

function setupHeartClicks() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-heart-id]");
    if (!button) {
      return;
    }

    event.preventDefault();
    toggleFavorite(button.dataset.heartId, button);
  });
}

function setupPhotoUploads() {
  document.querySelectorAll("[data-add-photo]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector(`[data-photo-input="${button.dataset.addPhoto}"]`);
      input?.click();
    });
  });

  document.querySelectorAll("[data-photo-input]").forEach((input) => {
    input.addEventListener("change", async () => {
      const files = [...(input.files || [])];
      const galleryKey = input.dataset.photoInput;
      input.value = "";

      if (!files.length || !galleries[galleryKey]) {
        return;
      }

      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (!imageFiles.length) {
        window.alert("Escolha uma imagem para adicionar ao mural.");
        return;
      }

      await addPhotosToGallery(imageFiles, galleryKey);
    });
  });
}

async function addPhotosToGallery(files, galleryKey) {
  const button = document.querySelector(`[data-add-photo="${galleryKey}"]`);

  if (button) {
    button.disabled = true;
    button.textContent = files.length === 1 ? "Adicionando..." : `Adicionando ${files.length} fotos...`;
  }

  try {
    const baseIndex = galleries[galleryKey].photos.length;
    const photos = [];

    for (const [index, file] of files.entries()) {
      const src = await prepareImage(file);
      const photo = createUploadedPhoto(file, galleryKey, src, baseIndex + index);

      if (canUseCloudSync() && cloudSync.passcode) {
        photos.push(await savePhotoToCloud(galleryKey, photo, baseIndex + index));
      } else {
        photos.push(photo);
      }
    }

    const nextCustomPhotos = {
      ...customPhotos,
      [galleryKey]: [...(customPhotos[galleryKey] || []), ...photos],
    };

    saveCustomPhotos(nextCustomPhotos);
    customPhotos = nextCustomPhotos;
    galleries[galleryKey].photos.push(...photos);
    refreshPhotoIndex();
    renderGalleries();
    syncHearts();
    renderFavoritesPage();

    const gallery = document.getElementById(galleries[galleryKey].target);
    if (gallery) {
      observeReveals(gallery);
    }
  } catch {
    window.alert("Nao consegui salvar essa foto. Tente uma imagem menor ou outra foto.");
  } finally {
    if (button) {
      button.disabled = false;
      button.innerHTML = '<span aria-hidden="true">+</span>Adicionar foto';
    }
  }
}

function setupPhotoLightbox() {
  const lightbox = document.getElementById("photoLightbox");
  const closeButton = document.getElementById("lightboxClose");
  const prevButton = document.getElementById("lightboxPrev");
  const nextButton = document.getElementById("lightboxNext");
  const removeButton = document.getElementById("lightboxRemove");

  if (!lightbox || !closeButton) {
    return;
  }

  document.addEventListener("pointerdown", (event) => {
    const opener = event.target.closest("[data-open-photo]");

    if (!opener || event.target.closest("[data-heart-id]")) {
      return;
    }

    photoPress = {
      opener,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
  });

  document.addEventListener(
    "pointermove",
    (event) => {
      if (!photoPress || event.pointerId !== photoPress.pointerId) {
        return;
      }

      const moved = Math.hypot(event.clientX - photoPress.startX, event.clientY - photoPress.startY);
      if (moved > 12) {
        photoPress.moved = true;
      }
    },
    { passive: true }
  );

  document.addEventListener("pointerup", (event) => {
    if (!photoPress || event.pointerId !== photoPress.pointerId) {
      return;
    }

    const { opener, moved } = photoPress;
    photoPress = null;

    if (moved || suppressPhotoOpen || event.target.closest("[data-heart-id]")) {
      return;
    }

    const releasedInside = opener === event.target.closest("[data-open-photo]") || opener.contains(event.target);
    if (!releasedInside) {
      return;
    }

    event.preventDefault();
    requestOpenPhoto(opener.dataset.openPhoto);
  });

  document.addEventListener("pointercancel", (event) => {
    if (photoPress && event.pointerId === photoPress.pointerId) {
      photoPress = null;
    }
  });

  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-photo]");

    if (!opener || event.target.closest("[data-heart-id]")) {
      return;
    }

    if (suppressPhotoOpen) {
      return;
    }

    requestOpenPhoto(opener.dataset.openPhoto);
  });

  document.addEventListener("keydown", (event) => {
    const opener = event.target.closest?.("[data-open-photo]");

    if (opener && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      requestOpenPhoto(opener.dataset.openPhoto);
      return;
    }

    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
      return;
    }

    if (event.key === "ArrowLeft" && !lightbox.hidden) {
      event.preventDefault();
      navigateLightbox(-1);
      return;
    }

    if (event.key === "ArrowRight" && !lightbox.hidden) {
      event.preventDefault();
      navigateLightbox(1);
    }
  });

  prevButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    navigateLightbox(-1);
  });

  nextButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    navigateLightbox(1);
  });

  removeButton?.addEventListener("click", async (event) => {
    event.stopPropagation();
    await requestRemoveCurrentPhoto(removeButton);
  });

  lightbox.addEventListener("pointerdown", startLightboxSwipe);
  lightbox.addEventListener("pointermove", moveLightboxSwipe);
  lightbox.addEventListener("pointerup", finishLightboxSwipe);
  lightbox.addEventListener("pointercancel", cancelLightboxSwipe);

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (suppressLightboxClick) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

function requestOpenPhoto(id) {
  const now = Date.now();
  if (now - lastPhotoOpenAt < 220) {
    return;
  }

  lastPhotoOpenAt = now;
  openLightbox(id);
}

async function requestRemoveCurrentPhoto(button) {
  const photo = photoById.get(currentLightboxPhotoId);

  if (!photo) {
    return;
  }

  const password = window.prompt("Digite a senha para remover esta foto:");
  if (password === null) {
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Removendo...";
  }

  try {
    if (!canUseCloudSync() || !cloudSync.passcode) {
      window.alert("Para remover fotos, abra o site publicado e entre com a senha do mural primeiro.");
      return;
    }

    await deletePhotoFromCloud(photo.id, password.trim());

    const currentPhoto = photoById.get(photo.id);
    const nextPhoto = currentPhoto ? getLightboxPhotoList(currentPhoto).find((item) => item.id !== photo.id) : null;
    removePhotoLocally(photo.id);

    if (nextPhoto && photoById.has(nextPhoto.id)) {
      renderLightboxPhoto(photoById.get(nextPhoto.id));
    } else {
      closeLightbox();
    }
  } catch (error) {
    window.alert(error.message || "Nao consegui remover essa foto.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Remover";
    }
  }
}

function updateLightboxNav(photo) {
  const hasNavigation = getLightboxPhotoList(photo).length > 1;
  const prevButton = document.getElementById("lightboxPrev");
  const nextButton = document.getElementById("lightboxNext");

  if (prevButton) {
    prevButton.hidden = !hasNavigation;
  }

  if (nextButton) {
    nextButton.hidden = !hasNavigation;
  }
}

function renderLightboxPhoto(photo) {
  const frame = document.getElementById("lightboxFrame");
  const downloadButton = document.getElementById("lightboxDownload");

  if (!photo || !frame) {
    return;
  }

  currentLightboxPhotoId = photo.id;
  frame.innerHTML = `
    ${createLightboxMarkup(photo)}
  `;

  if (downloadButton) {
    const originalSrc = getPhotoOriginalSrc(photo);
    if (originalSrc) {
      downloadButton.href = originalSrc;
      downloadButton.download = createDownloadName(photo);
      downloadButton.hidden = false;
    } else {
      downloadButton.hidden = true;
    }
  }

  updateLightboxNav(photo);
}

function navigateLightbox(direction) {
  const currentPhoto = photoById.get(currentLightboxPhotoId);

  if (!currentPhoto) {
    return;
  }

  const photoList = getLightboxPhotoList(currentPhoto);

  if (photoList.length < 2) {
    return;
  }

  const currentIndex = photoList.findIndex((photo) => photo.id === currentPhoto.id);
  if (currentIndex < 0) {
    return;
  }

  const nextIndex = (currentIndex + direction + photoList.length) % photoList.length;
  const nextPhoto = photoList[nextIndex];

  if (nextPhoto) {
    renderLightboxPhoto(nextPhoto);
  }
}

function openLightbox(id) {
  const photo = photoById.get(id);
  const lightbox = document.getElementById("photoLightbox");
  const closeButton = document.getElementById("lightboxClose");

  if (!photo || !lightbox) {
    return;
  }

  renderLightboxPhoto(photo);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  closeButton?.focus();
}

function closeLightbox() {
  const lightbox = document.getElementById("photoLightbox");
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  currentLightboxPhotoId = "";
  lightboxSwipe = null;
  document.body.classList.remove("lightbox-open");
}

function startLightboxSwipe(event) {
  const currentPhoto = photoById.get(currentLightboxPhotoId);

  if (!currentPhoto || getLightboxPhotoList(currentPhoto).length < 2) {
    return;
  }

  if (event.button !== undefined && event.button > 0) {
    return;
  }

  if (event.target.closest?.(".lightbox-close, .lightbox-download, .lightbox-remove, .lightbox-nav")) {
    return;
  }

  lightboxSwipe = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    deltaX: 0,
    deltaY: 0,
    swiping: false,
  };

  try {
    event.currentTarget.setPointerCapture(event.pointerId);
  } catch {
    // Some browsers may skip pointer capture for touch gestures.
  }
}

function moveLightboxSwipe(event) {
  if (!lightboxSwipe || event.pointerId !== lightboxSwipe.pointerId) {
    return;
  }

  lightboxSwipe.deltaX = event.clientX - lightboxSwipe.startX;
  lightboxSwipe.deltaY = event.clientY - lightboxSwipe.startY;

  const horizontal = Math.abs(lightboxSwipe.deltaX);
  const vertical = Math.abs(lightboxSwipe.deltaY);

  if (horizontal > 10 && horizontal > vertical * 1.25) {
    lightboxSwipe.swiping = true;
  }

  if (lightboxSwipe.swiping) {
    event.preventDefault();
  }
}

function finishLightboxSwipe(event) {
  if (!lightboxSwipe || event.pointerId !== lightboxSwipe.pointerId) {
    return;
  }

  const { deltaX, deltaY, swiping } = lightboxSwipe;
  const horizontal = Math.abs(deltaX);
  const vertical = Math.abs(deltaY);

  lightboxSwipe = null;

  try {
    event.currentTarget.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture can already be released after quick taps.
  }

  if (!swiping || horizontal < 54 || horizontal < vertical * 1.35) {
    return;
  }

  suppressLightboxClick = true;
  window.setTimeout(() => {
    suppressLightboxClick = false;
  }, 180);

  navigateLightbox(deltaX < 0 ? 1 : -1);
}

function cancelLightboxSwipe(event) {
  if (lightboxSwipe && event.pointerId === lightboxSwipe.pointerId) {
    lightboxSwipe = null;
  }
}

function setupClosingNote() {
  const trigger = document.getElementById("closingHeart");
  const note = document.getElementById("closingNote");
  const closeButton = document.getElementById("closingNoteClose");

  if (!trigger || !note || !closeButton) {
    return;
  }

  const openNote = () => {
    note.hidden = false;
    document.body.classList.add("note-open");
    closeButton.focus();
  };

  const closeNote = () => {
    note.hidden = true;
    document.body.classList.remove("note-open");
    trigger.focus();
  };

  trigger.addEventListener("click", openNote);
  closeButton.addEventListener("click", closeNote);

  note.addEventListener("click", (event) => {
    if (event.target === note) {
      closeNote();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !note.hidden) {
      closeNote();
    }
  });
}

function setupTripLocks() {
  const message = document.getElementById("tripLockMessage");
  const closeButton = document.getElementById("tripLockClose");
  const lockedCards = document.querySelectorAll("[data-locked-trip]");
  let lastTrigger = null;

  if (!message || !closeButton || !lockedCards.length) {
    return;
  }

  const openMessage = (trigger) => {
    lastTrigger = trigger;
    message.hidden = false;
    document.body.classList.add("trip-modal-open");
    closeButton.focus();
  };

  const closeMessage = () => {
    message.hidden = true;
    document.body.classList.remove("trip-modal-open");

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  };

  lockedCards.forEach((card) => {
    card.addEventListener("click", () => openMessage(card));
  });

  closeButton.addEventListener("click", closeMessage);

  message.addEventListener("click", (event) => {
    if (event.target === message) {
      closeMessage();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !message.hidden) {
      closeMessage();
    }
  });
}

function setupDragSorting() {
  document.addEventListener("pointerdown", handleSortPointerDown);
  document.addEventListener("pointermove", handleSortPointerMove, { passive: false });
  document.addEventListener("pointerup", finishSortDrag);
  document.addEventListener("pointercancel", finishSortDrag);
  document.addEventListener("contextmenu", preventGalleryContextMenu);
}

function preventGalleryContextMenu(event) {
  if (event.target.closest(".memory-card")) {
    event.preventDefault();
  }
}

function handleSortPointerDown(event) {
  if (event.button !== undefined && event.button !== 0) {
    return;
  }

  if (event.target.closest("[data-heart-id]")) {
    return;
  }

  const card = event.target.closest(".memory-card");
  const grid = card?.closest(".memory-grid");

  if (!card || !grid) {
    return;
  }

  const rect = card.getBoundingClientRect();
  pendingDrag = {
    card,
    grid,
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    startX: event.clientX,
    startY: event.clientY,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    timer: null,
  };

  if (event.pointerType === "touch") {
    event.preventDefault();
    pendingDrag.timer = window.setTimeout(beginSortDrag, 180);
  }
}

function handleSortPointerMove(event) {
  if (pendingDrag && event.pointerId === pendingDrag.pointerId) {
    const moved = Math.hypot(event.clientX - pendingDrag.startX, event.clientY - pendingDrag.startY);

    if (pendingDrag.pointerType === "touch" && moved > 28) {
      cancelPendingDrag();
      return;
    }

    if (pendingDrag.pointerType !== "touch" && moved > 4) {
      beginSortDrag();
    }
  }

  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  event.preventDefault();
  dragState.lastX = event.clientX;
  dragState.lastY = event.clientY;
  moveDraggedCard();
  reorderDraggedCard();
}

function beginSortDrag() {
  if (!pendingDrag) {
    return;
  }

  const { card, grid, pointerId, offsetX, offsetY, startX, startY } = pendingDrag;
  window.clearTimeout(pendingDrag.timer);
  pendingDrag = null;
  photoPress = null;
  suppressPhotoOpen = true;

  try {
    card.setPointerCapture(pointerId);
  } catch {
    // Some browsers release capture during touch gestures; document listeners still handle the drag.
  }

  dragState = {
    card,
    grid,
    pointerId,
    offsetX,
    offsetY,
    lastX: startX,
    lastY: startY,
  };

  card.classList.add("is-dragging");
  grid.classList.add("is-sorting");
  document.body.classList.add("is-dragging-gallery");
  moveDraggedCard();
}

function cancelPendingDrag() {
  if (!pendingDrag) {
    return;
  }

  window.clearTimeout(pendingDrag.timer);
  pendingDrag = null;
}

function getBaseRect(card) {
  const currentTransform = card.style.transform;
  card.style.transform = "";
  const rect = card.getBoundingClientRect();
  card.style.transform = currentTransform;
  return rect;
}

function moveDraggedCard() {
  const { card, lastX, lastY, offsetX, offsetY } = dragState;
  const baseRect = getBaseRect(card);
  const deltaX = lastX - baseRect.left - offsetX;
  const deltaY = lastY - baseRect.top - offsetY;
  const tilt = Math.max(Math.min(deltaX * 0.012, 4), -4);

  card.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.035) rotate(${tilt}deg)`;
}

function snapshotGridPositions(grid) {
  const positions = new Map();
  grid.querySelectorAll(".memory-card").forEach((card) => {
    positions.set(card, card.getBoundingClientRect());
  });
  return positions;
}

function animateGridShift(grid, previousPositions, ignoredCard) {
  grid.querySelectorAll(".memory-card").forEach((card) => {
    if (card === ignoredCard) {
      return;
    }

    const previous = previousPositions.get(card);
    if (!previous) {
      return;
    }

    const next = card.getBoundingClientRect();
    const deltaX = previous.left - next.left;
    const deltaY = previous.top - next.top;

    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
      return;
    }

    card.animate(
      [
        { transform: `translate3d(${deltaX}px, ${deltaY}px, 0)` },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 360,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }
    );
  });
}

function reorderDraggedCard() {
  const { card, grid, lastX, lastY } = dragState;
  card.style.pointerEvents = "none";
  const elementBelow = document.elementFromPoint(lastX, lastY);
  card.style.pointerEvents = "";

  const target = elementBelow?.closest(".memory-card");
  if (!target || target === card || target.parentElement !== grid) {
    return;
  }

  const targetRect = target.getBoundingClientRect();
  const previousPositions = snapshotGridPositions(grid);
  const insertBefore = lastY < targetRect.top + targetRect.height / 2;

  if (insertBefore) {
    grid.insertBefore(card, target);
  } else {
    grid.insertBefore(card, target.nextSibling);
  }

  animateGridShift(grid, previousPositions, card);
  saveGridOrder(grid);
  moveDraggedCard();
}

function saveGridOrder(grid) {
  const cityKey = grid.dataset.city;
  photoOrder[cityKey] = [...grid.querySelectorAll(".memory-card")].map((card) => card.dataset.photoId);
  savePhotoOrder();
}

function finishSortDrag(event) {
  if (pendingDrag && event.pointerId === pendingDrag.pointerId) {
    cancelPendingDrag();
  }

  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  const { card, grid } = dragState;
  const currentTransform = card.style.transform;
  try {
    card.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture may already be gone when the browser cancels the touch.
  }
  card.classList.remove("is-dragging");
  grid.classList.remove("is-sorting");
  document.body.classList.remove("is-dragging-gallery");
  card.style.pointerEvents = "";
  card.style.transform = "";

  card.animate(
    [
      { transform: currentTransform },
      { transform: "translate3d(0, 0, 0) scale(1)" },
    ],
    {
      duration: 300,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    }
  );

  saveGridOrder(grid);
  dragState = null;
  suppressPhotoOpen = true;
  window.setTimeout(() => {
    suppressPhotoOpen = false;
  }, 0);
}

function setupStorageSync() {
  window.addEventListener("storage", (event) => {
    if (event.key === favoriteKey) {
      favorites = readFavorites();
      syncHearts();
      renderFavoritesPage();
    }

    if (event.key === orderKey) {
      photoOrder = readPhotoOrder();
    }
  });
}

function setupParallax() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];

  if (reduceMotion || !parallaxItems.length) {
    return;
  }

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight || 1;

    parallaxItems.forEach((item) => {
      const band = item.closest(".transition-band");
      const rect = band.getBoundingClientRect();
      const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
      const offset = Math.max(Math.min(distanceFromCenter * -0.08, 32), -32);
      item.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
}

setupPasswordGate();
renderGalleries();
setupRevealObserver();
setupHeartClicks();
setupPhotoUploads();
setupDragSorting();
setupFavoritesButton();
setupPhotoLightbox();
setupClosingNote();
setupTripLocks();
setupStorageSync();
setupParallax();
observeReveals();
syncHearts();
renderFavoritesPage();
