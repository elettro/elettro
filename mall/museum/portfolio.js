let PROJECTS = [
  { id: "seascape", title: "Seascape Resort & Marina", cats: ["Web"], year: "2024", url: "https://elettro.github.io/seascaperesortmarina", blurb: "Hospitality identity and website for a Florida resort and marina destination.", role: "Design + Build", stack: ["HTML/CSS", "JavaScript", "Brand"] },
  { id: "weightloss", title: "Weight Loss Davie", cats: ["Web"], year: "2024", url: "https://weightlossdavie.com", blurb: "Healthcare website built around clear services, local search, and a focused intake path.", role: "Design + Build", stack: ["HTML/CSS", "Forms", "SEO", "AIO"] },
  { id: "stashbox-band", title: "Stashbox", cats: ["Web", "Music"], year: "2024", url: "https://stashbox.com", blurb: "Band website with releases, video, merchandise, press material, and custom radio.", role: "Design + Build", stack: ["HTML/CSS", "JavaScript", "Audio"] },
  { id: "wpb", title: "City of West Palm Beach and VisitWPB", cats: ["Web", "Branding"], year: "2024", url: "https://visitwpb.org", blurb: "Municipal tourism website supporting destination, dining, event, and stay discovery.", role: "Design Support", stack: ["CMS", "UX", "Brand"] },
  { id: "stashbox-ai", title: "Stashbox.ai", cats: ["Web", "App"], year: "2024", url: "https://stashbox.ai", blurb: "Print-on-demand ecommerce storefront, merchandising system, and brand production.", role: "Product Design", stack: ["Storefront", "API", "UX"] },
  { id: "aio", title: "AIO Authority", cats: ["Web"], year: "2024", url: "https://aioauthority.com", blurb: "AI search optimization website covering schema, entity work, technical SEO, and automation.", role: "Design + Build", stack: ["Marketing", "SEO", "AIO"] },
  { id: "mbe", title: "MBE Initiative", cats: ["Web"], year: "2024", url: "https://mbeinitiative.com", blurb: "Minority Business Enterprise advocacy and resource platform.", role: "Design + Build", stack: ["HTML/CSS", "Content"] },
  { id: "manhattan", title: "Manhattan Services", cats: ["Web"], year: "2024", url: "https://elettro.github.io/manhattanservices", blurb: "Premium services landing experience with an appointment-led conversion flow.", role: "Design + Build", stack: ["HTML/CSS", "Forms"] },
  { id: "longpole", title: "LongPole4Life", cats: ["Web", "Other"], year: "2024", url: "https://longpole4life.com", blurb: "Nonprofit awareness and donation platform with a storytelling-led layout.", role: "Design + Build", stack: ["Donations", "CMS"] },
  { id: "nadja", title: "Nadja Atwal", cats: ["Web", "Branding"], year: "2024", url: "https://nadjaatwal.net", blurb: "Editorial personal-brand website supporting media, PR, podcast, and search visibility.", role: "Design + Build", stack: ["Editorial", "Brand", "AIO"] },
  { id: "rasbox", title: "The Ras Box", cats: ["Web", "Music"], year: "2024", url: "https://therasbox.com", blurb: "Music artist website with releases, listening paths, video, and promotional content.", role: "Design + Build", stack: ["Music", "Audio", "Web"] },
  { id: "piano", title: "Piano Music Soothing", cats: ["Web", "Music"], year: "2024", url: "https://pianomusicsoothing.com", blurb: "Calm-music brand with curated, mood-led listening paths.", role: "Design + Build", stack: ["Audio", "Brand"] },
  { id: "akme", title: "Akme Glass Company", cats: ["Web"], year: "2024", url: "https://elettro.github.io/akmeglasscompany", blurb: "Industrial trade website for a regional glassware specialist.", role: "Design + Build", stack: ["HTML/CSS", "Catalog"] },
  { id: "bluecard", title: "The Blue Card", cats: ["Web", "Other"], year: "2024", url: "https://bluecardfund.org", blurb: "Nonprofit website supporting Holocaust survivors through programs, archives, and donation paths.", role: "Design Support", stack: ["Nonprofit", "CMS"] },
  { id: "stashbox-radio", title: "Stashbox Radio", cats: ["Web", "Music", "App"], year: "2024", url: "https://stashbox.com/radio/", blurb: "Custom streaming product with song, advertising, visual, listener, and analytics systems.", role: "Product + Audio", stack: ["Audio", "JavaScript", "UX"] },
  { id: "ittytwit", title: "Ittytwit", cats: ["Web", "App"], year: "2024", url: "https://elettro.github.io/ittytwit", blurb: "Custom content-managed voting experience with a dynamic interface.", role: "Engineering + UX", stack: ["CMS", "Voting", "JavaScript"] },
  { id: "cassie", title: "Cassie Magrath", cats: ["Web", "Branding"], year: "2024", url: "https://cassiemagrath.com", blurb: "Actor press website with reel, credits, photography, and contact information.", role: "Design + Build", stack: ["Editorial", "Media"] },
  { id: "maninme", title: "The Man in Me", cats: ["App", "Music"], year: "2024", url: "https://elettro.github.io/stashbox/themaninme", blurb: "Audio-reactive browser visualizer developed as an immersive listening experience.", role: "Engineering + Motion", stack: ["Canvas", "Audio", "WebGL"] },
  { id: "nebula", title: "Nebula", cats: ["App", "Music"], year: "2024", url: "https://elettro.github.io/dev/nebula/", blurb: "Generative audio visualizer using particles, browser graphics, and sound response.", role: "Engineering + Motion", stack: ["WebGL", "Audio", "Shaders"] },
  { id: "jon-phillips", title: "Jon Phillips Testimonial", cats: ["Video"], year: "2024", url: "https://www.youtube.com/watch?v=L_wCyky9fuM", blurb: "Client testimonial video with editing, story structure, sound, color, and supporting footage.", role: "Direction + Edit", stack: ["Edit", "Color", "Sound"] },
  { id: "ssg-led", title: "Slightly Stoopid Giant LED Visuals", cats: ["Video"], year: "2024", url: "https://youtu.be/twa-yI5loAQ", blurb: "Large-format concert visuals produced for a live festival performance environment.", role: "Visuals + Edit", stack: ["Motion", "LED", "Edit"] },
  { id: "pink-palm", title: "Pink Palm Puff", cats: ["Video"], year: "2024", url: "https://youtu.be/ATbfh4fptQI", blurb: "Ecommerce promotional video built from product photography and branded motion.", role: "Motion + Edit", stack: ["Motion", "Edit", "Promo"] },
  { id: "duck-racing", title: "Duck Racing", cats: ["Video"], year: "2024", url: "https://youtu.be/aQc1acrf8_Y", blurb: "Ecommerce promotional video with product story, motion, and editing.", role: "Direction + Edit", stack: ["Promo", "Edit"] },
  { id: "sand", title: "Florida Sand Sculpturist", cats: ["Video", "Other"], year: "2024", url: "https://youtu.be/Qub62f2kJCc", blurb: "Artist promotional video produced on the Florida coastline.", role: "Direction + Edit", stack: ["Documentary", "Edit"] }
];

const SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaAEHrD3n5O42KWP3OcM2OwYmV_24CIWSjl41Pz__mQqY0opH14_VDb-F47M63Wn7bhlevfLldj7v5/pub?gid=837156076&single=true&output=csv";
const FILTERS = ["ALL", "Web", "Video", "Music", "App", "Branding", "Other"];
const CAT_HUE = { Web: 196, Video: 25, Music: 305, App: 145, Branding: 55, Other: 90 };
const state = { filter: "ALL", query: "", open: null };
const root = document.getElementById("root");

const escapeHtml = (value = "") => String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
const pad = (value) => String(value).padStart(2, "0");
const initials = (title) => title.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", i = 0, inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQ = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.some((v) => v.length)).map((r) => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] ?? "").trim(); });
    return obj;
  });
}

function normalizeSheetRow(raw) {
  const out = {};
  Object.entries(raw || {}).forEach(([key, value]) => {
    out[String(key || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "")] = value;
  });
  return {
    id: out.id || out.slug || "",
    title: out.title || out.project || out.name || "",
    categories: out.categories || out.category || out.tags || "",
    year: out.year || out.date || "",
    url: out.url || out.link || out.website || "",
    reportUrl: out.reporturl || out.report || "",
    blurb: out.blurb || out.description || out.summary || "",
    role: out.role || "",
    stack: out.stack || out.tools || "",
    Background: out.background || out.thumbnail || out.image || "",
    media: out.media || out.thumbnail || out.image || "",
    client: out.client || "",
    overview: out.overview || "",
    approach: out.approach || "",
    results: out.results || ""
  };
}

