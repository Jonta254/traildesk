"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="url(#td-bg2)"/>
      <path d="M5 26L12 12L17 20L22 10L29 26H5Z" fill="none" stroke="url(#td-pk2)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M22 10L19.5 16L24.5 16L22 10Z" fill="url(#td-sn2)" opacity="0.8"/>
      <circle cx="22" cy="10" r="1.5" fill="url(#td-dt2)"/>
      <defs>
        <linearGradient id="td-bg2" x1="0" y1="0" x2="34" y2="34"><stop offset="0%" stopColor="#061A10"/><stop offset="100%" stopColor="#030A08"/></linearGradient>
        <linearGradient id="td-pk2" x1="5" y1="26" x2="29" y2="10"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#60B7FF"/></linearGradient>
        <linearGradient id="td-sn2" x1="19" y1="10" x2="25" y2="16"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/><stop offset="100%" stopColor="#60B7FF" stopOpacity="0.5"/></linearGradient>
        <radialGradient id="td-dt2"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#20A876"/></radialGradient>
      </defs>
    </svg>
  );
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  planned:   { label: "Planned",   color: "#34D399", bg: "rgba(52,211,153,0.1)"  },
  done:      { label: "Completed", color: "#60B7FF", bg: "rgba(96,183,255,0.1)"  },
  draft:     { label: "Draft",     color: "#C8955C", bg: "rgba(200,149,92,0.1)"  },
  active:    { label: "Active",    color: "#FFD600", bg: "rgba(255,214,0,0.1)"   },
};

interface Trip {
  id: string;
  name: string;
  region: string;
  status: string;
  date: string;
  distance: string;
  duration: string;
  difficulty?: number;
  tags?: string[];
  notes: string;
  gear: string[];
  isDemo?: boolean;
  gpsCoords?: { lat: number; lng: number } | null;
}

const SAMPLE_TRIPS: Trip[] = [
  {
    id: "sample-1", name: "Tongariro Alpine Crossing", region: "New Zealand", status: "planned",
    date: "15 Jul 2026", distance: "23 km", duration: "8 hr", difficulty: 82,
    tags: ["Volcanic", "Day hike", "Downloaded"],
    notes: "Starting from Mangatepopo carpark. Gear packed. Emergency contact set — 4hr check-in.",
    gear: ["Rain jacket", "Micro-spikes", "2L water", "Snacks", "First aid kit"],
    isDemo: true,
  },
  {
    id: "sample-2", name: "Milford Track — Day 3 (Mackinnon Pass)", region: "New Zealand", status: "done",
    date: "22 Apr 2026", distance: "19 km", duration: "7 hr 20 min", difficulty: 70,
    tags: ["Fiordland", "Multi-day", "Archived"],
    notes: "Summit view was worth every step. Perfect conditions — clear, 12°C, no wind.",
    gear: ["Sleeping bag", "Hut pass", "Gaiters", "Trekking poles"],
    isDemo: true,
  },
  {
    id: "sample-3", name: "Laugavegur Trail — Full 4 Days", region: "Iceland", status: "draft",
    date: "Sep 2026", distance: "55 km", duration: "4 days", difficulty: 75,
    tags: ["Volcanic", "Multi-day", "International"],
    notes: "Still researching huts vs camping. Weather window critical — need flexible dates.",
    gear: [],
    isDemo: true,
  },
  {
    id: "sample-4", name: "Overland Track, Tasmania", region: "Australia", status: "planned",
    date: "Oct 2026", distance: "65 km", duration: "6 days", difficulty: 68,
    tags: ["Remote", "Multi-day", "Downloaded"],
    notes: "Booking huts through ONPS. Leave permit confirmed. Emergency beacon hired.",
    gear: ["10L waterproof bags", "Merino base layer", "Emergency beacon"],
    isDemo: true,
  },
  {
    id: "sample-5", name: "Tour du Mont Blanc — Day 1 (Chamonix → Les Contamines)", region: "France", status: "done",
    date: "Jul 2025", distance: "20 km", duration: "7 hr", difficulty: 78,
    tags: ["Alpine", "TMB", "Archived"],
    notes: "Hot and clear. Crowds at Refuge de Miage. Trail condition: excellent.",
    gear: [],
    isDemo: true,
  },
];

type Filter = "all" | "planned" | "done" | "draft";

