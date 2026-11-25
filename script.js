/* =========================================================
   FOREO RP — ТРИ СТРОКИ, КОТОРЫЕ НУЖНО ИЗМЕНИТЬ:
   1) SERVER_IP       — IP сервера
   2) DONATE_URL      — ссылка на сайт доната
   3) LAUNCHER_EXE_URL — прямая ссылка на .exe из GitHub Releases
   Discord-ссылка уже указана ниже и менять её не нужно.
   ========================================================= */

const SERVER_IP = "mc.foreorp.ru";
const DONATE_URL = "https://www.donationalerts.com/r/pa1sey";
const LAUNCHER_EXE_URL = "https://github.com/palsey/foreorp-launcher/releases/download/v1.0.0/ForeoRP-Launcher-1.0.0-x64.exe";

const DISCORD_URL = "https://discord.gg/xC5wDgZSpj";

/* ---------------- Конфигурация страницы ---------------- */

const CONFIG = {
  ip: SERVER_IP,
  donate: DONATE_URL,
  launcher: LAUNCHER_EXE_URL,
  discord: DISCORD_URL
};

function applyConfig() {
  document.querySelectorAll("[data-config-text]").forEach((el) => {
    const key = el.dataset.configText;
    if (CONFIG[key]) el.textContent = CONFIG[key];
  });

  document.querySelectorAll("[data-config-href]").forEach((el) => {
    const key = el.dataset.configHref;
    const value = CONFIG[key];
    if (!value) return;

    el.setAttribute("href", value);

    // Если вместо внешней ссылки указан якорь (например, #download),
    // не открываем его в новой вкладке.
    if (value.startsWith("#")) {
      el.removeAttribute("target");
      el.removeAttribute("rel");
    }
  });
}

/* ---------------- Статус сервера ---------------- */

const statusBadge = document.getElementById("statusBadge");
const statusText = document.getElementById("statusText");
const statusHint = document.getElementById("statusHint");
const playerCount = document.getElementById("playerCount");

function setStatus(state, text, hint, players) {
  if (statusBadge) statusBadge.className = `status-badge is-${state}`;
  if (statusText) statusText.textContent = text;
  if (statusHint) statusHint.textContent = hint;
  if (playerCount && players !== undefined) playerCount.textContent = players;
}

function normalizeHost(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^tcp:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/\/$/, "");
}

async function fetchWithTimeout(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

async function updateServerStatus() {
  const host = normalizeHost(SERVER_IP);

  if (!host) {
    setStatus(
      "offline",
      "IP не указан",
      "Заполните SERVER_IP в начале script.js, чтобы включить живой статус.",
      "—"
    );
    return;
  }

  setStatus("loading", "Проверяем...", "Запрашиваем актуальный статус сервера...", "—");

  try {
    const response = await fetchWithTimeout(
      `https://api.mcsrvstat.us/3/${encodeURIComponent(host)}`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data && data.online === true) {
      const online = Number(data.players?.online || 0);
      const max = Number(data.players?.max || 0);
      const players = max > 0 ? `${online} / ${max}` : String(online);

      setStatus(
        "online",
        "Онлайн",
        "Сервер доступен. Присоединяйся — твоя история начинается здесь.",
        players
      );
    } else {
      setStatus(
        "offline",
        "Тех. работы",
        "Сервер сейчас недоступен. Это нормально для техработ — попробуйте зайти позже или следите за новостями в Discord.",
        "—"
      );
    }
  } catch (error) {
    setStatus(
      "offline",
      "Статус недоступен",
      "Не удалось получить ответ от сервиса статуса. Проверьте соединение и попробуйте позже; Discord остаётся актуальным источником новостей.",
      "—"
    );
  }
}

/* ---------------- Копирование IP ---------------- */

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
let toastTimer;

function showToast(message, isError = false) {
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.classList.add("is-visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  // Fallback для локального открытия файла и старых браузеров.
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

async function handleCopyIp() {
  const ip = normalizeHost(SERVER_IP);

  if (!ip) {
    showToast("Сначала укажите IP в script.js", true);
    return;
  }

  try {
    const copied = await copyToClipboard(ip);
    showToast(copied ? "IP скопирован!" : "Не удалось скопировать", !copied);
  } catch (error) {
    showToast("Не удалось скопировать", true);
  }
}

["copyIp", "copyIpIcon"].forEach((id) => {
  const button = document.getElementById(id);
  if (button) button.addEventListener("click", handleCopyIp);
});

/* ---------------- Мобильное меню и навигация ---------------- */

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("mainNav");

function closeNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Открыть меню");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

document.querySelectorAll(".nav a[href^='#']").forEach((link) => {
  link.addEventListener("click", closeNav);
});

const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#']"));
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------- Запуск ---------------- */

applyConfig();
updateServerStatus();
setInterval(updateServerStatus, 60000);