function rowToProject(row) {
  const splitList = (value) => value ? value.split(/\s*[;,]\s*/).filter(Boolean) : [];
  const cats = splitList(row.categories);
  return {
    id: row.id || (row.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title: row.title,
    cats,
    year: row.year || "—",
    url: row.url,
    reportUrl: row.reportUrl || "",
    blurb: row.blurb,
    role: row.role || "—",
    stack: splitList(row.stack),
    Background: row.Background || "",
    media: (row.media || "").trim(),
    client: (row.client || "").trim(),
    overview: (row.overview || "").trim(),
    approach: (row.approach || "").trim(),
    results: (row.results || "").trim()
  };
}

function normalizeImageUrl(url) {
  if (!url) return "";
  const clean = String(url).trim();
  if (clean.includes("dropbox.com")) {
    return clean
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("?dl=0", "")
      .replace("?dl=1", "")
      .replace("&dl=0", "")
      .replace("&dl=1", "");
  }
  return clean;
}

function resolveMedia(url) {
  if (!url) return { kind: "none" };
  const value = String(url).trim();
  const ytMatch =
    value.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/i) ||
    value.match(/youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)([A-Za-z0-9_-]{6,})/i);
  if (ytMatch) {
    const id = ytMatch[1];
    return { kind: "youtube", src: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, ytId: id };
  }
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
    return { kind: "youtube", src: `https://img.youtube.com/vi/${value}/hqdefault.jpg`, ytId: value };
  }
  if (/^https?:\/\//i.test(value)) return { kind: "img", src: value };
  return { kind: "none" };
}

const filteredProjects = () => PROJECTS.filter((project) => {
  const inCategory = state.filter === "ALL" || project.cats.includes(state.filter);
  const searchText = `${project.title} ${project.blurb} ${project.cats.join(" ")}`.toLowerCase();
  return inCategory && (!state.query || searchText.includes(state.query.toLowerCase()));
});

function fallbackThumb(project) {
  const hue = CAT_HUE[project.cats[0]] || 60;
  const angle = (project.id.charCodeAt(0) + project.id.length) * 47 % 180;
  return `<div class="thumb thumb-grad portfolio-card__media portfolio-card__media--fallback" style="--hue:${hue};--angle:${angle}deg">
    <div class="thumb-grad-fill" aria-hidden="true"></div><div class="thumb-grad-orb" aria-hidden="true"></div>
    <div class="thumb-letters">${escapeHtml(initials(project.title))}</div><div class="thumb-meta"></div><span class="thumb-year">${escapeHtml(project.year)}</span>
  </div>`;
}

