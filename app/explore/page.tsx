"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

/* ── Brand mark (shared visual identity) ─────────────── */
function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="url(#ex-bg)" />
      <path d="M5 26L12 12L17 20L22 10L29 26H5Z" fill="none" stroke="url(#ex-pk)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M22 10L19.5 16L24.5 16L22 10Z" fill="url(#ex-sn)" opacity="0.8" />
      <circle cx="22" cy="10" r="1.5" fill="url(#ex-dt)" />
      <defs>
        <linearGradient id="ex-bg" x1="0" y1="0" x2="34" y2="34"><stop offset="0%" stopColor="#061A10" /><stop offset="100%" stopColor="#030A08" /></linearGradient>
        <linearGradient id="ex-pk" x1="5" y1="26" x2="29" y2="10"><stop offset="0%" stopColor="#34D399" /><stop offset="100%" stopColor="#60B7FF" /></linearGradient>
        <linearGradient id="ex-sn" x1="19" y1="10" x2="25" y2="16"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" /><stop offset="100%" stopColor="#60B7FF" stopOpacity="0.5" /></linearGradient>
        <radialGradient id="ex-dt"><stop offset="0%" stopColor="#34D399" /><stop offset="100%" stopColor="#20A876" /></radialGradient>
      </defs>
    </svg>
  );
}

/* ── Data: real, well-known trekking destinations across Africa.
   Every entry is a genuine place. `query` is a specific, unambiguous
   string used to build official Google Maps URLs and an embedded map —
   so a user can view the location and get real directions. No invented
   places, coordinates, or statistics. ─────────────────────────────── */
type Difficulty = "Moderate" | "Hard" | "Expert";

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  type: string;
  headline: string; // key figure (elevation / length)
  duration: string;
  difficulty: Difficulty;
  bestSeason: string;
  description: string;
  query: string; // exact Google Maps search string
}

