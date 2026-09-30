// Profil README görselleri: node tools/build.mjs → assets/*.svg
// Tema: kehribar fosforlu CRT terminal. Font (JetBrains Mono, OFL) SVG'ye gömülü,
// çünkü GitHub görselleri <img> olarak gösterir ve dış font yüklenmez.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p, s) => {
    if (/animation:(on|ln)/.test(s)) throw new Error("içerik gizleyen animasyon: " + p);
    mkdirSync(dirname(join(root, p)), { recursive: true });
    writeFileSync(join(root, p), s);
    console.log(p.padEnd(34), (s.length / 1024).toFixed(1), "KB");
};

const C = {
    frame: "#0A0E16",
    screenIn: "#161007",
    screenOut: "#07080C",
    amber: "#FFB000",
    hi: "#FFD166",
    text: "#FFE7B0",
    dim: "#B57F00",
    faint: "#4A3500",
    ink: "#120C02",
};

const font = (w) => readFileSync(join(root, `tools/fonts/jbm-${w}.woff2`)).toString("base64");
const fontFace = (...weights) =>
    weights.map((w) => `@font-face{font-family:J;font-weight:${w};src:url(data:font/woff2;base64,${font(w)}) format('woff2')}`).join("");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const CH = 0.6; // JetBrains Mono: her karakter 0,6 em

/** Ekran: çerçeve + sıcak radyal zemin + tarama çizgileri + yukarıdan aşağı kayan ışık bandı */
const screen = (w, h, id, band = false) => `
  <defs>
    <radialGradient id="${id}g" cx="50%" cy="45%" r="75%">
      <stop offset="0" stop-color="${C.screenIn}"/><stop offset="1" stop-color="${C.screenOut}"/>
    </radialGradient>
    <pattern id="${id}s" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1.3" fill="#000" opacity=".38"/>
    </pattern>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.amber}" stop-opacity="0"/>
      <stop offset=".5" stop-color="${C.amber}" stop-opacity=".07"/>
      <stop offset="1" stop-color="${C.amber}" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow" x="-10%" y="-40%" width="120%" height="180%">
      <feGaussianBlur stdDeviation="3.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="${id}c"><rect x="14" y="14" width="${w - 28}" height="${h - 28}" rx="16"/></clipPath>
  </defs>
  <rect width="${w}" height="${h}" rx="22" fill="${C.frame}"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" rx="16" fill="url(#${id}g)"/>
  <g clip-path="url(#${id}c)">
    ${band ? `<rect class="band" x="0" y="-160" width="${w}" height="160" fill="url(#${id}b)"/>` : ""}
  </g>`;

const overlay = (w, h, id) => `
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" rx="16" fill="url(#${id}s)" pointer-events="none"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" rx="16" fill="none" stroke="${C.amber}" stroke-width="2.5" filter="url(#glow)"/>`;

const brackets = (x0, y0, x1, y1, a = 34) => {
    const p = (x, y, dx, dy) => `M${x + dx * a} ${y}H${x}V${y + dy * a}`;
    return `<path d="${p(x0, y0, 1, 1)} ${p(x1, y0, -1, 1)} ${p(x0, y1, 1, -1)} ${p(x1, y1, -1, -1)}" fill="none" stroke="${C.amber}" stroke-width="3.5" stroke-linecap="square" filter="url(#glow)"/>`;
};

const baseCss = (h) => `
    text{font-family:J,'JetBrains Mono',Consolas,monospace}
    .band{animation:band 7s linear infinite}
    @keyframes band{from{transform:translateY(0)}to{transform:translateY(${h + 160}px)}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important}}
    .cur{animation:blink 1.05s steps(1) infinite}
    @keyframes blink{50%{opacity:0}}`;

