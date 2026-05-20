/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle */
const { useState, useEffect, useMemo, useRef } = React;

// ─────────────────────────── GOOGLE SHEET SOURCE ───────────────────────────
// "Elettro — Portfolio Data" — drives the grid below.
// Sheet must be shared "Anyone with the link: Viewer" (or File ▸ Share ▸
// Publish to web). Columns: id,title,categories,year,url,reportUrl,blurb,role,stack
const SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaAEHrD3n5O42KWP3OcM2OwYmV_24CIWSjl41Pz__mQqY0opH14_VDb-F47M63Wn7bhlevfLldj7v5/pub?gid=837156076&single=true&output=csv";

// Tiny RFC-4180 CSV parser (handles quoted fields, embedded quotes, newlines)
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", i = 0, inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i+1] === '"') { field += '"'; i += 2; continue; }
        inQ = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { row.push(field); field = ""; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).filter(r => r.some(v => v.length)).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] ?? "").trim(); });
    return obj;
  });
}

function normalizeSheetRow(raw) {
  const out = {};
  Object.entries(raw || {}).forEach(([k, v]) => {
    const key = String(k || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
    out[key] = v;
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
    results: out.results || "",
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

function rowToProject(r) {
  const splitList = (v) => v ? v.split(/\s*[;,]\s*/).filter(Boolean) : [];
  const cats = splitList(r.categories);
  // Derive a coarse "kind" label (video/app/website/product) from cats for the case-study eyebrow.
  let kind = "website";
  if (cats.includes("Video")) kind = "video";
  else if (cats.includes("App")) kind = "app";
  else if (cats.includes("Music") && !cats.includes("Web")) kind = "music";
  else if (cats.length > 1) kind = "product";
  return {
    id: r.id || (r.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title: r.title,
    cats,
    kind,
    year: r.year || "—",
    url: r.url,
    reportUrl: r.reportUrl || "",
    blurb: r.blurb,
    role: r.role || "—",
    stack: splitList(r.stack),
    Background: r.Background || r.background || r.thumbnail || r.image || "",
    media: (r.media || "").trim(),
    client:   (r.client   || "").trim(),
    overview: (r.overview || "").trim(),
    approach: (r.approach || "").trim(),
    results:  (r.results  || "").trim(),
  };
}

// Detect & convert media URL → background image. Returns:
//   { kind: 'img' | 'youtube' | 'none', src: string, ytId?: string }
function resolveMedia(url) {
  if (!url) return { kind: "none" };
  const u = url.trim();
  // YouTube — youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch =
    u.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/i) ||
    u.match(/youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)([A-Za-z0-9_-]{6,})/i);
  if (ytMatch) {
    const id = ytMatch[1];
    // hqdefault is the most reliably-present poster size (480×360, 16:9-ish)
    return { kind: "youtube", src: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, ytId: id };
  }
  // Bare YouTube ID (11 chars) as a convenience
  if (/^[A-Za-z0-9_-]{11}$/.test(u)) {
    return { kind: "youtube", src: `https://img.youtube.com/vi/${u}/hqdefault.jpg`, ytId: u };
  }
  // Anything else with an image extension or a generic http(s) URL we treat as an image
  if (/^https?:\/\//i.test(u)) return { kind: "img", src: u };
  return { kind: "none" };
}

// ─────────────────────────── DATA (fallback, used if sheet fetch fails) ───
const PROJECTS = [
  { id:"seascape",       title:"Seascape Resort & Marina",         kind:"website",  cats:["Web"],             year:"2024", url:"https://elettro.github.io/seascaperesortmarina", blurb:"Hospitality identity & site for a Florida resort and marina destination.", role:"Design + Build", stack:["HTML/CSS","JS","Brand"]},
  { id:"weightloss",     title:"Weight Loss Davie",                 kind:"website",  cats:["Web"],             year:"2024", url:"https://WeightLossDavie.com",                       blurb:"Clinical wellness landing built around a conversion-focused intake funnel.", role:"Design + Build", stack:["HTML/CSS","Forms","SEO"]},
  { id:"stashbox-band",  title:"Stashbox (Band)",                   kind:"website",  cats:["Web","Music"],     year:"2024", url:"https://elettro.github.io/stashbox/",               blurb:"Band site with releases, shows, press kit, and integrated radio.", role:"Design + Build", stack:["HTML/CSS","JS","Audio"]},
  { id:"wpb",            title:"City of West Palm Beach",           kind:"website",  cats:["Web","Branding"],  year:"2024", url:"https://VisitWPB.org",                              blurb:"Municipal tourism portal — VisitWPB — covering events, dining and stays.", role:"Design support", stack:["CMS","UX","Brand"]},
  { id:"stashbox-ai",    title:"Stashbox.ai",                       kind:"product",  cats:["Web","App"],       year:"2024", url:"https://Stashbox.ai",                               blurb:"Online print-on-demand storefront — drag, configure, ship.", role:"Product design", stack:["Storefront","API","UX"]},
  { id:"aio",            title:"Aio Authority",                     kind:"website",  cats:["Web"],             year:"2024", url:"https://aioauthority.com/",                         blurb:"Authority site for AI-driven SEO services and topical authority builds.", role:"Design + Build", stack:["Marketing","SEO"]},
  { id:"mbe",            title:"MBE Initiative",                    kind:"website",  cats:["Web"],             year:"2024", url:"https://elettro.github.io/mbeinitiative",           blurb:"Minority Business Enterprise advocacy and resource platform.", role:"Design + Build", stack:["HTML/CSS","Content"]},
  { id:"manhattan",      title:"Manhattan Services",                kind:"website",  cats:["Web"],             year:"2024", url:"https://elettro.github.io/manhattanservices",       blurb:"Premium services landing with appointment-led conversion flow.", role:"Design + Build", stack:["HTML/CSS","Forms"]},
  { id:"longpole",       title:"LongPole4Life",                     kind:"website",  cats:["Web","Other"],     year:"2024", url:"https://LongPole4Life.com",                         blurb:"Non-profit awareness and donation platform with storytelling-led layout.", role:"Design + Build", stack:["Donations","CMS"]},
  { id:"nadja",          title:"Nadja Atwal",                       kind:"website",  cats:["Web","Branding"],  year:"2024", url:"https://NadjaAtwal.net",                            blurb:"Editorial site for top podcaster and PR specialist.", role:"Design + Build", stack:["Editorial","Brand"]},
  { id:"rasbox",         title:"The Ras Box",                       kind:"website",  cats:["Web","Music"],     year:"2024", url:"https://TheRasBox.com",                             blurb:"Music artist site with releases, dates, and stream-first listening rooms.", role:"Design + Build", stack:["Music","Audio"]},
  { id:"piano",          title:"Piano Music Soothing",              kind:"website",  cats:["Web","Music"],     year:"2024", url:"https://PianoMusicSoothing.com",                    blurb:"Calm-music brand with curated, mood-led listening playlists.", role:"Design + Build", stack:["Audio","Brand"]},
  { id:"akme",           title:"Akme Glass Company",                kind:"website",  cats:["Web"],             year:"2024", url:"https://elettro.github.io/akmeglasscompany",        blurb:"Industrial trade site for a regional glassware specialist.", role:"Design + Build", stack:["HTML/CSS","Catalog"]},
  { id:"bluecard",       title:"The Blue Card",                     kind:"website",  cats:["Web","Other"],     year:"2024", url:"https://bluecardfund.org",                          blurb:"Foundation site supporting Holocaust survivors — donation + program flows.", role:"Design support", stack:["Non-profit","CMS"]},
  { id:"stashbox-radio", title:"Stashbox Radio",                    kind:"product",  cats:["Web","Music","App"], year:"2024", url:"https://elettro.github.io/stashbox/radio",      blurb:"Always-on streaming radio with live show schedule.", role:"Product + Audio", stack:["Audio","JS","UX"]},
  { id:"ittytwit",       title:"Ittytwit",                          kind:"product",  cats:["Web","App"],       year:"2024", url:"https://elettro.github.io/ittytwit",                blurb:"Custom CMS-controlled dynamic voting website.", role:"Engineering + UX", stack:["CMS","Voting","JS"]},
  { id:"cassie",         title:"Cassie Magrath",                    kind:"website",  cats:["Web","Branding"],  year:"2024", url:"https://cassiemagrath.com",                         blurb:"Actress press site — reel, credits, headshots, contact.", role:"Design + Build", stack:["Editorial","Media"]},

  { id:"maninme",        title:"The Man in Me",                     kind:"app",      cats:["App","Music"],     year:"2024", url:"https://elettro.github.io/stashbox/themaninme",     blurb:"Audio-reactive visualizer for an immersive listening experience.", role:"Engineering + Motion", stack:["Canvas","Audio","WebGL"]},
  { id:"nebula",         title:"Nebula",                            kind:"app",      cats:["App","Music"],     year:"2024", url:"https://elettro.github.io/dev/nebula/",             blurb:"Generative audio visualizer with particle systems.", role:"Engineering + Motion", stack:["WebGL","Audio","Shaders"]},

  { id:"jon-phillips",   title:"Jon Phillips — Testimonial",        kind:"video",    cats:["Video"],           year:"2024", url:"https://www.youtube.com/watch?v=L_wCyky9fuM",       blurb:"Client testimonial — cinematic edit with B-roll and grade.", role:"Direction + Edit", stack:["Edit","Grade","Sound"]},
  { id:"ssg-led",        title:"Slightly Stoopid — Giant LED",      kind:"video",    cats:["Video"],           year:"2024", url:"https://youtu.be/twa-yI5loAQ",                      blurb:"Stadium-scale LED visuals produced for live performance.", role:"Visuals + Edit", stack:["Motion","LED","Edit"]},
  { id:"pink-palm",      title:"Pink Palm Puff",                    kind:"video",    cats:["Video"],           year:"2024", url:"https://youtu.be/ATbfh4fptQI",                      blurb:"E-commerce promo synthesized from product photography.", role:"Motion + Edit", stack:["Motion","Edit","Promo"]},
  { id:"duck-racing",    title:"Duck Racing",                       kind:"video",    cats:["Video"],           year:"2024", url:"https://youtu.be/aQc1acrf8_Y",                      blurb:"Plastic-duck e-commerce promotional spot.", role:"Direction + Edit", stack:["Promo","Edit"]},
  { id:"sand",           title:"Florida's #1 Sand Sculpturist",     kind:"video",    cats:["Video"],           year:"2024", url:"https://youtu.be/Qub62f2kJCc",                      blurb:"Artist promo shot on Florida coastline.", role:"Direction + Edit", stack:["Doc","Edit"]},
];

const FILTERS = ["ALL","Web","Video","Music","Branding","App","Other"];

const CAT_HUE = { Web: 215, App: 295, Video: 22, Music: 88, Branding: 155, Other: 60 };

// ─────────────────────────── HELPERS ───────────────────────────────────────
const hostname = (u) => { try { return new URL(u).hostname.replace(/^www\./,""); } catch { return u; }};
const initials = (t) => t.split(/[^A-Za-z0-9]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
const pad2 = (n) => String(n).padStart(2,"0");
const getCaseStudyUrl = (projectId) => {
  const url = new URL(window.location.href);
  url.hash = "";
  const base = url.toString();
  return projectId ? `${base}#project-${projectId}` : base;
};

const copyTextToClipboard = async (text) => {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
};

// Build a deterministic-ish background per project using its categories.
function Thumb({ project, style: thumbStyle, accent }) {
  const cat = project.cats[0];
  const hue = CAT_HUE[cat] ?? 60;
  const seed = project.id.charCodeAt(0) + project.id.length;

  // If the row has a media URL (image or YouTube), use it as the thumbnail.
  // Convenience: fall back to project.url when it's already a YouTube link.
  const background = project.Background || project.background || project.thumbnail || project.image || "";
  const backgroundUrl = normalizeImageUrl(background);
  const mediaRaw = backgroundUrl || project.media || (/youtu\.?be/i.test(project.url || "") ? project.url : "");
  const media = resolveMedia(mediaRaw);
  if (media.kind !== "none") {
    return (
      <div className="thumb thumb-media portfolio-card__media" style={{ "--hue": hue }}>
        <img className="thumb-media-img" src={media.src} alt={project.title || "Portfolio project thumbnail"} loading="lazy"
          onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <div className="thumb-media-veil" aria-hidden="true"></div>
        {media.kind === "youtube" && (
          <div className="thumb-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
          </div>
        )}
        <div className="thumb-meta">
          <span>{project.year}</span>
        </div>
      </div>
    );
  }

  if (thumbStyle === "mono") {
    return (
      <div className="thumb thumb-mono portfolio-card__media portfolio-card__media--fallback">
        <div className="thumb-mono-grid" aria-hidden="true"></div>
        <div className="thumb-letters">{initials(project.title)}</div>
        <div className="thumb-meta">
          <span>{cat.toLowerCase()}</span>
          <span>{project.year}</span>
        </div>
      </div>
    );
  }

  if (thumbStyle === "stripes") {
    return (
      <div className="thumb thumb-stripes portfolio-card__media portfolio-card__media--fallback" style={{ "--hue": hue }}>
        <div className="thumb-stripes-fill" aria-hidden="true"></div>
        <div className="thumb-letters">{initials(project.title)}</div>
        <div className="thumb-meta">
          <span>{project.year}</span>
        </div>
      </div>
    );
  }

  // gradient (default) — uses category hue + accent flourish
  const angle = (seed * 47) % 180;
  return (
    <div className="thumb thumb-grad portfolio-card__media portfolio-card__media--fallback" style={{ "--hue": hue, "--angle": `${angle}deg` }}>
      <div className="thumb-grad-fill" aria-hidden="true"></div>
      <div className="thumb-grad-orb" aria-hidden="true"></div>
      <div className="thumb-letters">{initials(project.title)}</div>
      <div className="thumb-meta">
        <span>{project.year}</span>
      </div>
    </div>
  );
}

// ─────────────────────────── CARD ──────────────────────────────────────────
function Card({ project, index, onOpen, thumbStyle }) {
  return (
    <article className="card portfolio-card" data-cats={project.cats.join(" ")}>
      <button className="card-thumb" onClick={() => onOpen(project)} aria-label={`Open case study for ${project.title}`}>
        <Thumb project={project} thumbStyle={thumbStyle} />
        <span className="card-thumb-hint">Case study →</span>
      </button>

      <div className="card-body">
        <div className="card-head">
          <span className="card-no">{pad2(index + 1)}</span>
          <div className="card-cats">
            {project.cats.map(c => (
              <span key={c} className="cat" style={{ "--hue": CAT_HUE[c] ?? 60 }}>{c}</span>
            ))}
          </div>
        </div>

        <h3 className="card-title">{project.title}</h3>
        <p className="card-blurb">{project.blurb}</p>

        <div className="card-foot">
          <a className="btn btn-primary" href={project.url} target="_blank" rel="noopener noreferrer">
            Visit live
            <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
              <path d="M5.5 3h7.5v7.5M13 3 3.5 12.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            </svg>
          </a>
          <button className="btn btn-ghost" onClick={() => onOpen(project)}>
            Case study
          </button>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────── FILTER RAIL ──────────────────────────────────
function FilterRail({ active, onChange, counts }) {
  return (
    <div className="rail" role="tablist" aria-label="Filter portfolio">
      {FILTERS.map(f => {
        const isActive = f === active;
        return (
          <button
            key={f}
            role="tab"
            aria-selected={isActive}
            className={`chip ${isActive ? "chip-active" : ""}`}
            onClick={() => onChange(f)}
            style={f !== "ALL" ? { "--hue": CAT_HUE[f] ?? 60 } : {}}
          >
            <span className="chip-label">{f}</span>
            <span className="chip-count">{counts[f]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────── CASE STUDY PANEL ─────────────────────────────
function CasePanel({ project, onClose, thumbStyle }) {
  const closeRef = useRef(null);
  const shareResetTimerRef = useRef(null);
  const [shareState, setShareState] = useState("idle");
  useEffect(() => {
    if (!project) return;
    setShareState("idle");
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(shareResetTimerRef.current);
    };
  }, [project]);

  const onShareProject = async () => {
    const shareUrl = getCaseStudyUrl(project.id);
    try {
      await copyTextToClipboard(shareUrl);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
    window.clearTimeout(shareResetTimerRef.current);
    shareResetTimerRef.current = window.setTimeout(() => setShareState("idle"), 1800);
  };

  if (!project) return null;

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cp-title">
      <aside className="panel" onClick={(e) => e.stopPropagation()}>
        <header className="panel-hd">
          <div className="panel-hd-left">
            <span className="panel-eyebrow">Case study · {project.kind}</span>
            <h2 id="cp-title" className="panel-title">{project.title}</h2>
          </div>
          <button ref={closeRef} className="panel-close" onClick={onClose} aria-label="Close case study">
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M4 4l12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </header>

        <div className="panel-hero">
          <Thumb project={project} thumbStyle={thumbStyle} />
        </div>

        <div className="panel-body">
          <div className="panel-meta">
            <div><span className="k">Year</span><span className="v">{project.year}</span></div>
            <div><span className="k">Role</span><span className="v">{project.role}</span></div>
            {project.client && (
              <div><span className="k">Client</span><span className="v">{project.client}</span></div>
            )}
            <div><span className="k">Category</span><span className="v">{project.cats.join(" · ")}</span></div>
            <div><span className="k">Domain</span><span className="v">{hostname(project.url)}</span></div>
          </div>

          <section className="panel-sect">
            <h4>Overview</h4>
            <p>{project.overview || project.blurb}</p>
          </section>

          {project.approach && (
            <section className="panel-sect">
              <h4>Approach</h4>
              <p>{project.approach}</p>
            </section>
          )}

          {project.results && (
            <section className="panel-sect">
              <h4>Results</h4>
              <p>{project.results}</p>
            </section>
          )}

          {project.stack.length > 0 && (
            <section className="panel-sect">
              <h4>Stack &amp; deliverables</h4>
              <ul className="chips-list">
                {project.stack.map(s => <li key={s}>{s}</li>)}
              </ul>
            </section>
          )}

          <div className="panel-actions">
            <a className="btn btn-primary btn-lg" href={project.url} target="_blank" rel="noopener noreferrer">
              Open live site
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5.5 3h7.5v7.5M13 3 3.5 12.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
            </a>
            {project.reportUrl && (
              <a className="btn btn-ghost btn-lg" href={project.reportUrl} target="_blank" rel="noopener noreferrer">Download report</a>
            )}
            <button className="btn btn-ghost btn-lg" onClick={onShareProject}>
              {shareState === "copied" ? "Project link copied" : shareState === "error" ? "Copy failed" : "Share project"}
            </button>
          </div>

          <p className="panel-note">Edit any project in the <b>“Elettro — Portfolio Data”</b> Google Sheet. Columns: title, categories, year, url, reportUrl, blurb, role, stack, media, client, overview, approach, results.</p>
        </div>
      </aside>
    </div>
  );
}

// ─────────────────────────── APP ───────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "editorial",
  "accent": "amber",
  "thumb": "gradient",
  "showCounts": true
}/*EDITMODE-END*/;

const ACCENTS = {
  amber:   "oklch(0.86 0.17 88)",
  electric:"oklch(0.82 0.18 220)",
  coral:   "oklch(0.78 0.17 25)",
  lime:    "oklch(0.88 0.18 130)"
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [filter, setFilter] = useState("ALL");
  const [open, setOpen] = useState(null);
  const openCaseStudy = (project) => {
    setOpen(project);
    if (project?.id) window.history.replaceState(null, "", `#project-${project.id}`);
  };
  const closeCaseStudy = () => {
    setOpen(null);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  };
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState(PROJECTS);
  const [source, setSource] = useState("local"); // 'local' | 'sheet' | 'fetching'

  // Try to load fresh data from the Google Sheet. Fall back silently to the
  // embedded PROJECTS array if the sheet isn't shared / network blocks the fetch.
  useEffect(() => {
    let cancelled = false;
    setSource("fetching");
    fetch(SHEET_CSV, { mode: "cors" })
      .then(r => r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status)))
      .then(text => {
        if (cancelled) return;
        const rows = parseCSV(text).map(normalizeSheetRow).map(rowToProject).filter(p => p.title);
        if (rows.length) { setProjects(rows); setSource("sheet"); }
        else setSource("local");
      })
      .catch(() => { if (!cancelled) setSource("local"); });
    return () => { cancelled = true; };
  }, []);

  // Apply accent to :root
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", ACCENTS[t.accent] || ACCENTS.amber);
  }, [t.accent]);

  // Apply density to :root
  useEffect(() => {
    document.documentElement.dataset.density = t.density;
  }, [t.density]);

  const counts = useMemo(() => {
    const c = { ALL: projects.length };
    FILTERS.slice(1).forEach(f => {
      c[f] = projects.filter(p => p.cats.includes(f)).length;
    });
    return c;
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(p => {
      const inCat = filter === "ALL" || p.cats.includes(filter);
      if (!inCat) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q) || p.cats.join(" ").toLowerCase().includes(q);
    });
  }, [filter, query, projects]);

  useEffect(() => {
    if (!projects.length) return;
    const openFromHash = () => {
      const m = window.location.hash.match(/^#project-(.+)$/);
      if (!m) return;
      const id = decodeURIComponent(m[1]);
      const match = projects.find((project) => project.id === id);
      if (match) setOpen(match);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [projects]);

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-stage">
          <h1 className="hero-h">
            A field of <em>built</em> things —<br/>
            sites, sounds, signals.
          </h1>
          <p className="hero-sub">
            Twenty-four selected projects across web, video, music, branding and custom apps.
            Filter the grid, or open any case study for context and a live link.
          </p>
        </div>
      </header>

      <section className="control-row">
        <FilterRail active={filter} onChange={setFilter} counts={counts} />
        <div className="search">
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <input
            type="text"
            placeholder="Search projects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-x" onClick={() => setQuery("")} aria-label="Clear search">×</button>
          )}
        </div>
        <div className="count-line">
          <span className="count-num">{pad2(filtered.length)}</span>
          <span className="count-lbl">of {pad2(projects.length)} shown</span>
        </div>
      </section>

      <main className="grid" data-density={t.density}>
        {filtered.map((p, i) => (
          <Card key={p.id} project={p} index={i} onOpen={openCaseStudy} thumbStyle={t.thumb}/>
        ))}
        {source === "fetching" && filtered.length === 0 && (
          <div className="empty"><span>Loading from Google Sheet…</span></div>
        )}
        {filtered.length === 0 && (
          <div className="empty">
            <span>No projects match.</span>
            <button className="btn btn-ghost" onClick={() => { setFilter("ALL"); setQuery(""); }}>Reset filters</button>
          </div>
        )}
      </main>

      <footer className="foot">
        <div className="foot-l">
          <span className="brand-mark sm">e·</span>
          <span>Elettro Studio · selected works, {new Date().getFullYear()}</span>
        </div>
        <div className="foot-r">
          <span>{filtered.length} of {projects.length} visible</span>
          <span className="dot">·</span>
          <span title={source === "sheet" ? "Loaded from Google Sheet" : "Using embedded fallback (Sheet unreachable)"}>
            <span className={`src-dot src-${source}`}></span>
            {source === "sheet" ? "Live · Google Sheet" : source === "fetching" ? "Loading sheet…" : "Local data"}
          </span>
          <span className="dot">·</span>
          <span>Press <kbd>Esc</kbd> to close case study</span>
        </div>
      </footer>

      <CasePanel project={open} onClose={closeCaseStudy} thumbStyle={t.thumb}/>

      <TweaksPanel>
        <TweakSection label="Layout"/>
        <TweakRadio label="Density" value={t.density}
          options={["compact","editorial","showcase"]}
          onChange={(v) => setTweak("density", v)}/>
        <TweakSection label="Visuals"/>
        <TweakRadio label="Thumbnail" value={t.thumb}
          options={["gradient","stripes","mono"]}
          onChange={(v) => setTweak("thumb", v)}/>
        <TweakRadio label="Accent" value={t.accent}
          options={["amber","electric","coral","lime"]}
          onChange={(v) => setTweak("accent", v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
