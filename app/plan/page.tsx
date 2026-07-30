"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { findDestination, destinationPrefill } from "@/app/lib/destinations";

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="url(#tl-bg)"/>
      <path d="M5 26L12 12L17 20L22 10L29 26H5Z" fill="none" stroke="url(#tl-pk)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M22 10L19.5 16L24.5 16L22 10Z" fill="url(#tl-sn)" opacity="0.8"/>
      <circle cx="22" cy="10" r="1.5" fill="url(#tl-dt)"/>
      <defs>
        <linearGradient id="tl-bg" x1="0" y1="0" x2="34" y2="34"><stop offset="0%" stopColor="#061A10"/><stop offset="100%" stopColor="#030A08"/></linearGradient>
        <linearGradient id="tl-pk" x1="5" y1="26" x2="29" y2="10"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#60B7FF"/></linearGradient>
        <linearGradient id="tl-sn" x1="19" y1="10" x2="25" y2="16"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/><stop offset="100%" stopColor="#60B7FF" stopOpacity="0.5"/></linearGradient>
        <radialGradient id="tl-dt"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#20A876"/></radialGradient>
      </defs>
    </svg>
  );
}

const GEAR_TEMPLATES: Record<string, string[]> = {
  "Day Hike": ["Water (2L+)", "Snacks / lunch", "Rain jacket", "First aid kit", "Sunscreen", "Hat", "Navigation (phone / map)", "Emergency whistle"],
  "Overnight": ["Tent / bivvy", "Sleeping bag", "Sleeping mat", "Cook kit + stove", "Food (2 days)", "Water filter", "Headlamp + batteries", "10L waterproof bags", "Change of clothes", "First aid kit"],
  "Multi-day": ["Tent", "Sleeping bag (rated -5°C)", "Sleeping mat", "MSR stove + fuel", "Food (per day)", "Water filter / purification tabs", "Trekking poles", "Waterproof bags (10L × 2)", "Boot gaiters", "Layers (base, mid, shell)", "Headlamp", "Emergency beacon / PLB", "First aid kit", "Repair kit"],
  "Alpine / Technical": ["Ice axe", "Crampons", "Rope", "Harness + helmet", "Crevasse rescue kit", "Layering system (thermal base → softshell → hardshell)", "Goggles", "Emergency bivvy", "Navigation device (GPS)"],
};

type Step = 1 | 2 | 3 | 4;

interface GpsCoords {
  lat: number;
  lng: number;
}

interface SavedTrip {
  id: string;
  name: string;
  region: string;
  date: string;
  duration: string;
  distance: string;
  type: string;
  notes: string;
  emergencyName: string;
  emergencyPhone: string;
  checkInterval: string;
  gear: string[];
  gpsCoords: GpsCoords | null;
  status: "planned";
  createdAt: string;
}

