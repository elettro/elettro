<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SEO & AIO Audit — Dakoma Roofing | Elettro</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0d0d0d;
    --white: #ffffff;
    --off-white: #f7f5f2;
    --dk-red: #c0392b;
    --dk-red-dark: #922b21;
    --dk-red-light: #e74c3c;
    --dk-navy: #1a1a2e;
    --dk-charcoal: #1c1c1c;
    --dk-gold: #f39c12;
    --dk-sky: #2980b9;
    --elettro-cyan: #00e5ff;
    --elettro-green: #69ff47;
    --gray-100: #f0ede8;
    --gray-200: #ddd9d2;
    --gray-400: #9a9690;
    --gray-600: #5a5650;
    --grade-a: #22c55e;
    --grade-b: #84cc16;
    --grade-c: #eab308;
    --grade-d: #f97316;
    --grade-f: #ef4444;
    --grade-a-bg: #dcfce7;
    --grade-b-bg: #ecfccb;
    --grade-c-bg: #fef9c3;
    --grade-d-bg: #ffedd5;
    --grade-f-bg: #fee2e2;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--off-white);
    color: var(--black);
    font-size: 16px;
    line-height: 1.6;
  }

  /* ── HEADER ── */
  header {
    background: var(--dk-charcoal);
    position: relative;
    overflow: hidden;
  }

  .roof-bg {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, rgba(192,57,43,0.18) 0%, transparent 50%),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 28px,
        rgba(255,255,255,0.015) 28px,
        rgba(255,255,255,0.015) 30px
      );
    pointer-events: none;
  }

  /* Roof silhouette decorative */
  .roof-silhouette {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 300px;
    height: 180px;
    opacity: 0.06;
    pointer-events: none;
  }

  .header-red-bar {
    background: var(--dk-red);
    height: 5px;
    width: 100%;
  }

  .header-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 52px 40px 44px;
    position: relative;
    z-index: 2;
  }

  .header-logo-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .logo-icon {
    width: 52px;
    height: 52px;
    background: var(--dk-red);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-icon svg { width: 30px; height: 30px; fill: white; }

  .logo-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 26px;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--white);
    letter-spacing: 0.06em;
    line-height: 1;
  }

  .logo-text span { color: var(--dk-red); }

  .logo-tagline {
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  .header-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--dk-red);
    margin-bottom: 16px;
  }

  .header-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .hbadge {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid rgba(192,57,43,0.35);
    color: rgba(231,76,60,0.9);
    background: rgba(192,57,43,0.08);
  }

  .header-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(42px, 7vw, 76px);
    font-weight: 900;
    line-height: 0.92;
    color: var(--white);
    text-transform: uppercase;
    letter-spacing: -0.01em;
    margin-bottom: 8px;
  }

  .header-title span { color: var(--dk-red); }

  .header-subtitle {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(18px, 3vw, 24px);
    font-weight: 300;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 36px;
  }

  .header-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 28px;
    border-top: 0.5px solid rgba(255,255,255,0.1);
    padding-top: 24px;
  }

  .meta-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 4px;
  }

  .meta-value { font-size: 14px; color: var(--white); }
  .meta-value a { color: var(--dk-red); text-decoration: none; }

  .accent-line {
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--dk-red-dark) 0%, var(--dk-red) 30%, var(--dk-gold) 60%, var(--dk-sky) 100%);
  }

  /* ── MAIN ── */
  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 52px 40px 80px;
  }

  .section-header { margin-bottom: 28px; }

  .section-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dk-red);
    margin-bottom: 6px;
  }

  .section-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 800;
    text-transform: uppercase;
    color: var(--black);
    line-height: 1;
  }

  .divider {
    width: 100%;
    height: 0.5px;
    background: var(--gray-200);
    margin: 44px 0;
  }

  /* ── INTRO ── */
  .intro-block {
    background: var(--dk-charcoal);
    border-radius: 12px;
    padding: 32px 36px;
    margin-bottom: 44px;
    border-left: 4px solid var(--dk-red);
  }

  .intro-block p {
    color: rgba(255,255,255,0.80);
    font-size: 15px;
    line-height: 1.75;
    margin-bottom: 10px;
  }

  .intro-block p:last-child { margin-bottom: 0; }
  .intro-block strong { color: var(--dk-red); font-weight: 500; }

  /* ── ODOO WARNING ── */
  .platform-warn {
    background: rgba(243,156,18,0.06);
    border: 1px solid rgba(243,156,18,0.25);
    border-radius: 12px;
    padding: 22px 26px;
    margin-bottom: 28px;
  }

  .platform-warn h3 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #b7770d;
    margin-bottom: 8px;
  }

  .platform-warn p { font-size: 13px; color: var(--gray-600); line-height: 1.65; }
  .platform-warn strong { color: var(--black); font-weight: 600; }

  /* ── BACKEND GRID ── */
  .backend-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(172px, 1fr));
    gap: 14px;
    margin-bottom: 44px;
  }

  .backend-card {
    background: var(--white);
    border: 0.5px solid var(--gray-200);
    border-radius: 10px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .bc-label { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gray-400); }
  .bc-value { font-family: 'Barlow Condensed', sans-serif; font-size: 19px; font-weight: 700; color: var(--black); line-height: 1.2; }
  .bc-note { font-size: 11.5px; color: var(--gray-600); line-height: 1.4; }

  .bc-pill {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 99px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .pill-no { background: #fee2e2; color: #991b1b; }
  .pill-yes { background: #dcfce7; color: #166534; }
  .pill-warn { background: #ffedd5; color: #9a3412; }
  .pill-odoo { background: #ede9fe; color: #5b21b6; }
  .pill-partial { background: #dbeafe; color: #1e40af; }

  /* ── SCORE HERO ── */
  .score-hero {
    background: var(--dk-charcoal);
    border-radius: 14px;
    padding: 36px;
    margin-bottom: 44px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 36px;
    align-items: center;
  }

  @media (max-width: 580px) { .score-hero { grid-template-columns: 1fr; } }

  .overall-score-circle {
    width: 132px;
    height: 132px;
    border-radius: 50%;
    border: 3px solid var(--dk-red);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(192,57,43,0.08);
  }

  .osc-number { font-family: 'Barlow Condensed', sans-serif; font-size: 50px; font-weight: 900; color: var(--white); line-height: 1; }
  .osc-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
  .osc-grade { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 700; color: var(--grade-d); }

  .score-bars { display: flex; flex-direction: column; gap: 12px; }
  .score-row { display: flex; flex-direction: column; gap: 4px; }
  .score-row-header { display: flex; justify-content: space-between; align-items: baseline; }
  .score-cat { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.65); }
  .score-val { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; }

  .bar-track {
    width: 100%;
    height: 5px;
    background: rgba(255,255,255,0.08);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill { height: 100%; border-radius: 3px; }

  /* ── CATEGORY CARDS ── */
  .cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(265px, 1fr));
    gap: 18px;
    margin-bottom: 44px;
  }

  .cat-card {
    background: var(--white);
    border: 0.5px solid var(--gray-200);
    border-radius: 12px;
    padding: 22px 26px;
  }

  .cat-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
  }

  .cat-card-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 17px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--black);
    letter-spacing: 0.03em;
    line-height: 1.1;
  }

  .grade-badge {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 800;
    min-width: 42px;
    height: 42px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .grade-f { background: var(--grade-f-bg); color: var(--grade-f); }
  .grade-d { background: var(--grade-d-bg); color: var(--grade-d); }
  .grade-c { background: var(--grade-c-bg); color: #854d0e; }
  .grade-b { background: var(--grade-b-bg); color: #3f6212; }
  .grade-a { background: var(--grade-a-bg); color: #166534; }

  .cat-score-line {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .cat-score-num { font-family: 'Barlow Condensed', sans-serif; font-size: 30px; font-weight: 800; line-height: 1; color: var(--black); }
  .cat-score-denom { font-size: 12px; color: var(--gray-400); margin-top: 4px; }

  .cat-bar-track { flex: 1; height: 7px; background: var(--gray-100); border-radius: 4px; overflow: hidden; }
  .cat-bar-fill { height: 100%; border-radius: 4px; }

  .cat-findings { list-style: none; display: flex; flex-direction: column; gap: 7px; }

  .finding {
    font-size: 12.5px;
    line-height: 1.45;
    padding-left: 16px;
    position: relative;
    color: var(--gray-600);
  }

  .finding::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .finding.pos::before { background: var(--grade-a); }
  .finding.neg::before { background: var(--grade-f); }
  .finding.warn::before { background: var(--grade-c); }
  .finding strong { color: var(--black); font-weight: 500; }

  /* ── ASSETS ── */
  .assets-box {
    background: var(--dk-charcoal);
    border-radius: 14px;
    padding: 32px 36px;
    margin-bottom: 44px;
    border-left: 4px solid var(--dk-gold);
  }

  .assets-box h3 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--dk-gold);
    letter-spacing: 0.04em;
    margin-bottom: 18px;
  }

  .assets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
    gap: 14px;
  }

  .asset-item {
    background: rgba(255,255,255,0.05);
    border: 0.5px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 14px 16px;
  }

  .asset-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 5px; }
  .asset-value { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700; color: var(--white); line-height: 1.25; }

  /* ── COMPARE TABLE ── */
  .compare-table-wrap {
    overflow-x: auto;
    border-radius: 12px;
    border: 0.5px solid var(--gray-200);
    margin-bottom: 44px;
  }

  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }

  thead { background: var(--dk-charcoal); color: var(--white); }

  thead th {
    padding: 14px 18px;
    text-align: left;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  thead th:not(:first-child) { text-align: center; }
  tbody tr { border-bottom: 0.5px solid var(--gray-100); }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:nth-child(even) { background: #f9f6f2; }
  tbody td { padding: 13px 18px; vertical-align: middle; }
  tbody td:first-child { font-weight: 500; color: var(--black); font-size: 13px; }
  tbody td:not(:first-child) { text-align: center; }

  .td-current { font-family: 'Barlow Condensed', sans-serif; font-size: 17px; font-weight: 700; color: var(--grade-f); }
  .td-projected { font-family: 'Barlow Condensed', sans-serif; font-size: 17px; font-weight: 700; color: var(--grade-a); }
  .td-delta { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; color: var(--dk-red); background: rgba(192,57,43,0.07); border-radius: 5px; padding: 3px 9px !important; }

  .table-footer { background: var(--dk-charcoal); color: var(--white); font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; text-transform: uppercase; }
  .table-footer td { padding: 14px 18px !important; }
  .table-footer .td-current { color: var(--grade-d); }
  .table-footer .td-projected { color: var(--elettro-green); font-size: 20px; }
  .table-footer .td-delta { color: var(--dk-gold); font-size: 18px; background: rgba(243,156,18,0.1); }

  /* ── FIXES ── */
  .fixes-grid { display: flex; flex-direction: column; gap: 14px; margin-bottom: 44px; }

  .fix-card {
    background: var(--white);
    border: 0.5px solid var(--gray-200);
    border-radius: 12px;
    padding: 20px 26px;
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 18px;
    align-items: flex-start;
  }

  .fix-number { font-family: 'Barlow Condensed', sans-serif; font-size: 34px; font-weight: 900; color: var(--dk-red); line-height: 1; margin-top: 2px; }
  .fix-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; text-transform: uppercase; color: var(--black); letter-spacing: 0.02em; margin-bottom: 5px; }
  .fix-desc { font-size: 13.5px; line-height: 1.6; color: var(--gray-600); }

  .fix-impact {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 99px;
    margin-top: 7px;
  }

  .impact-critical { background: #fee2e2; color: #991b1b; }
  .impact-high { background: #ffedd5; color: #9a3412; }
  .impact-aio { background: rgba(192,57,43,0.08); color: #7b1d1d; }
  .impact-local { background: #dbeafe; color: #1e40af; }

  /* ── CEILING ── */
  .ceiling-box {
    background: var(--dk-charcoal);
    border-radius: 14px;
    padding: 36px;
    margin-bottom: 44px;
    position: relative;
    overflow: hidden;
  }

  .ceiling-box::after {
    content: '88';
    position: absolute;
    right: -10px;
    top: -20px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 180px;
    font-weight: 900;
    color: rgba(192,57,43,0.06);
    line-height: 1;
    pointer-events: none;
  }

  .ceiling-box h3 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--dk-gold);
    letter-spacing: 0.04em;
    margin-bottom: 14px;
  }

  .ceiling-box p {
    font-size: 14.5px;
    color: rgba(255,255,255,0.75);
    line-height: 1.75;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
  }

  .ceiling-box p:last-child { margin-bottom: 0; }
  .ceiling-box strong { color: var(--dk-gold); font-weight: 500; }

  /* ── HOSTING NOTE ── */
  .hosting-box {
    background: rgba(41,128,185,0.06);
    border: 1px solid rgba(41,128,185,0.22);
    border-radius: 12px;
    padding: 28px 32px;
    margin-bottom: 44px;
  }

  .hosting-box h3 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--dk-sky);
    letter-spacing: 0.04em;
    margin-bottom: 14px;
  }

  .hosting-box p { font-size: 14px; color: var(--gray-600); line-height: 1.7; margin-bottom: 10px; }
  .hosting-box p:last-child { margin-bottom: 0; }
  .hosting-box strong { color: var(--black); font-weight: 600; }

  .hosting-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
    margin-top: 18px;
  }

  .host-option {
    background: rgba(41,128,185,0.05);
    border: 0.5px solid rgba(41,128,185,0.2);
    border-radius: 8px;
    padding: 14px 16px;
  }

  .host-name { font-family: 'Barlow Condensed', sans-serif; font-size: 17px; font-weight: 700; color: var(--black); margin-bottom: 4px; }
  .host-detail { font-size: 12px; color: var(--gray-600); line-height: 1.5; }
  .host-rec { font-size: 11px; font-weight: 600; color: var(--dk-sky); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 6px; }

  /* ── TYPO CALLOUT ── */
  .typo-box {
    background: rgba(239,68,68,0.05);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    padding: 18px 22px;
    margin-bottom: 20px;
  }

  .typo-box h4 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #b91c1c;
    margin-bottom: 8px;
  }

  .typo-list { list-style: none; display: flex; flex-direction: column; gap: 5px; }

  .typo-item {
    font-size: 12.5px;
    color: var(--gray-600);
    display: flex;
    gap: 10px;
    align-items: baseline;
  }

  .typo-item .bad { color: #b91c1c; font-weight: 600; }
  .typo-item .good { color: #166534; font-weight: 600; }

  /* ── FOOTER ── */
  footer { background: var(--dk-charcoal); padding: 36px 40px; }

  .footer-inner {
    max-width: 960px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 28px;
    align-items: center;
  }

  @media (max-width: 580px) { .footer-inner { grid-template-columns: 1fr; } }

  .footer-brand { font-family: 'Barlow Condensed', sans-serif; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--white); margin-bottom: 6px; }
  .footer-brand span { color: var(--dk-red); }
  .footer-contact { font-size: 12.5px; color: rgba(255,255,255,0.4); line-height: 1.8; }
  .footer-contact a { color: var(--dk-red); text-decoration: none; }

  .footer-cta {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--white);
    background: var(--dk-red);
    padding: 13px 26px;
    border-radius: 8px;
    text-decoration: none;
    white-space: nowrap;
    display: inline-block;
  }

  @media (max-width: 620px) {
    main { padding: 40px 20px 60px; }
    .header-inner { padding: 36px 20px 32px; }
    footer { padding: 28px 20px; }
    .intro-block { padding: 24px 20px; }
  }