// ─────────────────────────── banner ───────────────────────────
{
    const w = 1280, h = 360;
    const t = (y, size, weight, fill, ls, str, extra = "") =>
        `<text x="${w / 2}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="${weight}" fill="${fill}" letter-spacing="${ls}" ${extra}>${str}</text>`;
    out(
        "assets/banner.svg",
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="İbrahim Melikşah Köse — Co-founder at MelberLabs, software engineer">
  <style>${fontFace(400, 700, 800)}${baseCss(h)}</style>
  ${screen(w, h, "a", true)}
  <g class="on">
    ${brackets(52, 52, w - 52, h - 52)}
    ${t(98, 17, 400, C.dim, 6, "MELBERLABS  ·  INDEPENDENT PRODUCT STUDIO  ·  TÜRKİYE")}
    ${t(184, 64, 800, C.amber, 6, "İBRAHİM MELİKŞAH KÖSE", 'filter="url(#glow)"')}
    <line x1="330" y1="214" x2="${w - 330}" y2="214" stroke="${C.dim}" stroke-width="1.5"/>
    ${t(262, 25, 700, C.hi, 4, "CO-FOUNDER @ MELBERLABS  ·  SOFTWARE ENGINEER", 'filter="url(#glow)"')}
    ${t(310, 17, 400, C.dim, 3, `&gt; SOFTWARE ENGINEERING @ IŞIK UNIVERSITY  ·  LB #45 @ IŞIK CHARGERS <tspan class="cur" fill="${C.amber}">█</tspan>`)}
  </g>
  ${overlay(w, h, "a")}
</svg>`,
    );
}

// ─────────────────────────── projeler (terminal + kartlar ortak veri) ───────────────────────────
const projects = [
    {
        id: "ocupy", name: "OCUPY", status: "SHIPPING", url: "https://ocupyapp.melberlabs.com",
        term: "territory game: close a loop, own the ground",
        desc: ["Run or ride a loop and close it; the", "ground inside becomes yours."],
        stack: "Expo · FastAPI · PostGIS",
    },
    {
        id: "manastra", name: "MANASTRA", status: "SHIPPING", url: "https://manastra.melberlabs.com",
        term: "affirmations + AI companion, 90-sec ritual",
        desc: ["Affirmations shaped around your life,", "plus an AI companion you can talk to."],
        stack: "Expo · Node.js · LLM",
    },
    {
        id: "nightbook", name: "NIGHTBOOK", status: "SHIPPING", url: "https://nightbook.melberlabs.com",
        term: "dream journal + dream map, on-device",
        desc: ["Write dreams while they're fresh and", "watch your dream map take shape."],
        stack: "Expo · on-device · private",
    },
    {
        id: "glowmate", name: "GLOWMATE", status: "SHIPPING", url: "https://glowmate.melberlabs.com",
        term: "AI skincare: INCI label -> compatibility",
        desc: ["Scan an ingredient label, get a skin", "compatibility score + conflict alerts."],
        stack: "Expo · OCR · AI",
    },
    {
        id: "sideline", name: "SIDELINE", status: "LIVE", url: "https://chargers.melberlabs.com",
        term: "Işık Chargers team platform, 11v11 plays",
        desc: ["Team OS for Işık Chargers: animated", "11v11 playbook, film room, attendance."],
        stack: "Next.js · Postgres · Docker",
    },
    {
        id: "silua", name: "SILUA", status: "BUILDING",
        term: "AI virtual try-on",
        desc: ["AI virtual try-on: see an outfit on", "you before you buy it."],
        stack: "Expo · FastAPI · Python",
    },
    {
        id: "teneffus", name: "TENEFFÜS", status: "BUILDING",
        term: "LGS exam prep for 8th graders",
        desc: ["Prep for Türkiye's LGS exam: practice,", "progress tracking and study plans."],
        stack: "Expo · Supabase",
    },
    {
        id: "astrio", name: "ASTRIO", status: "BUILDING",
        term: "AR night-sky guide",
        desc: ["Point your phone at the night sky:", "stars, planets, constellations in AR."],
        stack: "Expo · AR · TypeScript",
    },
];
const pill = { LIVE: "   LIVE   ", SHIPPING: " SHIPPING ", BUILDING: " BUILDING ", FIELD: " ON FIELD " };

// ─────────────────────────── terminal ───────────────────────────
{
    const fs = 18, cw = fs * CH, x0 = 92, lh = 31;
    const cols = 96;
    const hdr = "  MELBERLABS · FIELD OPS · SYSTEM STATUS";
    const row = (name, info, status) => {
        const left = `  > ${name.padEnd(11, " ")} ${info} `;
        const right = ` [${status}]`;
        return left + ".".repeat(Math.max(3, cols - left.length - right.length)) + right;
    };
    const lines = [
        { s: hdr + "2026.09".padStart(cols - hdr.length), c: C.hi, wt: 700 },
        { s: "  " + "─".repeat(cols - 2), c: C.faint },
        ...projects.map((p) => ({ s: row(p.id === "teneffus" ? "teneffüs" : p.id, p.term, pill[p.status]), status: p.status })),
        { s: row("linebacker", "#45 · Işık Chargers defense", pill.FIELD), status: "FIELD" },
        { s: "" },
        { s: "  8 products · 2 founders · 12 languages · shipping weekly", c: C.dim },
    ];
    const cmd = "./status --all";
    const top = 104;
    const h = top + 58 + lines.length * lh + 70, w = 1280;
    const start = 1.6; // komut yazıldıktan sonra satırlar
    const typed = cmd.split("").map((ch, i) => `<tspan class="ln" style="animation-delay:${(0.5 + i * 0.065).toFixed(2)}s">${esc(ch)}</tspan>`).join("");

    const body = lines
        .map((l, i) => {
            const y = top + 58 + i * lh;
            const delay = (start + i * 0.22).toFixed(2);
            let s = esc(l.s);
            if (l.status) {
                // durum köşeli parantezi ayrı renk
                const k = s.lastIndexOf("[");
                const hot = l.status === "LIVE" || l.status === "FIELD";
                s = `${s.slice(0, k)}<tspan fill="${hot ? C.amber : l.status === "SHIPPING" ? C.hi : C.dim}" font-weight="700"${hot ? ' filter="url(#glow)"' : ""}>${s.slice(k)}</tspan>`;
                s = s.replace(/^( {2}&gt; )(\S+)/, `$1<tspan fill="${C.amber}" font-weight="700">$2</tspan>`);
            }
            return `<text class="ln" style="animation-delay:${delay}s" x="${x0}" y="${y}" font-size="${fs}" fill="${l.c ?? C.text}" font-weight="${l.wt ?? 400}" xml:space="preserve">${s}</text>`;
        })
        .join("\n    ");
    const endY = top + 58 + lines.length * lh + 18;
    const endDelay = (start + lines.length * 0.22 + 0.2).toFixed(2);

    out(
        "assets/terminal.svg",
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="System status: Ocupy, Manastra, Nightbook and GlowMate shipping; Sideline live; Silua, Teneffüs and Astrio in development">
  <style>${fontFace(400, 700)}${baseCss(h)}
  </style>
  ${screen(w, h, "t")}
  <g class="on">
    <text x="${x0}" y="62" font-size="14" fill="${C.dim}" letter-spacing="5">MELBERLABS FIELD-OPS TERMINAL</text>
    <text x="${w - x0}" y="62" font-size="14" fill="${C.dim}" letter-spacing="5" text-anchor="end">SESSION: GUEST  <tspan fill="${C.amber}" class="cur">●</tspan></text>
    <line x1="${x0}" y1="78" x2="${w - x0}" y2="78" stroke="${C.faint}" stroke-width="1.5"/>
    <text x="${x0}" y="${top}" font-size="${fs}" fill="${C.amber}" font-weight="700" xml:space="preserve">guest@melberlabs:~$ </text>
    <text x="${x0 + 20 * cw}" y="${top}" font-size="${fs}" fill="${C.text}" xml:space="preserve">${typed}</text>
    ${body}
    <text class="ln" style="animation-delay:${endDelay}s" x="${x0}" y="${endY}" font-size="${fs}" fill="${C.amber}" font-weight="700" filter="url(#glow)" xml:space="preserve">  WELCOME, VISITOR. ACCESS GRANTED. <tspan class="cur">█</tspan></text>
  </g>
  ${overlay(w, h, "t")}
</svg>`,
    );
}