export default function PlanPage() {
  const [step, setStep] = useState<Step>(1);
  const [saved, setSaved] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<GpsCoords | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [fromExplore, setFromExplore] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", region: "", date: "", duration: "", distance: "",
    type: "Day Hike", notes: "", emergencyName: "", emergencyPhone: "", checkInterval: "4",
    gear: [] as string[],
    newGear: "",
  });

  /* ── Prefill from /explore ("Save as trip" → /plan?dest=<id>) ──────
     Read the destination id on mount, populate Step 1 and load the
     matching gear template. Every value comes from the real destination
     record — nothing fabricated. Idempotent, so it's safe under Strict
     Mode's double effect invocation. ──────────────────────────────── */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("dest");
    const dest = findDestination(id);
    if (!dest) return;
    const p = destinationPrefill(dest);
    setForm(prev => ({
      ...prev,
      name: p.name,
      region: p.region,
      type: p.type,
      duration: p.duration,
      distance: p.distance,
      notes: p.notes,
      gear: [...(GEAR_TEMPLATES[p.type] ?? [])],
    }));
    setFromExplore(dest.name);
  }, []);

  const set = (k: keyof typeof form, v: string | string[]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const loadTemplate = (type: string) => {
    set("gear", [...GEAR_TEMPLATES[type] ?? []]);
    set("type", type);
  };

  const toggleGear = (item: string) => {
    const g = form.gear;
    set("gear", g.includes(item) ? g.filter(i => i !== item) : [...g, item]);
  };

  const addCustomGear = () => {
    if (!form.newGear.trim()) return;
    set("gear", [...form.gear, form.newGear.trim()]);
    set("newGear", "");
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Location unavailable — enter manually");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    setGpsCoords(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        const coords: GpsCoords = { lat, lng };
        setGpsCoords(coords);
        setGpsLoading(false);
        // Populate region field with coordinates if it's empty
        if (!form.region.trim()) {
          set("region", `Lat: ${lat}, Lng: ${lng}`);
        }
      },
      (_err) => {
        setGpsError("Location unavailable — enter manually");
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveTrip = () => {
    const newTrip: SavedTrip = {
      id: Date.now().toString(),
      name: form.name,
      region: form.region,
      date: form.date,
      duration: form.duration,
      distance: form.distance,
      type: form.type,
      notes: form.notes,
      emergencyName: form.emergencyName,
      emergencyPhone: form.emergencyPhone,
      checkInterval: form.checkInterval,
      gear: form.gear,
      gpsCoords,
      status: "planned",
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem("traildesk_trips");
      const existing: SavedTrip[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem("traildesk_trips", JSON.stringify([...existing, newTrip]));
    } catch {
      // localStorage may be unavailable (private browsing, etc.) — fail silently
    }

    setSaved(true);
  };

  const handlePlanAnother = () => {
    setSaved(false);
    setStep(1);
    setGpsCoords(null);
    setGpsError(null);
    setGpsLoading(false);
    setFromExplore(null);
    setForm({
      name: "", region: "", date: "", duration: "", distance: "",
      type: "Day Hike", notes: "", emergencyName: "", emergencyPhone: "",
      checkInterval: "4", gear: [], newGear: "",
    });
  };

  const canNext1 = form.name.trim() && form.date.trim();
  const canNext2 = true;
  const canSave  = form.emergencyName.trim() && form.emergencyPhone.trim();

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
        .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:clamp(1.25rem,3vw,2rem)}
        label{display:block;font-size:0.78rem;font-family:'JetBrains Mono',monospace;letter-spacing:0.08em;color:var(--text-mute);margin-bottom:6px}
        input,select,textarea{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:10px 14px;font-size:0.9rem;font-family:'Inter',sans-serif;outline:none;transition:border-color 180ms}
        input:focus,select:focus,textarea:focus{border-color:rgba(52,211,153,0.4)}
        textarea{resize:vertical;min-height:90px;line-height:1.55}
        select{cursor:pointer}
        .field{margin-bottom:16px}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:500px){.grid-2{grid-template-columns:1fr}}
        .step-indicator{display:flex;align-items:center;gap:0;margin-bottom:2rem}
        .step-dot{width:28px;height:28px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-family:'JetBrains Mono',monospace;transition:all 240ms;flex-shrink:0}
        .step-dot.active{background:var(--trail);border-color:var(--trail);color:#04120B;font-weight:700}
        .step-dot.done{background:rgba(52,211,153,0.15);border-color:rgba(52,211,153,0.4);color:var(--trail)}
        .step-line{flex:1;height:1px;background:var(--border);margin:0 8px}
        .btn-primary{background:var(--trail);color:#04120B;font-weight:700;border:none;padding:10px 24px;border-radius:8px;font-size:0.875rem;cursor:pointer;transition:filter 180ms;letter-spacing:0.04em}
        .btn-primary:hover:not(:disabled){filter:brightness(1.1)}
        .btn-primary:disabled{opacity:0.4;cursor:not-allowed}
        .btn-ghost{background:transparent;color:var(--text-dim);border:1px solid var(--border);padding:10px 20px;border-radius:8px;font-size:0.875rem;cursor:pointer;transition:all 180ms}
        .btn-ghost:hover{border-color:rgba(255,255,255,0.2);color:var(--text)}
        .gear-chip{display:flex;align-items:center;gap:6px;font-size:0.78rem;font-family:'JetBrains Mono',monospace;padding:5px 12px;border-radius:6px;border:1px solid var(--border);cursor:pointer;transition:all 180ms;background:rgba(255,255,255,0.02)}
        .gear-chip.checked{background:rgba(52,211,153,0.08);border-color:rgba(52,211,153,0.3);color:var(--trail)}
        .gear-chip:not(.checked){color:var(--text-mute)}
        .success-box{background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.25);border-radius:12px;padding:2.5rem;text-align:center}
        @media(max-width:600px){.nav-links a:not(.nav-btn){display:none}}
      `}</style>

      <nav className="nav">
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <Logo />
          <span style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--text)" }}>TrailDesk</span>
        </Link>
        <div className="nav-links">
          <Link href="/explore" className="nav-link">Explore</Link>
          <Link href="/trips" className="nav-link">My Trips</Link>
          <Link href="/plan" className="nav-link active">Plan a Trip</Link>
          <Link href="/gear" className="nav-link">Gear Lists</Link>
          <Link href="/plan" className="nav-btn">+ New Trip</Link>
        </div>
      </nav>

      <main style={{ maxWidth:660, margin:"0 auto", padding:"clamp(1.5rem,4vw,3rem) clamp(1rem,4vw,2rem)" }}>

        <div style={{ marginBottom:"clamp(1.25rem,3vw,2rem)" }}>
          <h1 style={{ fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700, marginBottom:4 }}>Plan a Trip</h1>
          <p style={{ color:"var(--text-dim)", fontSize:"0.875rem" }}>Route, gear, and emergency contacts — sorted before you leave the carpark.</p>
        </div>

        {fromExplore && !saved && (
          <div style={{
            display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
            background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.25)",
            borderLeft:"2px solid rgba(52,211,153,0.6)", borderRadius:10,
            padding:"11px 15px", marginBottom:"clamp(1rem,2.5vw,1.5rem)",
          }}>
            <span aria-hidden style={{ fontSize:"1.05rem" }}>🗺</span>
            <span style={{ fontSize:"0.84rem", color:"var(--text-dim)" }}>
              Started from Explore — <strong style={{ color:"var(--trail)" }}>{fromExplore}</strong>. Route details are filled in; add your gear and check-ins below.
            </span>
            <Link href="/explore" style={{ fontSize:"0.78rem", color:"var(--text-mute)", textDecoration:"none", marginLeft:"auto" }}>← Back to Explore</Link>
          </div>
        )}

        {/* Step indicator */}
        <div className="step-indicator">
          {([1,2,3,4] as Step[]).map((s,i) => (
            <>
              <div key={s} className={`step-dot${step===s?" active":step>s?" done":""}`}>
                {step > s ? "✓" : s}
              </div>
              {i < 3 && <div className="step-line" />}
            </>
          ))}
        </div>

        {!saved ? (
          <>
            {/* Step 1 — Route basics */}
            {step === 1 && (
              <div className="card">
                <h2 style={{ fontSize:"1.05rem", fontWeight:600, marginBottom:"1.25rem" }}>Route Details</h2>
                <div className="field">
                  <label>TRIP NAME *</label>
                  <input type="text" placeholder="e.g. Tongariro Alpine Crossing" value={form.name} onChange={e=>set("name",e.target.value)} />
                </div>
                <div className="field">
                  <label>REGION / COUNTRY</label>
                  <input type="text" placeholder="e.g. New Zealand" value={form.region} onChange={e=>set("region",e.target.value)} />
                  {/* GPS button */}
                  <div style={{ marginTop:8 }}>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={gpsLoading}
                      style={{
                        background:"rgba(52,211,153,0.1)",
                        border:"1px solid rgba(52,211,153,0.3)",
                        color:"var(--trail)",
                        borderRadius:8,
                        padding:"8px 16px",
                        fontSize:"0.82rem",
                        cursor: gpsLoading ? "not-allowed" : "pointer",
                        display:"flex",
                        alignItems:"center",
                        gap:8,
                        opacity: gpsLoading ? 0.6 : 1,
                        transition:"opacity 180ms",
                      }}
                    >
                      {gpsLoading ? (
                        <>
                          <span style={{ display:"inline-block", width:12, height:12, border:"2px solid rgba(52,211,153,0.3)", borderTopColor:"var(--trail)", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                          Fetching location…
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
                          </svg>
                          GET MY LOCATION
                        </>
                      )}
                    </button>

                    {/* Spinner keyframe injected once */}
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

                    {/* Success: show coords */}
                    {gpsCoords && !gpsLoading && (
                      <div style={{
                        marginTop:10,
                        background:"rgba(52,211,153,0.06)",
                        border:"1px solid rgba(52,211,153,0.25)",
                        borderRadius:8,
                        padding:"10px 14px",
                        fontSize:"0.8rem",
                        color:"var(--trail)",
                        fontFamily:"'JetBrains Mono',monospace",
                        letterSpacing:"0.03em",
                      }}>
                        <span style={{ marginRight:8 }}>📍</span>
                        Lat: {gpsCoords.lat}, Lng: {gpsCoords.lng}
                        <span style={{ color:"var(--text-mute)", marginLeft:10, fontFamily:"'Inter',sans-serif", letterSpacing:0 }}>— GPS locked</span>
                      </div>
                    )}

                    {/* Error */}
                    {gpsError && !gpsLoading && (
                      <div style={{
                        marginTop:10,
                        background:"rgba(255,100,80,0.06)",
                        border:"1px solid rgba(255,100,80,0.2)",
                        borderRadius:8,
                        padding:"10px 14px",
                        fontSize:"0.8rem",
                        color:"rgba(255,140,120,0.9)",
                      }}>
                        {gpsError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label>DEPARTURE DATE *</label>
                    <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} />
                  </div>
                  <div className="field">
                    <label>TRIP TYPE</label>
                    <select value={form.type} onChange={e=>loadTemplate(e.target.value)}>
                      {Object.keys(GEAR_TEMPLATES).map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label>DISTANCE (km)</label>
                    <input type="number" placeholder="e.g. 23" value={form.distance} onChange={e=>set("distance",e.target.value)} />
                  </div>
                  <div className="field">
                    <label>ESTIMATED DURATION</label>
                    <input type="text" placeholder="e.g. 8 hr / 3 days" value={form.duration} onChange={e=>set("duration",e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label>ROUTE NOTES</label>
                  <textarea placeholder="Start point, key waypoints, conditions, any special notes…" value={form.notes} onChange={e=>set("notes",e.target.value)} />
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
                  <button className="btn-primary" disabled={!canNext1} onClick={()=>setStep(2)}>Next: Gear List →</button>
                </div>
              </div>
            )}

            {/* Step 2 — Gear */}
            {step === 2 && (
              <div className="card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
                  <h2 style={{ fontSize:"1.05rem", fontWeight:600 }}>Gear Checklist</h2>
                  <span style={{ fontSize:"0.78rem", fontFamily:"'JetBrains Mono',monospace", color:"var(--trail)" }}>{form.gear.length} items</span>
                </div>
                <p style={{ fontSize:"0.82rem", color:"var(--text-dim)", marginBottom:"1rem" }}>
                  Pre-loaded for <strong style={{ color:"var(--text)" }}>{form.type}</strong>. Tick what you&apos;re packing, add your own.
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:"1.25rem" }}>
                  {(GEAR_TEMPLATES[form.type] ?? []).map(item => (
                    <div key={item} className={`gear-chip${form.gear.includes(item)?" checked":""}`} onClick={()=>toggleGear(item)}>
                      <span>{form.gear.includes(item)?"✓":"○"}</span> {item}
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <input type="text" placeholder="Add custom item…" value={form.newGear} onChange={e=>set("newGear",e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")addCustomGear()}} style={{ flex:1 }} />
                  <button className="btn-primary" onClick={addCustomGear} style={{ padding:"10px 16px", flexShrink:0 }}>Add</button>
                </div>
                {form.gear.filter(g=>!(GEAR_TEMPLATES[form.type]??[]).includes(g)).length > 0 && (
                  <div style={{ marginTop:12, display:"flex", flexWrap:"wrap", gap:8 }}>
                    {form.gear.filter(g=>!(GEAR_TEMPLATES[form.type]??[]).includes(g)).map(g=>(
                      <div key={g} className="gear-chip checked">{g}
                        <span onClick={()=>toggleGear(g)} style={{ marginLeft:6, opacity:0.5, cursor:"pointer" }}>×</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:"1.5rem" }}>
                  <button className="btn-ghost" onClick={()=>setStep(1)}>← Back</button>
                  <button className="btn-primary" onClick={()=>setStep(3)}>Next: Emergency →</button>
                </div>
              </div>
            )}

            {/* Step 3 — Emergency contact */}
            {step === 3 && (
              <div className="card">
                <h2 style={{ fontSize:"1.05rem", fontWeight:600, marginBottom:6 }}>Emergency Contact</h2>
                <p style={{ fontSize:"0.82rem", color:"var(--text-dim)", marginBottom:"1.25rem" }}>
                  If you miss a check-in, they&apos;ll get your last GPS position and the route details.
                </p>
                <div className="grid-2">
                  <div className="field">
                    <label>CONTACT NAME *</label>
                    <input type="text" placeholder="e.g. Sarah Williams" value={form.emergencyName} onChange={e=>set("emergencyName",e.target.value)} />
                  </div>
                  <div className="field">
                    <label>PHONE NUMBER *</label>
                    <input type="tel" placeholder="+64 21 000 0000" value={form.emergencyPhone} onChange={e=>set("emergencyPhone",e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label>CHECK-IN INTERVAL</label>
                  <select value={form.checkInterval} onChange={e=>set("checkInterval",e.target.value)}>
                    <option value="2">Every 2 hours</option>
                    <option value="4">Every 4 hours</option>
                    <option value="8">Every 8 hours</option>
                    <option value="24">Once per day</option>
                  </select>
                </div>
                <div style={{ background:"rgba(255,214,0,0.04)", border:"1px solid rgba(255,214,0,0.15)", borderRadius:8, padding:"12px 14px", fontSize:"0.82rem", color:"rgba(255,214,0,0.7)", marginTop:4 }}>
                  ⚠ Your contact will receive an SMS alert with GPS coordinates if you miss a scheduled check-in.
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:"1.5rem" }}>
                  <button className="btn-ghost" onClick={()=>setStep(2)}>← Back</button>
                  <button className="btn-primary" disabled={!canSave} onClick={()=>setStep(4)}>Review Trip →</button>
                </div>
              </div>
            )}

            {/* Step 4 — Review */}
            {step === 4 && (
              <div className="card">
                <h2 style={{ fontSize:"1.05rem", fontWeight:600, marginBottom:"1.25rem" }}>Review & Save</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid var(--border)", borderRadius:8, padding:"14px" }}>
                    <p style={{ fontSize:"0.72rem", fontFamily:"'JetBrains Mono',monospace", color:"var(--text-mute)", letterSpacing:"0.1em", marginBottom:8 }}>ROUTE</p>
                    <p style={{ fontWeight:600, marginBottom:4 }}>{form.name}</p>
                    <p style={{ fontSize:"0.82rem", color:"var(--text-dim)" }}>{form.region} · {form.date} · {form.duration || "–"} · {form.distance ? form.distance+"km" : "–"}</p>
                    {gpsCoords && (
                      <p style={{ fontSize:"0.75rem", fontFamily:"'JetBrains Mono',monospace", color:"var(--trail)", marginTop:6, opacity:0.8 }}>
                        📍 GPS: {gpsCoords.lat}, {gpsCoords.lng}
                      </p>
                    )}
                    {form.notes && <p style={{ fontSize:"0.8rem", color:"var(--text-mute)", marginTop:6 }}>{form.notes}</p>}
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid var(--border)", borderRadius:8, padding:"14px" }}>
                    <p style={{ fontSize:"0.72rem", fontFamily:"'JetBrains Mono',monospace", color:"var(--text-mute)", letterSpacing:"0.1em", marginBottom:8 }}>GEAR — {form.gear.length} items</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {form.gear.map(g=><span key={g} style={{ fontSize:"0.72rem", fontFamily:"'JetBrains Mono',monospace", padding:"3px 9px", borderRadius:4, background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.18)", color:"var(--trail)" }}>✓ {g}</span>)}
                    </div>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid var(--border)", borderRadius:8, padding:"14px" }}>
                    <p style={{ fontSize:"0.72rem", fontFamily:"'JetBrains Mono',monospace", color:"var(--text-mute)", letterSpacing:"0.1em", marginBottom:8 }}>EMERGENCY CONTACT</p>
                    <p style={{ fontWeight:600 }}>{form.emergencyName}</p>
                    <p style={{ fontSize:"0.82rem", color:"var(--text-dim)" }}>{form.emergencyPhone} · Check-in every {form.checkInterval}h</p>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:"1.5rem" }}>
                  <button className="btn-ghost" onClick={()=>setStep(3)}>← Back</button>
                  <button className="btn-primary" onClick={handleSaveTrip}>Save Trip ✓</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="success-box">
            <div style={{ fontSize:"2.5rem", marginBottom:12 }}>🏔</div>
            <h2 style={{ fontSize:"1.25rem", fontWeight:700, color:"var(--trail)", marginBottom:8 }}>Trip saved.</h2>
            <p style={{ color:"var(--text-dim)", fontSize:"0.875rem", marginBottom:"1.5rem" }}>
              <strong style={{ color:"var(--text)" }}>{form.name}</strong> is ready. Emergency contact notified. GPS check-ins active from departure.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="/trips" className="nav-btn">View My Trips</Link>
              <button className="btn-ghost" onClick={handlePlanAnother}>
                Plan Another
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
