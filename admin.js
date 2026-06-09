const adminEndpoint = "/api/admin";
const apiBase = location.hostname && location.hostname !== "siteviagensv2.vercel.app" ? "https://siteviagensv2.vercel.app" : "";
let adminToken = "";
let dashboardData = null;
let liveTimer = 0;
let currentAdminName = "";

const $ = (selector) => document.querySelector(selector);
const fmt = (value) => (value ? new Date(value).toLocaleString("pt-BR") : "-");
const esc = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

async function api(action, body = {}, method = "POST") {
  const response = await fetch(`${apiBase}${adminEndpoint}${method === "GET" ? `?action=${action}` : ""}`, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
    body: method === "GET" ? undefined : JSON.stringify({ ...body, action }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Erro no admin.");
  return payload;
}

function adminVisitorId() {
  const key = "site-viagens-admin-visitor";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, value);
  }
  return value;
}

function browserInfo() {
  const ua = navigator.userAgent || "";
  return {
    device: /Mobi|Android|iPhone|iPad/i.test(ua) ? "Celular/tablet" : "Computador",
    browser: ua.includes("Edg/") ? "Edge" : ua.includes("Chrome/") ? "Chrome" : ua.includes("Firefox/") ? "Firefox" : ua.includes("Safari/") ? "Safari" : "Navegador",
    os: ua.includes("Windows") ? "Windows" : ua.includes("Android") ? "Android" : ua.includes("iPhone") || ua.includes("iPad") ? "iOS" : ua.includes("Mac") ? "macOS" : "Sistema",
  };
}

function adminEventBody(type, label = "", details = {}) {
  return {
    action: "event",
    type,
    label,
    details,
    visitorId: adminVisitorId(),
    page: `${location.pathname}${location.hash || ""}`,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    online: navigator.onLine,
    ...browserInfo(),
  };
}

function trackAdminPageOpen() {
  fetch(`${apiBase}${adminEndpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adminEventBody("admin_page_open", "admin aberto")),
  }).catch(() => {});
}

function showDashboard() {
  $("#adminLogin").hidden = true;
  $("#dashboard").hidden = false;
}

function showLogin() {
  $("#adminLogin").hidden = false;
  $("#dashboard").hidden = true;
}

async function login(userName, password) {
  currentAdminName = userName.trim();
  const payload = await api("login", {
    ...adminEventBody("admin_login", currentAdminName, { userName: currentAdminName }),
    userName: currentAdminName,
    password: password.trim(),
  });
  adminToken = payload.token;
  showDashboard();
  window.scrollTo(0, 0);
  await loadDashboard();
  startLiveUpdates();
}

async function loadDashboard() {
  try {
    dashboardData = await api("dashboard", {}, "GET");
    renderAll();
    const status = $("#liveStatus");
    if (status) status.textContent = `Ao vivo - atualizado ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
  } catch (error) {
    const status = $("#liveStatus");
    if (status) status.textContent = "Conexao instavel - tentando atualizar";
    if (!dashboardData) throw error;
  }
}

function startLiveUpdates() {
  window.clearInterval(liveTimer);
  liveTimer = window.setInterval(() => {
    if (adminToken && !document.hidden) loadDashboard().catch(() => {});
  }, 8000);
}

function metric(label, value) {
  return `<article class="metric"><span>${esc(label)}</span><strong>${esc(value ?? "-")}</strong></article>`;
}

function eventLabel(event) {
  const names = {
    page_view: "acessou o site",
    favorite_click: "clicou no coracao",
    calendar_click: "abriu viagens",
    trip_click: "clicou em viagem",
    locked_trip_click: "tentou viagem bloqueada",
    modal_open: "abriu modal",
    photo_open: "abriu foto",
    photo_upload: "adicionou foto",
    admin_page_open: "abriu o admin",
    admin_login_success: "login admin aprovado",
    admin_login_failed: "login admin negado",
    admin_photo_upload: "admin adicionou foto",
    admin_photo_hide: "admin tirou foto do site",
    admin_photo_restore: "admin restaurou foto",
    favorite_added: "foto curtida",
    favorite_removed: "curtida removida",
    permission: "permissao",
    online: "ficou online",
    offline: "ficou offline",
  };
  return names[event.type] || event.type;
}

function renderMetrics() {
  const m = dashboardData.metrics || {};
  $("#metrics").innerHTML = [
    metric("Total de acessos", m.totalAccesses),
    metric("Visitantes unicos", m.uniqueVisitors),
    metric("Acessos hoje", m.todayAccesses),
    metric("Ultimo acesso", m.lastAccess ? fmt(m.lastAccess) : "-"),
    metric("Fotos adicionadas", m.uploadedPhotos),
    metric("Permissoes aceitas", m.permissionsAccepted),
    metric("Permissoes negadas", m.permissionsDenied),
  ].join("");
}