function thumb(project) {
  const hue = CAT_HUE[project.cats[0]] || 60;
  const background = normalizeImageUrl(project.Background || project.background || project.thumbnail || project.image || "");
  const mediaRaw = background || project.media || (/youtu\.?be/i.test(project.url || "") ? project.url : "");
  const media = resolveMedia(mediaRaw);
  if (media.kind === "none") return fallbackThumb(project);

  const play = media.kind === "youtube"
    ? `<span class="thumb-play" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg></span>`
    : "";
  return `<div class="thumb thumb-media portfolio-card__media" style="--hue:${hue}">
    <img class="thumb-media-img" src="${escapeHtml(media.src)}" alt="${escapeHtml(project.title || "Portfolio project thumbnail")}" loading="lazy" onerror="this.style.display='none'">
    <div class="thumb-media-veil" aria-hidden="true"></div>${play}<span class="thumb-year">${escapeHtml(project.year)}</span>
  </div>`;
}

function card(project, index) {
  return `<article class="card portfolio-card" data-cats="${escapeHtml(project.cats.join(" "))}">
    <button class="card-thumb" data-open="${escapeHtml(project.id)}" aria-label="Open case study for ${escapeHtml(project.title)}">${thumb(project)}<span class="card-thumb-hint">Case study →</span></button>
    <div class="card-body"><div class="card-head"><span class="card-no">${pad(index + 1)}</span><div class="card-cats">${project.cats.map((cat) => `<span class="cat" style="--hue:${CAT_HUE[cat] || 60}">${escapeHtml(cat)}</span>`).join("")}</div></div>
      <h3 class="card-title">${escapeHtml(project.title)}</h3><p class="card-blurb">${escapeHtml(project.blurb)}</p>
      <div class="card-foot"><a class="btn btn-primary" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">Visit live <span aria-hidden="true">↗</span></a><button class="btn btn-ghost" data-open="${escapeHtml(project.id)}">Case study</button></div>
    </div></article>`;
}

function renderApp() {
  const projects = filteredProjects();
  const counts = Object.fromEntries(FILTERS.map((filter) => [filter, filter === "ALL" ? PROJECTS.length : PROJECTS.filter((project) => project.cats.includes(filter)).length]));
  root.innerHTML = `<div class="app">
    <header class="hero"><div class="hero-stage"><h1 class="hero-h">A field of <em>built</em> things:<br>sites, sounds, signals.</h1><p class="hero-sub">Twenty-four selected projects across web, video, music, branding, and custom applications. Filter the grid or open a case study for context and a live link.</p></div></header>
    <section class="control-row" aria-label="Portfolio controls"><div class="rail" role="tablist" aria-label="Filter portfolio">${FILTERS.map((filter) => `<button role="tab" aria-selected="${state.filter === filter}" class="chip ${state.filter === filter ? "chip-active" : ""}" data-filter="${filter}" ${filter === "ALL" ? "" : `style="--hue:${CAT_HUE[filter] || 60}"`}><span class="chip-label">${filter}</span><span class="chip-count">${counts[filter]}</span></button>`).join("")}</div>
      <label class="search"><span aria-hidden="true">⌕</span><span class="sr-only">Search projects</span><input id="portfolio-search" type="search" placeholder="Search projects…" value="${escapeHtml(state.query)}"></label>
      <div class="count-line" aria-live="polite"><span class="count-num">${pad(projects.length)}</span><span class="count-lbl">of ${pad(PROJECTS.length)} shown</span></div>
    </section>
    <main class="grid" data-density="editorial">${projects.length ? projects.map(card).join("") : `<div class="empty"><span>No projects match.</span><button class="btn btn-ghost" data-reset>Reset filters</button></div>`}</main>
    <footer class="foot"><div class="foot-l"><span class="brand-mark sm">e·</span><span>Elettro Studio · selected works, ${new Date().getFullYear()}</span></div><div class="foot-r"><span>${projects.length} of ${PROJECTS.length} visible</span><span class="dot">·</span><span>Press <kbd>Esc</kbd> to close a case study</span></div></footer>
  </div>`;
}