const DESTINATIONS: Destination[] = [
  {
    id: "kilimanjaro", name: "Mount Kilimanjaro", country: "Tanzania", flag: "🇹🇿",
    type: "Summit trek", headline: "5,895 m", duration: "5–9 days", difficulty: "Expert",
    bestSeason: "Jan–Mar · Jun–Oct",
    description: "Africa's highest point and the tallest free-standing mountain on Earth. The climb to Uhuru Peak is non-technical, but altitude is the real test — routes such as Machame and Marangu pass through five climate zones from rainforest to arctic summit.",
    query: "Mount Kilimanjaro, Tanzania",
  },
  {
    id: "mount-kenya", name: "Mount Kenya (Point Lenana)", country: "Kenya", flag: "🇰🇪",
    type: "Summit trek", headline: "4,985 m", duration: "4–5 days", difficulty: "Hard",
    bestSeason: "Jan–Feb · Aug–Sep",
    description: "The trekking summit Point Lenana sits at 4,985 m; the true peaks Batian and Nelion are technical rock climbs. A UNESCO World Heritage site of glaciers, tarns and Afro-alpine moorland.",
    query: "Mount Kenya National Park, Kenya",
  },
  {
    id: "table-mountain", name: "Table Mountain", country: "South Africa", flag: "🇿🇦",
    type: "Day hike", headline: "1,085 m", duration: "2–3 hr ascent", difficulty: "Moderate",
    bestSeason: "Year-round",
    description: "Cape Town's flat-topped landmark above the city. The Platteklip Gorge route is a steep, direct two-to-three-hour ascent; the cableway offers an easy descent when the wind picks up.",
    query: "Table Mountain, Cape Town, South Africa",
  },
  {
    id: "simien", name: "Simien Mountains (Ras Dashen)", country: "Ethiopia", flag: "🇪🇹",
    type: "Multi-day trek", headline: "4,543 m", duration: "4–10 days", difficulty: "Hard",
    bestSeason: "Oct–Mar",
    description: "Ethiopia's dramatic escarpment and its highest peak, Ras Dashen. Trekked with a local guide and scout, famous for troops of gelada and thousand-metre cliff edges.",
    query: "Simien Mountains National Park, Ethiopia",
  },
  {
    id: "toubkal", name: "Mount Toubkal", country: "Morocco", flag: "🇲🇦",
    type: "Summit trek", headline: "4,167 m", duration: "2 days", difficulty: "Hard",
    bestSeason: "Apr–Oct",
    description: "The highest peak in North Africa, reached from the village of Imlil in the High Atlas. A classic two-day trek via the mountain refuge; winter ascents require crampons and an ice axe.",
    query: "Mount Toubkal, Morocco",
  },
  {
    id: "drakensberg", name: "Drakensberg Amphitheatre", country: "South Africa", flag: "🇿🇦",
    type: "Day / multi-day", headline: "~3,000 m", duration: "1–2 days", difficulty: "Hard",
    bestSeason: "Mar–May · Sep–Nov",
    description: "The vast Amphitheatre escarpment and Tugela Falls, among the highest waterfalls in the world. The chain-ladder route tops out onto the summit plateau of the Northern Drakensberg.",
    query: "Amphitheatre, Drakensberg, South Africa",
  },
  {
    id: "rwenzori", name: "Rwenzori (Margherita Peak)", country: "Uganda", flag: "🇺🇬",
    type: "Expedition", headline: "5,109 m", duration: "7–9 days", difficulty: "Expert",
    bestSeason: "Jun–Aug · Dec–Feb",
    description: "The glaciated 'Mountains of the Moon' on the Uganda–DRC border. Reaching Margherita Peak is a full expedition through bog, montane rainforest and permanent ice.",
    query: "Rwenzori Mountains National Park, Uganda",
  },
  {
    id: "meru", name: "Mount Meru", country: "Tanzania", flag: "🇹🇿",
    type: "Summit trek", headline: "4,562 m", duration: "3–4 days", difficulty: "Hard",
    bestSeason: "Jun–Feb",
    description: "Tanzania's second-highest mountain and a superb acclimatisation trek before Kilimanjaro. A narrow summit ridge is walked in the dark to reach the crater rim at dawn.",
    query: "Mount Meru, Arusha, Tanzania",
  },
  {
    id: "fish-river", name: "Fish River Canyon", country: "Namibia", flag: "🇳🇦",
    type: "Multi-day trail", headline: "~85 km", duration: "4–5 days", difficulty: "Expert",
    bestSeason: "May–Sep (trail open)",
    description: "One of the largest canyons on Earth. The roughly 85 km trail is unsupported and permit-only, open in the cooler months — remote, self-sufficient desert trekking with no exit points.",
    query: "Fish River Canyon, Namibia",
  },
  {
    id: "longonot", name: "Mount Longonot", country: "Kenya", flag: "🇰🇪",
    type: "Day hike", headline: "2,776 m", duration: "4–5 hr loop", difficulty: "Moderate",
    bestSeason: "Jun–Feb",
    description: "A dormant volcano above Lake Naivasha with a full crater-rim circuit. A popular half-day loop, close to Nairobi, with panoramic views across the Great Rift Valley.",
    query: "Mount Longonot National Park, Kenya",
  },
  {
    id: "mulanje", name: "Mount Mulanje (Sapitwa)", country: "Malawi", flag: "🇲🇼",
    type: "Multi-day trek", headline: "3,002 m", duration: "2–4 days", difficulty: "Hard",
    bestSeason: "May–Oct",
    description: "The highest massif in Central Africa, rising sharply from the surrounding plains. Sapitwa Peak is reached over granite slabs, with basic mountain huts spaced along the routes.",
    query: "Mount Mulanje, Malawi",
  },
  {
    id: "hells-gate", name: "Hell's Gate National Park", country: "Kenya", flag: "🇰🇪",
    type: "Day walk / cycle", headline: "Gorges & geothermal", duration: "3–5 hr", difficulty: "Moderate",
    bestSeason: "Year-round",
    description: "One of the few Kenyan parks you can explore on foot or by bicycle, winding among red gorges, geothermal steam vents and grazing wildlife near Lake Naivasha.",
    query: "Hell's Gate National Park, Kenya",
  },
];

const DIFF_META: Record<Difficulty, { color: string; rgb: string }> = {
  Moderate: { color: "#34D399", rgb: "52,211,153" },
  Hard: { color: "#C8955C", rgb: "200,149,92" },
  Expert: { color: "#FF6B6B", rgb: "255,107,107" },
};

const DIFF_FILTERS = ["All", "Moderate", "Hard", "Expert"] as const;

