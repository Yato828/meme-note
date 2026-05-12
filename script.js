const form = document.querySelector("#tokenForm");
const book = document.querySelector("#inscriptionBook");
const writtenName = document.querySelector("#writtenName");
const writtenCa = document.querySelector("#writtenCa");
const logList = document.querySelector("#logList");
const logTemplate = document.querySelector("#logTemplate");
const clearButton = document.querySelector("#clearButton");

const storageKey = "meme-note.destroyed";

let destroyedTokens = readDestroyedTokens();

function readDestroyedTokens() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveDestroyedTokens() {
  localStorage.setItem(storageKey, JSON.stringify(destroyedTokens));
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function roughenText(element, text) {
  element.textContent = "";

  for (const character of text) {
    const glyph = document.createElement("span");
    glyph.className = "glyph";
    glyph.textContent = character === " " ? "\u00a0" : character;
    glyph.style.setProperty("--turn", `${randomBetween(-7, 7)}deg`);
    glyph.style.setProperty("--lift", `${randomBetween(-5, 4)}px`);
    glyph.style.setProperty("--wide", randomBetween(0.9, 1.12).toFixed(2));
    element.append(glyph);
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function normalizeAxiomLink(value) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^0x[a-f0-9]{20,}$/i.test(value)) {
    return `https://axiom.trade/t/${value}`;
  }

  if (/^axiom\.trade/i.test(value)) {
    return `https://${value}`;
  }

  return `https://axiom.trade/t/${encodeURIComponent(value)}`;
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function renderLog() {
  logList.innerHTML = "";

  if (!destroyedTokens.length) {
    const empty = document.createElement("div");
    empty.className = "empty-log";
    empty.textContent = "No tokens have been destroyed yet.";
    logList.append(empty);
    return;
  }

  destroyedTokens.forEach((token) => {
    const node = logTemplate.content.firstElementChild.cloneNode(true);
    const title = node.querySelector("h3");
    const link = node.querySelector("a");
    const date = node.querySelector("span");

    title.textContent = token.name;
    link.href = normalizeAxiomLink(token.ca);
    link.textContent = token.ca;
    date.textContent = formatDate(token.createdAt);
    logList.append(node);
  });
}

function markToken(token) {
  book.classList.remove("is-destroyed");
  roughenText(writtenName, token.name);
  writtenCa.textContent = token.ca;
  book.offsetWidth;
  book.classList.add("is-destroyed");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("tokenName") || "").trim();
  const ca = String(data.get("tokenCa") || "").trim();

  if (!name || !ca) {
    form.classList.remove("is-shaking");
    form.offsetWidth;
    form.classList.add("is-shaking");
    return;
  }

  const token = {
    id: createId(),
    name,
    ca,
    createdAt: Date.now(),
  };

  destroyedTokens.unshift(token);
  saveDestroyedTokens();
  markToken(token);
  renderLog();
  form.reset();
});

clearButton.addEventListener("click", () => {
  destroyedTokens = [];
  saveDestroyedTokens();
  renderLog();
});

renderLog();