function renderTimeline(target, events, limit = 80) {
  $(target).innerHTML =
    (events || [])
      .slice(0, limit)
      .map(
        (event) =>
          `<div class="event"><strong>${esc(eventLabel(event))}</strong><span>${fmt(event.at)} - ${esc(
            event.page || "-"
          )}${event.label ? ` - ${esc(event.label)}` : ""}</span></div>`
      )
      .join("") || `<div class="event"><span>Nenhum evento registrado ainda.</span></div>`;
}

function renderVisitors() {
  const rows = dashboardData.visitors || [];
  $("#visitorCards").innerHTML =
    rows
      .slice(0, 6)
      .map(
        (v) =>
          `<div class="visitor"><strong>${esc(v.userName || v.device || "Visitante")}</strong><span>${fmt(v.lastSeenAt)} - ${esc(
            v.lastPage || "-"
          )}</span></div>`
      )
      .join("") || `<div class="visitor"><span>Nenhum visitante ainda.</span></div>`;
  $("#visitorsTable").innerHTML =
    rows
      .map(
        (v) =>
          `<tr><td>${fmt(v.lastSeenAt)}</td><td>${esc(v.userName || "-")}</td><td>${esc(v.lastPage)}</td><td>${esc(v.device)}</td><td>${esc(
            v.browser
          )}</td><td>${esc(v.os)}</td><td>${esc(v.screen)}</td><td>${esc(v.language)}</td><td>${esc(
            v.ip
          )}</td><td>${esc([v.geo?.city, v.geo?.country].filter(Boolean).join("/"))}</td><td>${
            v.online ? "online" : "offline"
          }</td></tr>`
      )
      .join("") || `<tr><td colspan="11">Nenhum visitante registrado.</td></tr>`;
}

function renderPermissions() {
  $("#permissionsTable").innerHTML =
    (dashboardData.permissions || [])
      .map(
        (e) =>
          `<tr><td>${fmt(e.at)}</td><td>${esc(e.details?.permission || e.label)}</td><td>${esc(
            e.details?.state || "-"
          )}</td><td>${esc(e.page)}</td><td>${esc(e.visitorId)}</td></tr>`
      )
      .join("") || `<tr><td colspan="5">Nenhuma permissao registrada.</td></tr>`;
}

function renderInteractions() {
  $("#interactionsTable").innerHTML =
    (dashboardData.interactions || [])
      .map(
        (e) =>
          `<tr><td>${fmt(e.at)}</td><td>${esc(eventLabel(e))}</td><td>${esc(
            e.label || e.details?.button || "-"
          )}</td><td>${esc(e.page)}</td><td>${esc(e.visitorId)}</td></tr>`
      )
      .join("") || `<tr><td colspan="5">Nenhuma interacao registrada.</td></tr>`;
}

function renderPhotos() {
  const photos = dashboardData.photos || [];
  const citySummary = photos.reduce((acc, photo) => {
    const key = photo.city || "Sem cidade";
    acc[key] = acc[key] || { total: 0, hidden: 0 };
    acc[key].total += 1;
    if (photo.hidden) acc[key].hidden += 1;
    return acc;
  }, {});

  $("#photoSummary").innerHTML = Object.entries(citySummary)
    .map(([city, data]) => `<div class="event"><strong>${esc(city)}</strong><span>${data.total} fotos - ${data.hidden} ocultadas</span></div>`)
    .join("") || `<div class="event"><span>Nenhuma foto encontrada ainda.</span></div>`;

  $("#photosGrid").innerHTML =
    photos
    .map(
      (photo) => `
        <article class="photo-card ${photo.hidden ? "is-hidden" : ""}">
          <div class="photo-thumb">${
            photo.thumbnail
              ? `<img src="${esc(photo.thumbnail)}" data-preview="${esc(photo.original || photo.thumbnail)}" alt="${esc(photo.name)}" />`
              : `<span>${esc(photo.id)}</span>`
          }</div>
          <div class="photo-body">
            <h4>${esc(photo.name)}</h4>
            <p>${esc(photo.city)} - ${esc(photo.type)} ${photo.hidden ? "- ocultada" : ""}</p>
            <button data-photo-action="${photo.hidden ? "restore" : "hide"}" data-photo-id="${esc(photo.id)}">${
        photo.hidden ? "Restaurar" : "Tirar do site"
      }</button>
          </div>
        </article>`
    )
    .join("") || `<div class="event"><span>Nenhuma foto encontrada ainda.</span></div>`;
}