function panel(project) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "cp-title");
  const overview = project.overview || project.blurb;
  overlay.innerHTML = `<aside class="panel"><header class="panel-hd"><div class="panel-hd-left"><span class="panel-eyebrow">Case study · ${escapeHtml((project.cats[0] || "project").toLowerCase())}</span><h2 id="cp-title" class="panel-title">${escapeHtml(project.title)}</h2></div><button class="panel-close" data-close aria-label="Close case study">×</button></header>
    <div class="panel-hero">${thumb(project)}</div><div class="panel-body"><div class="panel-meta"><div><span class="k">Year</span><span class="v">${escapeHtml(project.year)}</span></div><div><span class="k">Role</span><span class="v">${escapeHtml(project.role)}</span></div><div><span class="k">Category</span><span class="v">${escapeHtml(project.cats.join(" · "))}</span></div></div>
    <section class="panel-sect"><h4>Overview</h4><p>${escapeHtml(overview)}</p></section><section class="panel-sect"><h4>Stack and deliverables</h4><ul class="chips-list">${project.stack.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <div class="panel-actions"><a class="btn btn-primary btn-lg" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">Open live project ↗</a><button class="btn btn-ghost btn-lg" data-share>Copy project link</button></div></div></aside>`;
  overlay.addEventListener("click", (event) => { if (event.target === overlay || event.target.closest("[data-close]")) closePanel(); });
  overlay.querySelector("[data-share]").addEventListener("click", async (event) => {
    const url = `${location.origin}${location.pathname}#project-${encodeURIComponent(project.id)}`;
    try { await navigator.clipboard.writeText(url); event.currentTarget.textContent = "Project link copied"; }
    catch { event.currentTarget.textContent = "Copy failed"; }
  });
  document.body.append(overlay);
  document.body.style.overflow = "hidden";
  overlay.querySelector("[data-close]").focus();
}

function openPanel(id, updateHash = true) {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) return;
  document.querySelector(".overlay")?.remove();
  state.open = id;
  panel(project);
  if (updateHash) history.replaceState(null, "", `#project-${project.id}`);
}

function closePanel() {
  document.querySelector(".overlay")?.remove();
  document.body.style.overflow = "";
  state.open = null;
  history.replaceState(null, "", `${location.pathname}${location.search}`);
}

root.addEventListener("click", (event) => {
  const filter = event.target.closest("[data-filter]")?.dataset.filter;
  const project = event.target.closest("[data-open]")?.dataset.open;
  if (filter) { state.filter = filter; renderApp(); document.getElementById("portfolio-search")?.focus(); }
  if (project) openPanel(project);
  if (event.target.closest("[data-reset]")) { state.filter = "ALL"; state.query = ""; renderApp(); }
});

root.addEventListener("input", (event) => {
  if (event.target.id !== "portfolio-search") return;
  const cursor = event.target.selectionStart;
  state.query = event.target.value;
  renderApp();
  const input = document.getElementById("portfolio-search");
  input.focus();
  input.setSelectionRange(cursor, cursor);
});

document.addEventListener("keydown", (event) => { if (event.key === "Escape" && state.open) closePanel(); });
window.addEventListener("hashchange", () => {
  const match = location.hash.match(/^#project-(.+)$/);
  if (match) openPanel(decodeURIComponent(match[1]), false);
});

async function loadSheetProjects() {
  try {
    const response = await fetch(SHEET_CSV, { mode: "cors" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = parseCSV(await response.text())
      .map(normalizeSheetRow)
      .map(rowToProject)
      .filter((project) => project.title);
    if (!rows.length) return;
    PROJECTS = rows;
    renderApp();
    const match = location.hash.match(/^#project-(.+)$/);
    if (match) openPanel(decodeURIComponent(match[1]), false);
  } catch (error) {
    console.warn("Portfolio sheet unavailable. Using embedded fallback data.", error);
  }
}

renderApp();
const initialProject = location.hash.match(/^#project-(.+)$/);
if (initialProject) openPanel(decodeURIComponent(initialProject[1]), false);
loadSheetProjects();