</style>
</head>
<body>

<!-- HEADER -->
<header>
  <div class="roof-bg"></div>
  <svg class="roof-silhouette" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
    <polygon points="150,10 290,100 10,100" fill="white"/>
    <rect x="30" y="100" width="240" height="80" fill="white"/>
    <rect x="110" y="120" width="80" height="60" fill="#1c1c1c"/>
    <polygon points="20,100 10,105 290,105 280,100" fill="white" opacity="0.5"/>
  </svg>

  <div class="header-red-bar"></div>
  <div class="header-inner">
    <div class="header-logo-row">
      <div class="logo-icon">
        <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <polygon points="15,2 28,14 2,14" fill="white"/>
          <rect x="3" y="14" width="24" height="14" fill="white" opacity="0.85"/>
          <rect x="11" y="18" width="8" height="10" fill="#c0392b"/>
        </svg>
      </div>
      <div>
        <div class="logo-text">Dakoma <span>Roofing</span></div>
        <div class="logo-tagline">Pompano Beach, FL — Since 1997</div>
      </div>
    </div>
    <p class="header-eyebrow">Elettro Interactive &nbsp;·&nbsp; Confidential Digital Audit</p>
    <div class="header-badges">
      <span class="hbadge">BBB A+ Rated</span>
      <span class="hbadge">4.8 Stars · 144 Reviews</span>
      <span class="hbadge">BuildZoom Top 2% Florida</span>
      <span class="hbadge">Since 1997</span>
      <span class="hbadge">Owens Corning · GAF · CertainTeed</span>
    </div>
    <h1 class="header-title">SEO &amp; <span>AIO</span><br>Audit Report</h1>
    <p class="header-subtitle">Dakoma Roofing, Inc. &nbsp;·&nbsp; dakomaroofing.com</p>
    <div class="header-meta">
      <div>
        <p class="meta-label">Prepared by</p>
        <p class="meta-value">Dean Palermo, Elettro Interactive</p>
      </div>
      <div>
        <p class="meta-label">Contact</p>
        <p class="meta-value"><a href="tel:3104086687">310.408.6687</a> &nbsp;·&nbsp; <a href="mailto:dpalermo@elettro.com">dpalermo@elettro.com</a></p>
      </div>
      <div>
        <p class="meta-label">Client</p>
        <p class="meta-value">Dakoma Roofing, Inc. &nbsp;·&nbsp; Joel Bustos, President</p>
      </div>
      <div>
        <p class="meta-label">Date</p>
        <p class="meta-value">June 15, 2026</p>
      </div>
    </div>
  </div>
  <div class="accent-line"></div>