function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function mapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
function mapsEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=8&output=embed`;
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [diff, setDiff] = useState<(typeof DIFF_FILTERS)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DESTINATIONS.filter((d) => {
      const matchDiff = diff === "All" || d.difficulty === diff;
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q);
      return matchDiff && matchSearch;
    });
  }, [search, diff]);

  const countries = new Set(DESTINATIONS.map((d) => d.country)).size;

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--trail:#34D399;--sky:#60B7FF;--earth:#C8955C;--bg:#060C0A;--bg2:#0A1410;--bg3:#0F1C18;--surface:#152018;--border:rgba(255,255,255,0.07);--border-trail:rgba(52,211,153,0.2);--text:#EFF8F4;--text-dim:#8AADA0;--text-mute:#4A6B60;--radius:12px;--radius-sm:8px}
        body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
        .xp-nav{display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1rem,4vw,2.5rem);height:60px;border-bottom:1px solid var(--border);background:rgba(6,12,10,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
        .xp-nav-links{display:flex;align-items:center;gap:clamp(0.5rem,2vw,1.5rem)}
        .xp-nav-link{font-size:0.82rem;color:var(--text-dim);text-decoration:none;letter-spacing:0.03em;transition:color 180ms}
        .xp-nav-link:hover,.xp-nav-link.active{color:var(--trail)}
        .xp-nav-btn{background:var(--trail);color:#04120B;font-size:0.78rem;font-weight:700;padding:7px 16px;border-radius:6px;text-decoration:none;letter-spacing:0.04em;transition:filter 180ms}
        .xp-nav-btn:hover{filter:brightness(1.1)}

        .xp-hero{position:relative;overflow:hidden;padding:clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2rem) clamp(1.5rem,4vw,2.5rem);border-bottom:1px solid var(--border)}
        .xp-hero-inner{max-width:1080px;margin:0 auto;position:relative;z-index:1}
        .xp-topo{position:absolute;inset:0;pointer-events:none;opacity:0.9;background-image:repeating-radial-gradient(ellipse 70% 55% at 30% 20%,transparent 0,transparent 30px,rgba(52,211,153,0.05) 31px,rgba(52,211,153,0.05) 32px),repeating-radial-gradient(ellipse 55% 45% at 80% 60%,transparent 0,transparent 24px,rgba(96,183,255,0.04) 25px,rgba(96,183,255,0.04) 26px)}
        .xp-kicker{display:inline-flex;align-items:center;gap:8px;font-size:0.7rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--trail);border:1px solid rgba(52,211,153,0.3);background:rgba(52,211,153,0.07);padding:5px 12px;border-radius:100px;margin-bottom:1.25rem}
        .xp-title{font-size:clamp(1.9rem,5vw,3.2rem);font-weight:900;letter-spacing:-0.03em;line-height:1.06;margin-bottom:0.9rem}
        .xp-sub{color:var(--text-dim);font-size:clamp(0.95rem,1.6vw,1.08rem);line-height:1.7;max-width:640px}
        .xp-metrics{display:flex;gap:clamp(1.25rem,4vw,2.5rem);margin-top:1.75rem;flex-wrap:wrap}
        .xp-metric-n{font-size:1.5rem;font-weight:900;color:var(--trail);letter-spacing:-0.03em;line-height:1}
        .xp-metric-l{font-size:0.72rem;color:var(--text-mute);text-transform:uppercase;letter-spacing:0.09em;margin-top:4px}

        .xp-controls{max-width:1080px;margin:0 auto;padding:clamp(1.25rem,3vw,2rem) clamp(1rem,4vw,2rem) 0;display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;justify-content:space-between}
        .xp-search-wrap{position:relative;flex:1;min-width:220px;max-width:420px}
        .xp-search{width:100%;padding:0.7rem 2.5rem 0.7rem 2.5rem;border-radius:10px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:0.9rem;outline:none;transition:border-color 180ms}
        .xp-search:focus{border-color:rgba(52,211,153,0.45)}
        .xp-search-icon{position:absolute;left:0.9rem;top:50%;transform:translateY(-50%);pointer-events:none;opacity:0.6}
        .xp-search-clear{position:absolute;right:0.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:0.85rem}
        .xp-diffs{display:flex;gap:0.4rem;flex-wrap:wrap}
        .xp-diff{font-size:0.78rem;font-weight:600;padding:6px 14px;border-radius:100px;border:1px solid var(--border);background:transparent;color:var(--text-dim);cursor:pointer;transition:all 180ms}
        .xp-diff:hover{border-color:rgba(52,211,153,0.35);color:var(--text)}
        .xp-diff.active{background:rgba(52,211,153,0.12);border-color:rgba(52,211,153,0.45);color:var(--trail)}

        .xp-grid{max-width:1080px;margin:0 auto;padding:clamp(1.25rem,3vw,2rem) clamp(1rem,4vw,2rem) 4rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:1.1rem;align-items:start}
        .xp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:border-color 220ms,box-shadow 220ms}
        .xp-card:hover{border-color:var(--border-trail);box-shadow:0 6px 30px rgba(0,0,0,0.35)}
        .xp-card.open{border-color:rgba(52,211,153,0.35)}
        .xp-card-head{width:100%;text-align:left;background:none;border:none;color:inherit;cursor:pointer;padding:1.15rem 1.25rem;display:flex;flex-direction:column;gap:0.6rem;font-family:inherit}
        .xp-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem}
        .xp-place{font-size:1.02rem;font-weight:800;line-height:1.25}
        .xp-country{font-size:0.75rem;color:var(--text-mute);font-family:'JetBrains Mono',monospace;letter-spacing:0.03em;margin-top:3px;display:flex;align-items:center;gap:6px}
        .xp-diff-badge{flex-shrink:0;font-size:0.66rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;padding:3px 9px;border-radius:100px}
        .xp-chips{display:flex;flex-wrap:wrap;gap:0.4rem}
        .xp-chip{font-size:0.72rem;font-family:'JetBrains Mono',monospace;color:var(--text-dim);background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:6px;padding:3px 9px;letter-spacing:0.02em}
        .xp-caret{font-size:0.85rem;color:var(--text-mute);align-self:center}

        .xp-body{border-top:1px solid var(--border);padding:1.1rem 1.25rem 1.25rem}
        .xp-desc{font-size:0.88rem;color:var(--text-dim);line-height:1.7;margin-bottom:1rem}
        .xp-facts{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:1rem}
        .xp-fact{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:0.55rem 0.7rem}
        .xp-fact-l{font-size:0.62rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-mute);font-family:'JetBrains Mono',monospace}
        .xp-fact-v{font-size:0.82rem;font-weight:700;color:var(--text);margin-top:2px}
        .xp-map{position:relative;width:100%;aspect-ratio:16/10;border-radius:10px;overflow:hidden;border:1px solid var(--border);background:var(--bg3);margin-bottom:0.9rem}
        .xp-map iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:grayscale(0.15) contrast(1.05)}
        .xp-actions{display:flex;gap:0.6rem;flex-wrap:wrap}
        .xp-btn{display:inline-flex;align-items:center;gap:7px;font-size:0.82rem;font-weight:700;padding:0.6rem 1.05rem;border-radius:8px;text-decoration:none;transition:transform 140ms,filter 140ms,border-color 180ms}
        .xp-btn-primary{background:var(--trail);color:#04120B}
        .xp-btn-primary:hover{filter:brightness(1.08);transform:translateY(-1px)}
        .xp-btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border-trail)}
        .xp-btn-ghost:hover{border-color:rgba(52,211,153,0.5)}

        .xp-empty{grid-column:1/-1;text-align:center;padding:4rem 1rem;color:var(--text-dim)}
        .xp-empty button{background:none;border:none;color:var(--trail);cursor:pointer;font-size:0.9rem}

        .xp-note{max-width:1080px;margin:0 auto;padding:0 clamp(1rem,4vw,2rem) 3.5rem}
        .xp-note-inner{background:var(--bg2);border:1px solid var(--border);border-left:2px solid rgba(52,211,153,0.5);border-radius:10px;padding:1rem 1.25rem;font-size:0.82rem;color:var(--text-dim);line-height:1.65}

        .xp-footer{border-top:1px solid var(--border);padding:2.5rem clamp(1rem,4vw,2rem);display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem;max-width:1080px;margin:0 auto}
        .xp-footer a{color:var(--trail);text-decoration:none;font-weight:600}

        @media(max-width:560px){
          .xp-nav-links a:not(.xp-nav-btn){display:none}
          .xp-facts{grid-template-columns:1fr}
          .xp-controls{flex-direction:column;align-items:stretch}
          .xp-search-wrap{max-width:none}
        }
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      `}</style>

      <nav className="xp-nav">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logo />
          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>TrailDesk</span>
        </Link>
        <div className="xp-nav-links">
          <Link href="/explore" className="xp-nav-link active">Explore</Link>
          <Link href="/trips" className="xp-nav-link">My Trips</Link>
          <Link href="/plan" className="xp-nav-link">Plan a Trip</Link>
          <Link href="/gear" className="xp-nav-link">Gear Lists</Link>
          <Link href="/plan" className="xp-nav-btn">+ New Trip</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="xp-hero">
        <div className="xp-topo" aria-hidden />
        <div className="xp-hero-inner">
          <span className="xp-kicker">🌍 Explore · Real destinations</span>
          <h1 className="xp-title">Africa&apos;s great treks,<br />mapped and ready.</h1>
          <p className="xp-sub">
            A starting shortlist of real, well-known trails and summits across the continent — from Kilimanjaro to the Fish River Canyon.
            Open any one on Google Maps, get turn-by-turn directions, then save it as a trip to plan gear and check-ins.
          </p>
          <div className="xp-metrics">
            <div><div className="xp-metric-n">{DESTINATIONS.length}</div><div className="xp-metric-l">Destinations</div></div>
            <div><div className="xp-metric-n">{countries}</div><div className="xp-metric-l">Countries</div></div>
            <div><div className="xp-metric-n">Live</div><div className="xp-metric-l">Google Maps</div></div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="xp-controls">
        <div className="xp-search-wrap">
          <span className="xp-search-icon" aria-hidden>🔍</span>
          <input
            className="xp-search"
            placeholder="Search a place, country, or trail type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search destinations"
          />
          {search && <button className="xp-search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>}
        </div>
        <div className="xp-diffs" role="group" aria-label="Filter by difficulty">
          {DIFF_FILTERS.map((d) => (
            <button key={d} className={`xp-diff${diff === d ? " active" : ""}`} onClick={() => setDiff(d)} aria-pressed={diff === d}>{d}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="xp-grid">
        {filtered.length === 0 ? (
          <div className="xp-empty">
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }} aria-hidden>🧭</div>
            <p style={{ fontSize: "1.05rem", marginBottom: "0.5rem", color: "var(--text)" }}>No destinations match that.</p>
            <button onClick={() => { setSearch(""); setDiff("All"); }}>Reset filters →</button>
          </div>
        ) : (
          filtered.map((d) => {
            const open = openId === d.id;
            const dm = DIFF_META[d.difficulty];
            return (
              <article key={d.id} className={`xp-card${open ? " open" : ""}`}>
                <button
                  className="xp-card-head"
                  onClick={() => setOpenId(open ? null : d.id)}
                  aria-expanded={open}
                  aria-controls={`panel-${d.id}`}
                >
                  <div className="xp-card-top">
                    <div>
                      <div className="xp-place">{d.name}</div>
                      <div className="xp-country">{d.flag} {d.country}</div>
                    </div>
                    <span className="xp-diff-badge" style={{ background: `rgba(${dm.rgb},0.14)`, color: dm.color, border: `1px solid rgba(${dm.rgb},0.35)` }}>{d.difficulty}</span>
                  </div>
                  <div className="xp-chips">
                    <span className="xp-chip">🥾 {d.type}</span>
                    <span className="xp-chip">⛰ {d.headline}</span>
                    <span className="xp-chip">⏱ {d.duration}</span>
                  </div>
                  <span className="xp-caret" aria-hidden>{open ? "▲ Close" : "▼ Explore this place"}</span>
                </button>

                {open && (
                  <div className="xp-body" id={`panel-${d.id}`}>
                    <p className="xp-desc">{d.description}</p>
                    <div className="xp-facts">
                      <div className="xp-fact"><div className="xp-fact-l">Best season</div><div className="xp-fact-v">{d.bestSeason}</div></div>
                      <div className="xp-fact"><div className="xp-fact-l">Typical duration</div><div className="xp-fact-v">{d.duration}</div></div>
                    </div>
                    <div className="xp-map">
                      <iframe
                        title={`Map of ${d.name}, ${d.country}`}
                        src={mapsEmbedUrl(d.query)}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                    <div className="xp-actions">
                      <a className="xp-btn xp-btn-primary" href={mapsDirectionsUrl(d.query)} target="_blank" rel="noopener noreferrer">
                        🧭 Get directions
                      </a>
                      <a className="xp-btn xp-btn-ghost" href={mapsSearchUrl(d.query)} target="_blank" rel="noopener noreferrer">
                        📍 Open in Google Maps
                      </a>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Honest context note */}
      <div className="xp-note">
        <div className="xp-note-inner">
          These are real, publicly known destinations, provided as planning starting points — not booked routes or guided services.
          Access rules, permits, guide requirements and conditions vary by country and season. Always confirm current information with the
          managing park authority and use offline maps once you leave signal.
        </div>
      </div>

      <footer className="xp-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={24} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-mute)" }}>TrailDesk · Built by Brian Josiah</span>
        </div>
        <a href="https://josiah-rawsignal.vercel.app" target="_blank" rel="noopener noreferrer">← Portfolio</a>
      </footer>
    </>
  );
}