// ─────────────────────────── proje kartları ───────────────────────────
for (const p of projects) {
    const w = 560, h = 230;
    if ((p.stack.length + (p.url ? p.url.length - 8 + 2 : 11)) * 14 * CH > w - 88 - 24) throw new Error("kart dar: " + p.id);
    for (const d of p.desc) if (d.length * 19 * CH > w - 88) throw new Error("açıklama uzun: " + p.id + " " + d);
    const hot = p.status === "LIVE";
    const label = p.status === "BUILDING" ? "IN DEVELOPMENT" : p.status;
    const pw = label.length * 13 * CH + 13 * 0.12 * label.length + 34 + (hot ? 16 : 0);
    const px = w - 44 - pw;
    const domain = p.url ? p.url.replace("https://", "") + " ↗" : "coming soon";
    out(
        `assets/cards/${p.id}.svg`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${p.name}: ${esc(p.desc.join(" "))}">
  <style>${fontFace(400, 800)}${baseCss(h)}
  </style>
  ${screen(w, h, "c")}
  <text x="44" y="78" font-size="30" font-weight="800" fill="${C.amber}" letter-spacing="2" filter="url(#glow)">▸ ${p.name}</text>
  <rect x="${px}" y="50" width="${pw}" height="34" rx="5" fill="${hot ? C.amber : "none"}" stroke="${p.status === "BUILDING" ? C.dim : C.amber}" stroke-width="1.8"/>
  ${hot ? `<circle cx="${px + 18}" cy="67" r="5" fill="${C.ink}"/>` : ""}
  <text x="${px + pw / 2 + (hot ? 8 : 0)}" y="72.5" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="1.5" fill="${hot ? C.ink : p.status === "BUILDING" ? C.dim : C.amber}">${label}</text>
  <text x="44" y="124" font-size="19" fill="${C.text}">${esc(p.desc[0])}</text>
  <text x="44" y="152" font-size="19" fill="${C.text}">${esc(p.desc[1])}</text>
  <line x1="44" y1="174" x2="${w - 44}" y2="166" stroke="${C.faint}" stroke-width="1.2"/>
  <text x="44" y="201" font-size="14" fill="${C.dim}">${esc(p.stack)}</text>
  <text x="${w - 44}" y="201" font-size="14" fill="${p.url ? C.amber : C.dim}" text-anchor="end">${esc(domain)}</text>
  ${overlay(w, h, "c")}
</svg>`,
    );
}

// ─────────────────────────── bölüm başlıkları ───────────────────────────
for (const [id, title] of [
    ["projects", "PROJECTS"],
    ["stack", "STACK"],
    ["activity", "ACTIVITY"],
    ["contact", "CONTACT"],
]) {
    const w = 1280, h = 56;
    const tw = (title.length + 4) * 22 * CH + (title.length + 4) * 6;
    out(
        `assets/h-${id}.svg`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
  <style>${fontFace(800)}text{font-family:J,monospace}</style>
  <text x="0" y="37" font-size="22" font-weight="800" fill="${C.dim}" letter-spacing="6">//<tspan fill="${C.amber}"> ${title}</tspan></text>
  <line x1="${tw + 10}" y1="29" x2="${w}" y2="29" stroke="${C.dim}" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>
</svg>`,
    );
}