</header>

<main>

  <!-- INTRO -->
  <div class="intro-block">
    <p>This audit evaluates <strong>dakomaroofing.com</strong> — the website of Dakoma Roofing, Inc., a full-service residential and commercial roofing contractor serving South Florida since 1997 — across five core dimensions of modern search performance.</p>
    <p>Dakoma has genuine real-world authority: <strong>BBB Accredited with an A+ rating, 4.8 stars across 144 reviews, a BuildZoom score of 114 ranking in the top 2% of 191,428 Florida licensed contractors, certified installer status with Owens Corning, CertainTeed, Boral, and GAF, and a 29-year operating history in Miami-Dade, Broward, and Palm Beach counties.</strong> The website is built on Odoo — an ERP/business platform not designed for SEO performance — and is missing the schema markup, on-page optimization, and AI search infrastructure that this company's real-world reputation deserves.</p>
  </div>

  <!-- SECTION 01: BACKEND -->
  <div class="section-header">
    <p class="section-eyebrow">01 &nbsp;—&nbsp; Platform Analysis</p>
    <h2 class="section-title">Is It WordPress? What's the Stack?</h2>
  </div>

  <div class="platform-warn">
    <h3>Odoo Platform Warning — Built for ERP, Not SEO</h3>
    <p>The site is built on <strong>Odoo</strong> — confirmed by the <code>meta-generator: Odoo</code> tag, all asset URLs routing through <code>/web/image/website/</code> paths, the footer "Powered by Odoo" credit, and the <code>/web/login</code> admin path. Odoo is a powerful open-source ERP and business management platform — but its website builder is a secondary feature, not a purpose-built SEO tool. <strong>Odoo generates bloated HTML, has limited structured data support, and its asset delivery pipeline is optimized for app performance rather than crawler accessibility.</strong> For a local service contractor competing in the highly competitive South Florida roofing market, the platform is a ceiling on SEO performance.</p>
  </div>

  <div class="backend-grid">
    <div class="backend-card">
      <span class="bc-label">WordPress?</span>
      <span class="bc-pill pill-no">No</span>
      <span class="bc-note">Not WordPress. Built on Odoo — an open-source ERP platform with an integrated website builder.</span>
    </div>
    <div class="backend-card">
      <span class="bc-label">Platform</span>
      <span class="bc-value">Odoo CMS</span>
      <span class="bc-note">Confirmed by meta-generator tag, asset paths, and "Powered by Odoo" footer link.</span>
    </div>
    <div class="backend-card">
      <span class="bc-label">Meta Keywords</span>
      <span class="bc-pill pill-warn">Present (but outdated)</span>
      <span class="bc-note">11 keyword meta tags set — Google has ignored meta-keywords since 2009. Effort spent on a deprecated signal.</span>
    </div>
    <div class="backend-card">
      <span class="bc-label">Meta Description</span>
      <span class="bc-pill pill-no">Placeholder</span>
      <span class="bc-note">"This is the homepage of the website" — a default Odoo placeholder, not a real description. Critical error.</span>
    </div>
    <div class="backend-card">
      <span class="bc-label">OG / Social Meta</span>
      <span class="bc-pill pill-warn">Broken</span>
      <span class="bc-note">OG description mirrors the placeholder text. OG image is the logo file, not a branded social card.</span>
    </div>
    <div class="backend-card">
      <span class="bc-label">Schema Markup</span>
      <span class="bc-pill pill-no">None</span>
      <span class="bc-note">Zero structured data. No LocalBusiness, RoofingContractor, Review, Service, or FAQPage schema.</span>
    </div>
    <div class="backend-card">
      <span class="bc-label">Navigation Typo</span>
      <span class="bc-pill pill-no">"Galery" (sic)</span>
      <span class="bc-note">Gallery is misspelled in nav, page title, and URL (/galery). Visible to every visitor and crawler.</span>
    </div>
    <div class="backend-card">
      <span class="bc-label">Canonical</span>
      <span class="bc-pill pill-yes">Correct</span>
      <span class="bc-note">Canonical set to https://www.dakomaroofing.com/ — properly configured.</span>
    </div>
    <div class="backend-card">
      <span class="bc-label">Social Links</span>
      <span class="bc-pill pill-warn">Broken URLs</span>
      <span class="bc-note">Facebook, Instagram, YouTube all route to /website/social/[platform] — internal Odoo redirect paths, not actual profile URLs.</span>
    </div>
  </div>

  <!-- TYPO CALLOUT -->
  <div class="typo-box">
    <h4>⚠ Content Errors Found — Fix Before Anything Else</h4>
    <ul class="typo-list">
      <li class="typo-item"><span class="bad">"Galery"</span> → <span class="good">"Gallery"</span> — misspelled in navigation, page title, and URL (/galery). Appears 4+ times across the site.</li>
      <li class="typo-item"><span class="bad">"Roffing"</span> → <span class="good">"Roofing"</span> — homepage H2 reads "We Are Commercial Roffing Experts In USA"</li>
      <li class="typo-item"><span class="bad">"Lear More"</span> → <span class="good">"Learn More"</span> — CTA button text misspelled on 3 homepage sections</li>
      <li class="typo-item"><span class="bad">"This is the homepage of the website"</span> → <span class="good">Real meta description targeting South Florida roofing keywords</span></li>
      <li class="typo-item"><span class="bad">"We Are Commercial Roffing Experts In USA"</span> — headline H2 has spelling error and vague geography ("USA" instead of "South Florida")</li>
    </ul>
  </div>

  <div class="divider"></div>

  <!-- SECTION 02: SCORES -->
  <div class="section-header">
    <p class="section-eyebrow">02 &nbsp;—&nbsp; Current Performance</p>
    <h2 class="section-title">SEO &amp; AIO Scores — Today</h2>
  </div>

  <div class="score-hero">
    <div class="overall-score-circle">
      <span class="osc-number">38</span>
      <span class="osc-label">/ 100</span>
      <span class="osc-grade">F</span>
    </div>
    <div class="score-bars">
      <div class="score-row">
        <div class="score-row-header">
          <span class="score-cat">Technical SEO</span>
          <span class="score-val" style="color:#ef4444;">35</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:35%;background:#ef4444;"></div></div>
      </div>
      <div class="score-row">
        <div class="score-row-header">
          <span class="score-cat">On-Page SEO</span>
          <span class="score-val" style="color:#ef4444;">32</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:32%;background:#ef4444;"></div></div>
      </div>
      <div class="score-row">
        <div class="score-row-header">
          <span class="score-cat">Content Quality</span>
          <span class="score-val" style="color:#f97316;">45</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:45%;background:#f97316;"></div></div>
      </div>
      <div class="score-row">
        <div class="score-row-header">
          <span class="score-cat">AI Search Optimization</span>
          <span class="score-val" style="color:#ef4444;">22</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:22%;background:#ef4444;"></div></div>
      </div>
      <div class="score-row">
        <div class="score-row-header">
          <span class="score-cat">Trust &amp; Authority</span>
          <span class="score-val" style="color:#eab308;">62</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:62%;background:#eab308;"></div></div>
      </div>
    </div>
  </div>

  <!-- CATEGORY CARDS -->
  <div class="cat-grid">

    <div class="cat-card">
      <div class="cat-card-header">
        <div class="cat-card-title">Technical<br>SEO</div>
        <div class="grade-badge grade-f">F</div>
      </div>
      <div class="cat-score-line">
        <span class="cat-score-num">35</span>
        <span class="cat-score-denom">/100</span>
        <div class="cat-bar-track"><div class="cat-bar-fill" style="width:35%;background:var(--grade-f);"></div></div>
      </div>
      <ul class="cat-findings">
        <li class="finding pos"><strong>Canonical tag correctly set</strong> — www version is canonical</li>
        <li class="finding pos"><strong>OG and Twitter Card meta present</strong> — social sharing framework exists, even if content is broken</li>
        <li class="finding pos"><strong>Active sitemap at /website/info</strong> — linked in footer, Odoo generates one</li>
        <li class="finding neg"><strong>Meta description is "This is the homepage of the website"</strong> — an unfilled Odoo default placeholder appearing in every Google search result</li>
        <li class="finding neg"><strong>Odoo asset paths (/web/image/website/...)</strong> — all images served through Odoo's application server, not optimized CDN delivery</li>
        <li class="finding neg"><strong>Social links are internal Odoo redirect paths</strong> — /website/social/facebook is not facebook.com/dakomaroofing</li>
        <li class="finding neg"><strong>No schema markup</strong> — zero structured data of any kind</li>
        <li class="finding neg"><strong>meta-keywords tag still in use</strong> — a deprecated SEO signal Google has ignored since 2009</li>
        <li class="finding neg"><strong>Sign in link in public navigation</strong> — exposes backend login (/web/login) in the main menu — confusing for users and unnecessary for visitors</li>
      </ul>
    </div>

    <div class="cat-card">
      <div class="cat-card-header">
        <div class="cat-card-title">On-Page<br>SEO</div>
        <div class="grade-badge grade-f">F</div>
      </div>
      <div class="cat-score-line">
        <span class="cat-score-num">32</span>
        <span class="cat-score-denom">/100</span>
        <div class="cat-bar-track"><div class="cat-bar-fill" style="width:32%;background:var(--grade-f);"></div></div>
      </div>
      <ul class="cat-findings">
        <li class="finding pos"><strong>Title tag is "Home | Dakoma Roofing"</strong> — at least the brand name is there</li>
        <li class="finding pos"><strong>7 service subpages with distinct URLs</strong> — good content architecture even if under-optimized</li>
        <li class="finding pos"><strong>Service area page exists</strong> — /service-area addresses local SEO intent</li>
        <li class="finding neg"><strong>No meta description</strong> — the placeholder "This is the homepage" is worse than having none at all</li>
        <li class="finding neg"><strong>Title tag misses all keywords</strong> — "roofing contractor Pompano Beach," "South Florida roofing," "roof replacement Broward County" — none present</li>
        <li class="finding neg"><strong>H2s are rotating hero banner headlines</strong> — "We Are Commercial Roffing Experts In USA" (with spelling error), "Reliable Roofing and Retro-fit" — decorative, not keyword-targeted</li>
        <li class="finding neg"><strong>No H1 on the homepage</strong> — the above-fold content is all H2 carousel headlines with no semantic H1</li>
        <li class="finding neg"><strong>"Galery" nav link</strong> — misspelled across entire site navigation</li>
        <li class="finding neg"><strong>3× "Lear More" CTA buttons</strong> — misspelled call-to-action visible to all visitors</li>
        <li class="finding warn"><strong>Blog exists but unclear how active</strong> — /roofing-blog linked in nav; content freshness unknown</li>
      </ul>
    </div>

    <div class="cat-card">
      <div class="cat-card-header">
        <div class="cat-card-title">Content<br>Quality</div>
        <div class="grade-badge grade-d">D+</div>
      </div>
      <div class="cat-score-line">
        <span class="cat-score-num">45</span>
        <span class="cat-score-denom">/100</span>
        <div class="cat-bar-track"><div class="cat-bar-fill" style="width:45%;background:var(--grade-d);"></div></div>
      </div>
      <ul class="cat-findings">
        <li class="finding pos"><strong>7 service pages covering the full service range</strong> — commercial, reroofing, installations, storm damage, waterproofing, roof repair, roof types</li>
        <li class="finding pos"><strong>6 service area locations listed</strong> — Hollywood, Sunrise, Boca Raton, Weston, Fort Lauderdale, Pembroke Pines</li>
        <li class="finding pos"><strong>Certifications named on homepage</strong> — Owens Corning, CertainTeed, Boral, GAF all cited as top-tier installer brands</li>
        <li class="finding pos"><strong>3 customer testimonials on homepage</strong> — real names, real quotes</li>
        <li class="finding pos"><strong>Contact form + free estimate form both present</strong> — good conversion infrastructure</li>
        <li class="finding neg"><strong>Roof Types and Roof Installations service pages have identical copy</strong> — the same paragraph appears verbatim on both pages, which Google flags as duplicate content</li>
        <li class="finding neg"><strong>About Us and company history content is thin</strong> — "since 1997" and a paragraph; the 29-year story, Joel Bustos's background, certifications list, and warranty details are not developed</li>
        <li class="finding neg"><strong>No emergency roofing page</strong> despite "emergency roof repair" being in the meta-keywords — the keyword is targeted but the page doesn't exist</li>
        <li class="finding neg"><strong>No pricing content or cost guide</strong> — "how much does roof replacement cost in Florida" is in the meta-keywords but there's no answer on the site</li>
      </ul>
    </div>

    <div class="cat-card">
      <div class="cat-card-header">
        <div class="cat-card-title">AI Search<br>Optimization</div>
        <div class="grade-badge grade-f">F</div>
      </div>
      <div class="cat-score-line">
        <span class="cat-score-num">22</span>
        <span class="cat-score-denom">/100</span>
        <div class="cat-bar-track"><div class="cat-bar-fill" style="width:22%;background:var(--grade-f);"></div></div>
      </div>
      <ul class="cat-findings">
        <li class="finding neg"><strong>Zero schema markup</strong> — no LocalBusiness, RoofingContractor, Service, Review, AggregateRating, or FAQPage schema. AI systems have no structured entity data from this site</li>
        <li class="finding neg"><strong>AI asked "best roofing contractor in Pompano Beach"</strong> gets answers from Angi, BBB, Yelp, and HomeAdvisor — not from dakomaroofing.com, which has no structured local entity data</li>
        <li class="finding neg"><strong>The 4.8 star / 144 review rating is on the homepage</strong> but as plain image + text — not AggregateRating schema. AI systems and Google rich results cannot extract or display it</li>
        <li class="finding neg"><strong>No FAQPage schema</strong> — "How much does roof replacement cost in Florida?", "How long does a roof last in South Florida?", "Does insurance cover storm roof damage in Florida?" — all high-value AI query targets with no structured answers</li>
        <li class="finding neg"><strong>The meta-keywords list includes "how to fix roof leak fast" and "how much does roof replacement cost"</strong> — these are exactly the AI answer queries that should have FAQ schema, but instead they sit in a deprecated meta tag</li>
        <li class="finding pos"><strong>BBB, BuildZoom, and Angi third-party listings</strong> give AI systems enough to identify Dakoma as a legitimate South Florida contractor. Off-site entity signals are solid.</li>
      </ul>
    </div>

    <div class="cat-card">
      <div class="cat-card-header">
        <div class="cat-card-title">Trust &amp;<br>Authority</div>
        <div class="grade-badge grade-c">C+</div>
      </div>
      <div class="cat-score-line">
        <span class="cat-score-num">62</span>
        <span class="cat-score-denom">/100</span>
        <div class="cat-bar-track"><div class="cat-bar-fill" style="width:62%;background:var(--grade-c);"></div></div>
      </div>
      <ul class="cat-findings">
        <li class="finding pos"><strong>BBB Accredited, A+ rating</strong> — highest BBB trust tier</li>
        <li class="finding pos"><strong>4.8 stars across 144 reviews</strong> — strong review volume and sentiment for a local contractor</li>
        <li class="finding pos"><strong>5.0 on Angi, active Nextdoor community presence</strong></li>
        <li class="finding pos"><strong>BuildZoom score of 114 — top 2% of 191,428 Florida contractors</strong></li>
        <li class="finding pos"><strong>Florida Certified Roofing Contractor license verified active (July 2025)</strong></li>
        <li class="finding pos"><strong>29-year operating history since 1997</strong></li>
        <li class="finding pos"><strong>Written warranties offered</strong> — mentioned on Angi profile</li>
        <li class="finding neg"><strong>None of the above is structured on the website</strong> — BBB badge, BuildZoom score, license number, certification brands are mentioned in text but not schema-marked-up for AI or rich result extraction</li>
        <li class="finding neg"><strong>Social links are broken Odoo redirect paths</strong> — undermines the "Follow us" section trust signal</li>
        <li class="finding warn"><strong>One BBB complaint visible</strong> (drip edge contract dispute) — not addressed or contextualized anywhere on the site</li>
      </ul>
    </div>

  </div>

  <!-- ASSETS -->
  <div class="assets-box">
    <h3>What Dakoma Roofing Has Going For It</h3>
    <div class="assets-grid">
      <div class="asset-item">
        <p class="asset-label">BBB Rating</p>
        <p class="asset-value">A+ Accredited</p>
      </div>
      <div class="asset-item">
        <p class="asset-label">Reviews</p>
        <p class="asset-value">4.8 Stars · 144 Reviews</p>
      </div>
      <div class="asset-item">
        <p class="asset-label">BuildZoom Score</p>
        <p class="asset-value">114 — Top 2% Florida</p>
      </div>
      <div class="asset-item">
        <p class="asset-label">Founded</p>
        <p class="asset-value">1997 — 29 Years Serving South FL</p>
      </div>
      <div class="asset-item">
        <p class="asset-label">Certifications</p>
        <p class="asset-value">Owens Corning · GAF · CertainTeed · Boral</p>
      </div>
      <div class="asset-item">
        <p class="asset-label">Service Counties</p>
        <p class="asset-value">Miami-Dade · Broward · Palm Beach</p>
      </div>
      <div class="asset-item">
        <p class="asset-label">License</p>
        <p class="asset-value">FL Certified Roofing Contractor — Active</p>
      </div>
      <div class="asset-item">
        <p class="asset-label">Phone</p>
        <p class="asset-value">(954) 826-4511</p>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- PROJECTED SCORES -->
  <div class="section-header">
    <p class="section-eyebrow">03 &nbsp;—&nbsp; Elettro Rebuild Projection</p>
    <h2 class="section-title">Current vs. Projected Scores</h2>
  </div>

  <div class="compare-table-wrap">
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Current Score</th>
          <th>Projected Score</th>
          <th>Point Gain</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Technical SEO</td>
          <td><span class="td-current">35 &nbsp;F</span></td>
          <td><span class="td-projected">90 &nbsp;A</span></td>
          <td><span class="td-delta">+55</span></td>
        </tr>
        <tr>
          <td>On-Page SEO</td>
          <td><span class="td-current">32 &nbsp;F</span></td>
          <td><span class="td-projected">88 &nbsp;A</span></td>
          <td><span class="td-delta">+56</span></td>
        </tr>
        <tr>
          <td>Content Quality</td>
          <td><span class="td-current">45 &nbsp;D+</span></td>
          <td><span class="td-projected">84 &nbsp;B+</span></td>
          <td><span class="td-delta">+39</span></td>
        </tr>
        <tr>
          <td>AI Search Optimization</td>
          <td><span class="td-current">22 &nbsp;F</span></td>
          <td><span class="td-projected">90 &nbsp;A</span></td>
          <td><span class="td-delta">+68</span></td>
        </tr>
        <tr>
          <td>Trust &amp; Authority</td>
          <td><span class="td-current">62 &nbsp;C+</span></td>
          <td><span class="td-projected">86 &nbsp;A</span></td>
          <td><span class="td-delta">+24</span></td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="table-footer">
          <td>Overall Score</td>
          <td class="td-current">38 &nbsp;F</td>
          <td class="td-projected">88 &nbsp;A−</td>
          <td class="td-delta">+50 pts</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- CEILING -->
  <div class="ceiling-box">
    <h3>Ceiling Assessment — Why 88–90 Is Achievable</h3>
    <p>Dakoma Roofing is the perfect rebuild candidate: <strong>exceptional real-world credentials (BBB A+, BuildZoom top 2%, 144 reviews at 4.8 stars, 29 years, certified by all four major roofing brands) sitting behind a platform that can't represent them properly.</strong> Odoo's website builder wasn't designed for local SEO — and every deficiency in this audit traces back to platform limitations or unfilled defaults rather than any weakness in the actual business.</p>
    <p>The <strong>AIO jump from 22 → 90 (+68 points)</strong> is the most impactful gain. A complete local service schema package — LocalBusiness (RoofingContractor subtype), Service schema for each of the 7 service types, AggregateRating pulling from the 4.8/144 review count, FAQPage schema answering Florida-specific roofing questions, and GeoCoordinates for the Pompano Beach location — transforms Dakoma from invisible to AI search systems to the most authoritative, structured, citable roofing contractor in Broward County. When someone asks Google AI or ChatGPT "best roofing contractor in Pompano Beach," Dakoma's own site becomes the answer source.</p>
    <p>A static HTML rebuild eliminates all Odoo overhead — faster Core Web Vitals, clean HTML head for schema injection, properly linked social profiles, fixed typos, fixed CTA buttons, and a real meta description on every page. <strong>Within 60–90 days of Google re-crawling, an 88 overall score is the realistic landing point.</strong> Getting above 90 requires ongoing blog publishing targeting South Florida roofing keywords (hurricane season content, TPO vs shingle comparisons, cost guides for Broward/Palm Beach) — compounding content authority that no single rebuild delivers but that the rebuild enables.</p>
  </div>

  <div class="divider"></div>

  <!-- HOSTING ANSWER -->
  <div class="section-header">
    <p class="section-eyebrow">Bonus — Your Hosting Question Answered</p>
    <h2 class="section-title">GitHub Pages vs. Standard Web Hosting for a German Utility Client</h2>
  </div>

  <div class="hosting-box">
    <h3>Yes — Any Standard Web Host Works Identically to GitHub Pages for Custom HTML/CSS/JS</h3>
    <p>GitHub Pages is simply a <strong>free static file server</strong> — it takes your HTML, CSS, and JavaScript files and serves them as-is to the browser. There is nothing GitHub-specific about the rendering. Any web host that serves static files does the exact same thing.</p>
    <p>For a German utility company specifically, <strong>EU-hosted options are worth prioritizing</strong> for DSGVO/GDPR compliance optics — hosting data on German or EU soil removes a potential contractual concern and is a meaningful trust signal for a regulated energy company.</p>
    <p><strong>What you'd gain over GitHub Pages:</strong> a real control panel (cPanel/Plesk) the client can access if needed, EU data residency, PHP or server-side contact forms without third-party services, and a professional invoice line item rather than a github.io domain.</p>
    <p><strong>What you'd lose:</strong> the free CI/CD auto-deploy on git push — though this is easily replicated with an FTP deploy step or a simple GitHub Action pointing at any host.</p>

    <div class="hosting-grid">
      <div class="host-option">
        <p class="host-name">Hetzner</p>
        <p class="host-detail">German company, data centers in Nuremberg &amp; Falkenstein. Exceptional value, enterprise reputation. ~€5–10/mo.</p>
        <p class="host-rec">⭐ Top Pick for German Clients</p>
      </div>
      <div class="host-option">
        <p class="host-name">IONOS (1&amp;1)</p>
        <p class="host-detail">Huge in DACH market, Frankfurt data center, very familiar to German corporate clients. Strong name recognition.</p>
        <p class="host-rec">Best for Client Trust / Recognition</p>
      </div>
      <div class="host-option">
        <p class="host-name">Strato</p>
        <p class="host-detail">German-owned, Berlin-based, common in the German SME market. Clean cPanel environment, reliable uptime.</p>
        <p class="host-rec">Good German SME Option</p>
      </div>
      <div class="host-option">
        <p class="host-name">Cloudflare Pages</p>
        <p class="host-detail">Free CDN + static hosting with git integration (like GitHub Pages but with more performance controls). GDPR-friendly EU edge nodes.</p>
        <p class="host-rec">Best Performance Option</p>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- PRIORITY FIXES -->
  <div class="section-header">
    <p class="section-eyebrow">04 &nbsp;—&nbsp; Recommended Actions</p>
    <h2 class="section-title">Top Priority Fixes</h2>
  </div>

  <div class="fixes-grid">

    <div class="fix-card">
      <div class="fix-number">01</div>
      <div class="fix-content">
        <p class="fix-title">Fix All Typos — Right Now, Before Anything Else</p>
        <p class="fix-desc">"Galery," "Roffing," and "Lear More" are embarrassing for a 29-year-old BBB A+ company and visible to every potential customer and every crawler. The meta description "This is the homepage of the website" is appearing in Google search results today. These require no rebuild — they can be fixed in Odoo's editor in under 30 minutes and should be addressed before any new client sees the site.</p>
        <span class="fix-impact impact-critical">Fix Today</span>
      </div>
    </div>

    <div class="fix-card">
      <div class="fix-number">02</div>
      <div class="fix-content">
        <p class="fix-title">Migrate from Odoo to Clean Static HTML Build</p>
        <p class="fix-desc">Odoo is the root cause of almost every technical problem in this audit: the asset path bloat, the unfilled meta defaults, the broken social redirect paths, the lack of schema control, and the overall page weight. A clean static HTML/CSS/JS rebuild gives full control of the HTML head (for schema injection), eliminates Odoo overhead, enables properly structured service pages, and serves pages in clean semantic HTML that every crawler and AI bot can parse without friction. This is the foundational move.</p>
        <span class="fix-impact impact-critical">Foundation Fix</span>
      </div>
    </div>

    <div class="fix-card">
      <div class="fix-number">03</div>
      <div class="fix-content">
        <p class="fix-title">Implement LocalBusiness Schema + Service + AggregateRating</p>
        <p class="fix-desc">The full schema package: LocalBusiness (type: RoofingContractor) with name, address (1130 S Powerline Rd, Pompano Beach FL 33069), phone, url, geo coordinates, openingHours (Mon–Fri 8–5, Sat 9–1), priceRange. Service schema for all 7 service types. AggregateRating (ratingValue: 4.8, reviewCount: 144). sameAs links to BBB, Angi, Yelp, BuildZoom, and Facebook profiles. This single schema package makes Dakoma appear in Google's local rich results and gives AI systems the entity data to recommend them by name in AI-generated answers.</p>
        <span class="fix-impact impact-aio">AIO +68 pts</span>
      </div>
    </div>

    <div class="fix-card">
      <div class="fix-number">04</div>
      <div class="fix-content">
        <p class="fix-title">Rewrite Title Tags + Meta Descriptions for All Pages</p>
        <p class="fix-desc">Homepage title proposal: "Dakoma Roofing | South Florida's #1 Roofing Contractor Since 1997 | Pompano Beach, FL." Meta description proposal: "BBB A+ rated, 4.8 stars. Dakoma Roofing serves Miami-Dade, Broward &amp; Palm Beach counties with roof repair, replacement, storm damage &amp; commercial roofing. Call (954) 826-4511." Each service page gets a targeted title ("Roof Repair Pompano Beach, FL | Dakoma Roofing," "Storm Damage Roofing Contractor South Florida") and matching meta description.</p>
        <span class="fix-impact impact-high">High Impact</span>
      </div>
    </div>

    <div class="fix-card">
      <div class="fix-number">05</div>
      <div class="fix-content">
        <p class="fix-title">Build FAQPage — Own the "How Much" and "How Long" AI Queries</p>
        <p class="fix-desc">The existing meta-keywords list already identifies the right questions: "how much does roof replacement cost in Florida," "how to fix roof leak fast," "tile roof repair south florida," "hurricane roof damage repair." These are exactly the queries AI systems answer — and right now the answers come from HomeAdvisor and Angi, not Dakoma. A dedicated FAQ page with FAQPage schema answering these questions in plain language — with South Florida context, hurricane season specifics, and Broward County pricing ranges — makes Dakoma the cited authority for every roofing question in their market.</p>
        <span class="fix-impact impact-local">Local SEO + AIO</span>
      </div>
    </div>

    <div class="fix-card">
      <div class="fix-number">06</div>
      <div class="fix-content">
        <p class="fix-title">Fix Social Media Links + Add a Real "About Joel" Page</p>
        <p class="fix-desc">All three social links (Facebook, Instagram, YouTube) currently route to internal Odoo redirect paths — not to actual social profiles. Fix to direct URLs. Additionally, Joel Bustos as President of a 29-year licensed Florida roofing company deserves an About page that names him, describes his experience, lists the certifications, shows the license number, and includes the written warranty terms. Person schema for Joel with these credentials establishes the E-E-A-T depth that differentiates Dakoma from unlicensed storm-chaser contractors — especially important after hurricane season when South Florida is flooded with out-of-state roofing companies.</p>
        <span class="fix-impact impact-high">Trust + E-E-A-T</span>
      </div>
    </div>

  </div>

</main>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div>
      <p class="footer-brand"><span>Elettro</span> Interactive</p>
      <p class="footer-contact">
        Dean Palermo, Founder &amp; Executive Producer<br>
        <a href="tel:3104086687">310.408.6687</a> &nbsp;·&nbsp; <a href="mailto:dpalermo@elettro.com">dpalermo@elettro.com</a><br>
        Davie / Plantation, FL &nbsp;·&nbsp; AIO Authority — a division of Elettro
      </p>
    </div>
    <a class="footer-cta" href="mailto:dpalermo@elettro.com?subject=Dakoma Roofing — SEO & AIO Engagement">Let's Talk →</a>
  </div>
</footer>

</body>
</html>