function renderSystem() {
  const s = dashboardData.system || {};
  $("#systemList").innerHTML = Object.entries({
    Status: s.status,
    Versao: s.version,
    Ambiente: s.environment,
    Storage: s.storage,
    Atualizado: fmt(s.updatedAt),
  })
    .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`)
    .join("");
}

function renderAll() {
  renderMetrics();
  renderVisitors();
  renderPermissions();
  renderInteractions();
  renderPhotos();
  renderSystem();
  renderTimeline("#overviewTimeline", dashboardData.events, 8);
  renderTimeline("#activityTimeline", dashboardData.events, 120);
}

async function changePhoto(id, action) {
  await api("photo", { photoId: id, photoAction: action, userName: currentAdminName, ...adminEventBody("admin_photo_action", id, { userName: currentAdminName, photoId: id }) });
  await loadDashboard();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Nao consegui ler essa foto."));
    reader.readAsDataURL(file);
  });
}

function imageDimensions(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth || 1, height: image.naturalHeight || 1 });
    image.onerror = () => resolve({ width: 1, height: 1 });
    image.src = src;
  });
}

function photoSize(width, height, index) {
  const ratio = width / Math.max(height, 1);
  if (ratio > 1.55) return "span-wide";
  if (ratio < 0.72) return "span-tall";
  return index % 5 === 0 ? "span-large" : "span-medium";
}

async function uploadAdminPhotos() {
  const city = $("#adminUploadCity").value;
  const files = [...$("#adminUploadFiles").files].filter((file) => file.type.startsWith("image/"));
  const message = $("#adminUploadMessage");

  if (!files.length) {
    message.textContent = "Escolha pelo menos uma foto.";
    return;
  }

  message.textContent = `Enviando ${files.length} foto(s)...`;

  for (const [index, file] of files.entries()) {
    const dataUrl = await fileToDataUrl(file);
    const dimensions = await imageDimensions(dataUrl);
    const id = `${city}-admin-${Date.now()}-${index}-${Math.random().toString(16).slice(2, 8)}`;
    await api("upload-photo", {
      ...adminEventBody("admin_photo_upload", file.name, { userName: currentAdminName, city, fileName: file.name }),
      userName: currentAdminName,
      galleryKey: city,
      sortIndex: index,
      photo: {
        id,
        number: "admin",
        title: file.name.replace(/\.[^.]+$/, "") || "foto adicionada",
        note: "Adicionada pelo admin",
        size: photoSize(dimensions.width, dimensions.height, index),
        src: dataUrl,
        originalSrc: dataUrl,
        width: dimensions.width,
        height: dimensions.height,
        custom: true,
      },
    });
  }

  $("#adminUploadFiles").value = "";
  message.textContent = "Foto(s) adicionada(s) ao mural.";
  await loadDashboard();
}

function logout() {
  adminToken = "";
  currentAdminName = "";
  window.clearInterval(liveTimer);
  showLogin();
  window.scrollTo(0, 0);
}

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#loginMessage").textContent = "";
  try {
    await login($("#adminUserName").value, $("#adminPassword").value);
  } catch (error) {
    $("#loginMessage").textContent = error.message;
  }
});

document.addEventListener("click", async (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) {
    document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("active", button === tab));
    document.querySelectorAll("[data-view]").forEach((view) => view.classList.toggle("active", view.dataset.view === tab.dataset.tab));
  }

  const photoButton = event.target.closest("[data-photo-action]");
  if (photoButton) {
    photoButton.disabled = true;
    photoButton.textContent = "Salvando...";
    try {
      await changePhoto(photoButton.dataset.photoId, photoButton.dataset.photoAction);
    } catch (error) {
      window.alert(error.message);
    }
  }

  const preview = event.target.closest("[data-preview]");
  if (preview) {
    $("#photoImage").src = preview.dataset.preview;
    $("#photoModal").hidden = false;
  }
});

$("#refreshButton").addEventListener("click", loadDashboard);
$("#adminUploadForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  try {
    await uploadAdminPhotos();
  } catch (error) {
    $("#adminUploadMessage").textContent = error.message || "Nao consegui enviar a foto.";
  } finally {
    button.disabled = false;
  }
});
$("#logoutButton").addEventListener("click", logout);
$("#settingsLogout").addEventListener("click", logout);
$("#clearButton").addEventListener("click", async () => {
  if (window.confirm("Limpar dados de teste do painel?")) {
    await api("clear-test");
    await loadDashboard();
  }
});
$("#photoClose").addEventListener("click", () => ($("#photoModal").hidden = true));
$("#photoModal").addEventListener("click", (event) => {
  if (event.target.id === "photoModal") $("#photoModal").hidden = true;
});

showLogin();
trackAdminPageOpen();