// ─────────────────────────── teknoloji şeridi ───────────────────────────
{
    const groups = [
        ["MOBILE", ["React Native", "Expo", "TypeScript", "iOS", "Android"]],
        ["WEB", ["Next.js", "React", "Node.js", "Tailwind"]],
        ["BACKEND", ["Python", "FastAPI", "PostgreSQL", "PostGIS", "Supabase"]],
        ["OPS · AI", ["Docker", "GitHub Actions", "LLM APIs", "Java"]],
    ];
    const w = 1280, fs = 20, rowH = 64, h = 44 + groups.length * rowH + 20;
    let rows = "";
    groups.forEach(([g, items], i) => {
        const y = 44 + i * rowH;
        rows += `<text x="56" y="${y + 29}" font-size="16" font-weight="800" letter-spacing="3" fill="${C.dim}">${g}</text>`;
        let x = 250;
        for (const it of items) {
            const cw = it.length * fs * CH + 36;
            rows += `<rect x="${x}" y="${y}" width="${cw}" height="44" rx="7" fill="${C.ink}" stroke="${C.amber}" stroke-opacity=".75" stroke-width="1.5"/>`;
            rows += `<text x="${x + cw / 2}" y="${y + 29}" text-anchor="middle" font-size="${fs}" fill="${C.text}">${esc(it)}</text>`;
            x += cw + 14;
        }
    });
    out(
        "assets/stack.svg",
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Stack: React Native, Expo, TypeScript, Next.js, React, Node.js, Python, FastAPI, PostgreSQL, PostGIS, Supabase, Docker, Java">
  <style>${fontFace(400, 800)}${baseCss(h)}</style>
  ${screen(w, h, "s")}
  ${rows}
  ${overlay(w, h, "s")}
</svg>`,
    );
}