export default function TripsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>(SAMPLE_TRIPS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("traildesk_trips");
      if (raw) {
        const parsed: Trip[] = JSON.parse(raw);
        if (parsed.length > 0) {
          // Real trips exist — show those instead of samples
          setTrips(parsed);
          return;
        }
      }
    } catch {
      // localStorage unavailable or corrupted — fall back to samples silently
    }
    // No real trips: keep sample trips
    setTrips(SAMPLE_TRIPS);
  }, []);

  const filtered = filter === "all" ? trips : trips.filter(t => t.status === filter);
  const realTripCount = trips.filter(t => !t.isDemo).length;
  const completedCount = trips.filter(t => t.status === "done").length;

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
        :root{--trail:#34D399;--sky:#60B7FF;--earth:#C8955C;--bg:#060C0A;--bg2:#0A1410;--surface:#152018;--border:rgba(255,255,255,0.07);--text:#EFF8F4;--text-dim:#8AADA0;--text-mute:#4A6B60}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1rem,4vw,2.5rem);height:60px;border-bottom:1px solid var(--border);background:rgba(6,12,10,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
        .nav-links{display:flex;align-items:center;gap:clamp(0.5rem,2vw,1.5rem)}
        .nav-link{font-size:0.82rem;color:var(--text-dim);text-decoration:none;letter-spacing:0.03em;transition:color 180ms}
        .nav-link:hover,.nav-link.active{color:var(--trail)}
        .nav-btn{background:var(--trail);color:#04120B;font-size:0.78rem;font-weight:700;padding:7px 16px;border-radius:6px;text-decoration:none;letter-spacing:0.04em;transition:filter 180ms}
        .nav-btn:hover{filter:brightness(1.1)}
        .filter-bar{display:flex;gap:8px;flex-wrap:wrap}
        .filter-btn{font-size:0.78rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.08em;padding:5px 14px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text-dim);cursor:pointer;transition:all 180ms}
        .filter-btn:hover{border-color:rgba(52,211,153,0.35);color:var(--text)}
        .filter-btn.active{background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.4);color:var(--trail)}
        .trip-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;transition:border-color 240ms,box-shadow 240ms}
        .trip-card:hover{border-color:rgba(52,211,153,0.2);box-shadow:0 4px 24px rgba(0,0,0,0.3)}
        .trip-card.expanded{border-color:rgba(52,211,153,0.3)}
        .trip-header{padding:18px 20px;cursor:pointer;display:flex;align-items:flex-start;justify-content:space-between;gap:12}
        .trip-title{font-size:1rem;font-weight:600;color:var(--text);margin-bottom:4px}
        .trip-region{font-size:0.78rem;color:var(--text-mute);font-family:'JetBrains Mono',monospace;letter-spacing:0.04em}
        .trip-meta{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center}
        .tag{font-size:0.7rem;font-family:'JetBrains Mono',monospace;padding:3px 9px;border-radius:20px;background:rgba(255,255,255,0.04);border:1px solid var(--border);color:var(--text-mute);letter-spacing:0.04em}
        .tag.demo{background:rgba(200,149,92,0.08);border-color:rgba(200,149,92,0.25);color:var(--earth)}
        .stat-chip{font-size:0.72rem;color:var(--text-dim)}
        .trip-body{padding:0 20px 20px;border-top:1px solid var(--border);margin-top:0}
        .trip-notes{font-size:0.875rem;color:var(--text-dim);line-height:1.65;margin:14px 0 12px}
        .gear-list{display:flex;flex-wrap:wrap;gap:6px}
        .gear-tag{font-size:0.72rem;font-family:'JetBrains Mono',monospace;padding:3px 10px;border-radius:4px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.18);color:var(--trail)}
        .diff-bar{height:3px;border-radius:2px;background:rgba(255,255,255,0.06);margin:4px 0}
        .diff-fill{height:100%;border-radius:2px;background:linear-gradient(to right,var(--trail),var(--sky))}
        .empty{text-align:center;padding:64px 0;color:var(--text-mute)}
        @media(max-width:600px){.nav-links a:not(.nav-btn){display:none}}
      `}</style>

      <nav className="nav">
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <Logo />
          <span style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--text)" }}>TrailDesk</span>
        </Link>
        <div className="nav-links">
          <Link href="/explore" className="nav-link">Explore</Link>
          <Link href="/trips" className="nav-link active">My Trips</Link>
          <Link href="/plan" className="nav-link">Plan a Trip</Link>
          <Link href="/gear" className="nav-link">Gear Lists</Link>
          <Link href="/plan" className="nav-btn">+ New Trip</Link>
        </div>
      </nav>

      <main style={{ maxWidth:820, margin:"0 auto", padding:"clamp(1.5rem,4vw,3rem) clamp(1rem,4vw,2rem)" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:"clamp(1.5rem,3vw,2.5rem)" }}>
          <div>
            <h1 style={{ fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700, marginBottom:4 }}>My Trips</h1>
            <p style={{ color:"var(--text-dim)", fontSize:"0.875rem" }}>
              {trips.length} trip{trips.length !== 1 ? "s" : ""} · {completedCount} completed
              {realTripCount === 0 && (
                <span style={{ color:"var(--text-mute)", marginLeft:8 }}>— showing demo trips</span>
              )}
            </p>
          </div>
          <Link href="/plan" className="nav-btn" style={{ flexShrink:0 }}>+ Plan New Trip</Link>
        </div>

        {/* Filter */}
        <div className="filter-bar" style={{ marginBottom:"clamp(1rem,2.5vw,1.75rem)" }}>
          {(["all","planned","done","draft"] as Filter[]).map(f => (
            <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : STATUS_LABELS[f].label}
            </button>
          ))}
        </div>

        {/* Trip list */}
        {filtered.length === 0 ? (
          <div className="empty">
            <p style={{ fontSize:"1.1rem", marginBottom:8 }}>No trips here yet.</p>
            <Link href="/plan" style={{ color:"var(--trail)", fontSize:"0.875rem" }}>Plan your first trip →</Link>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(trip => {
              const st = STATUS_LABELS[trip.status] ?? STATUS_LABELS["planned"];
              const isOpen = expanded === trip.id;
              return (
                <div key={trip.id} className={`trip-card${isOpen?" expanded":""}`}>
                  <div className="trip-header" onClick={() => setExpanded(isOpen ? null : trip.id)}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                        <div className="trip-title">{trip.name}</div>
                        <span style={{ fontSize:"0.7rem", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.06em", padding:"2px 9px", borderRadius:20, background:st.bg, color:st.color, flexShrink:0 }}>{st.label}</span>
                        {trip.isDemo && <span className="tag demo">Demo</span>}
                      </div>
                      <div className="trip-region">📍 {trip.region} · {trip.date}</div>
                      <div className="trip-meta">
                        {trip.distance && <span className="stat-chip">📏 {trip.distance}</span>}
                        {trip.duration && <span className="stat-chip">⏱ {trip.duration}</span>}
                        {trip.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                      {trip.difficulty != null && (
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                          <div className="diff-bar" style={{ flex:1, maxWidth:120 }}>
                            <div className="diff-fill" style={{ width:`${trip.difficulty}%` }} />
                          </div>
                          <span style={{ fontSize:"0.7rem", color:"var(--text-mute)", fontFamily:"'JetBrains Mono',monospace" }}>Difficulty {trip.difficulty}%</span>
                        </div>
                      )}
                    </div>
                    <span style={{ color:"var(--text-mute)", fontSize:"1.1rem", flexShrink:0, marginTop:4 }}>{isOpen?"▲":"▼"}</span>
                  </div>

                  {isOpen && (
                    <div className="trip-body">
                      {trip.gpsCoords && (
                        <p style={{ fontSize:"0.75rem", fontFamily:"'JetBrains Mono',monospace", color:"var(--trail)", marginTop:14, marginBottom:4, opacity:0.8 }}>
                          📍 GPS: {trip.gpsCoords.lat}, {trip.gpsCoords.lng}
                        </p>
                      )}
                      {trip.notes && <p className="trip-notes">{trip.notes}</p>}
                      {trip.gear.length > 0 && (
                        <>
                          <p style={{ fontSize:"0.72rem", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.1em", color:"var(--text-mute)", marginBottom:8 }}>GEAR PACKED</p>
                          <div className="gear-list">
                            {trip.gear.map(g => <span key={g} className="gear-tag">✓ {g}</span>)}
                          </div>
                        </>
                      )}
                      {trip.gear.length === 0 && (
                        <p style={{ fontSize:"0.82rem", color:"var(--text-mute)", marginTop:14 }}>No gear list added yet. <Link href="/gear" style={{ color:"var(--trail)" }}>Build a list →</Link></p>
                      )}
                      <div style={{ display:"flex", gap:10, marginTop:16 }}>
                        <Link href="/plan" style={{ fontSize:"0.78rem", color:"var(--trail)", border:"1px solid rgba(52,211,153,0.25)", padding:"5px 14px", borderRadius:6, textDecoration:"none" }}>Edit trip</Link>
                        {trip.status === "planned" && (
                          <a href="#" style={{ fontSize:"0.78rem", color:"#FFD600", border:"1px solid rgba(255,214,0,0.25)", padding:"5px 14px", borderRadius:6, textDecoration:"none" }}>Mark active</a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
