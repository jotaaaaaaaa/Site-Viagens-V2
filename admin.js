const adminEndpoint = "/api/admin";
const tokenKey = "site-viagens-admin-token";
const apiBase = location.hostname && location.hostname !== "siteviagensv2.vercel.app" ? "https://siteviagensv2.vercel.app" : "";
let adminToken = sessionStorage.getItem(tokenKey) || "";
let dashboardData = null;

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
    body: method === "GET" ? undefined : JSON.stringify({ action, ...body }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Erro no admin.");
  return payload;
}

function showDashboard() {
  $("#adminLogin").hidden = true;
  $("#dashboard").hidden = false;
}

function showLogin() {
  $("#adminLogin").hidden = false;
  $("#dashboard").hidden = true;
}

async function login(password) {
  const payload = await api("login", { password });
  adminToken = payload.token;
  sessionStorage.setItem(tokenKey, adminToken);
  showDashboard();
  await loadDashboard();
}

async function loadDashboard() {
  dashboardData = await api("dashboard", {}, "GET");
  renderAll();
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
          `<div class="visitor"><strong>${esc(v.device || "Visitante")}</strong><span>${fmt(v.lastSeenAt)} - ${esc(
            v.lastPage || "-"
          )}</span></div>`
      )
      .join("") || `<div class="visitor"><span>Nenhum visitante ainda.</span></div>`;
  $("#visitorsTable").innerHTML =
    rows
      .map(
        (v) =>
          `<tr><td>${fmt(v.lastSeenAt)}</td><td>${esc(v.lastPage)}</td><td>${esc(v.device)}</td><td>${esc(
            v.browser
          )}</td><td>${esc(v.os)}</td><td>${esc(v.screen)}</td><td>${esc(v.language)}</td><td>${esc(
            v.ip
          )}</td><td>${esc([v.geo?.city, v.geo?.country].filter(Boolean).join("/"))}</td><td>${
            v.online ? "online" : "offline"
          }</td></tr>`
      )
      .join("") || `<tr><td colspan="10">Nenhum visitante registrado.</td></tr>`;
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
  $("#photosGrid").innerHTML = (dashboardData.photos || [])
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
    .join("");
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
  await api("photo", { photoId: id, photoAction: action });
  await loadDashboard();
}

function logout() {
  adminToken = "";
  sessionStorage.removeItem(tokenKey);
  showLogin();
}

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#loginMessage").textContent = "";
  try {
    await login($("#adminPassword").value);
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

if (adminToken) {
  showDashboard();
  loadDashboard().catch(logout);
} else {
  showLogin();
}
