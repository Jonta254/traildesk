"use client";
import { useEffect, useRef, useState } from "react";

function TrailDeskLogo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="url(#td-bg)"/>
      {/* Mountain peaks */}
      <path d="M5 26L12 12L17 20L22 10L29 26H5Z" fill="none" stroke="url(#td-peak)" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Snow cap */}
      <path d="M22 10L19.5 16L24.5 16L22 10Z" fill="url(#td-snow)" opacity="0.8"/>
      {/* Compass point */}
      <circle cx="22" cy="10" r="1.5" fill="url(#td-dot)"/>
      <defs>
        <linearGradient id="td-bg" x1="0" y1="0" x2="34" y2="34">
          <stop offset="0%" stopColor="#061A10"/><stop offset="100%" stopColor="#030A08"/>
        </linearGradient>
        <linearGradient id="td-peak" x1="5" y1="26" x2="29" y2="10">
          <stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#60B7FF"/>
        </linearGradient>
        <linearGradient id="td-snow" x1="19" y1="10" x2="25" y2="16">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/><stop offset="100%" stopColor="#60B7FF" stopOpacity="0.5"/>
        </linearGradient>
        <radialGradient id="td-dot">
          <stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#20A876"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

const FEATURES = [
  { icon:"🗺️", color:"rgba(52,211,153,0.12)", title:"Offline-First Maps", desc:"Download topo maps before you leave. Routes, waypoints, and terrain data cached locally — no signal required. Works on Milford, Tongariro, or a ridge in the middle of nowhere." },
  { icon:"🎒", color:"rgba(96,183,255,0.1)", title:"Smart Gear Checklists", desc:"Build reusable packing lists by trip type: day hike, overnight, multi-day technical. Check off as you pack. Get a reminder if something critical is unchecked at departure time." },
  { icon:"🆘", color:"rgba(200,149,92,0.12)", title:"Emergency Contacts", desc:"Set a contact with your planned route and check-in schedule. If you don't check in at a waypoint, they get an alert with your last known GPS point." },
  { icon:"📷", color:"rgba(52,211,153,0.08)", title:"Trip Archive", desc:"Log every trip with notes, photos, GPX tracks, and conditions. Build your own personal atlas — useful before you repeat a route and vital if search and rescue ever needs it." },
  { icon:"🌤️", color:"rgba(96,183,255,0.12)", title:"Conditions Sync", desc:"Pull weather forecasts for your planned departure points before you go offline. Compare conditions against your route and see automatically flagged hazards." },
  { icon:"🔋", color:"rgba(200,149,92,0.1)", title:"All-Day Battery", desc:"Built from the ground up for efficiency. Minimal background processes, smart GPS polling, and a low-power navigation mode that lasts your whole descent." },
  { icon:"🧭", color:"rgba(52,211,153,0.1)", title:"GPX Import & Export", desc:"Import routes from Strava, Garmin, Alltrails, or any GPX source. Export your recorded tracks to share or submit to SAR teams if needed." },
  { icon:"👥", color:"rgba(96,183,255,0.08)", title:"Group Trip Sharing", desc:"Share your trip plan with everyone in your group. Each person gets offline access to the route, emergency contacts, and gear list without needing to rebuild it." },
];

const TRIPS = [
  { name:"Tongariro Alpine Crossing", region:"New Zealand", tags:["Downloaded","8hr","Volcanic","23km"], cond:{ difficulty:82, exposure:65, water:90 }, status:"planned", date:"Planned: 15 Jul" },
  { name:"Milford Track — Day 3 (Mackinnon Pass)", region:"New Zealand", tags:["Archived","19km","Fiordland"], cond:{ difficulty:70, exposure:55, water:95 }, status:"done", date:"Completed: 22 Apr" },
  { name:"Laugavegur Trail, Iceland", region:"Iceland", tags:["Draft","4 days","Volcanic","55km"], cond:{ difficulty:75, exposure:80, water:85 }, status:"draft", date:"Saved for later" },
  { name:"Overland Track, Tasmania", region:"Australia", tags:["Downloaded","65km","6 days","Remote"], cond:{ difficulty:68, exposure:72, water:88 }, status:"planned", date:"Planned: Sep 2025" },
  { name:"Tour du Mont Blanc — Day 1", region:"France/Italy/Switzerland", tags:["Archived","20km","Alpine"], cond:{ difficulty:78, exposure:88, water:70 }, status:"done", date:"Completed: Jul 2024" },
];

// Real, well-known destinations surfaced on the /explore page.
const EXPLORE_TEASER = [
  "🇹🇿 Kilimanjaro", "🇰🇪 Mount Kenya", "🇿🇦 Table Mountain", "🇲🇦 Toubkal",
  "🇳🇦 Fish River Canyon", "🇺🇬 Rwenzori", "🇪🇹 Simien Mountains", "🇲🇼 Mount Mulanje",
];

// Design principles, stated honestly — not measured usage metrics.
const STATS = [
  { num:"Offline", label:"First — no signal needed" },
  { num:"GPS", label:"On every check-in" },
  { num:"SOS", label:"Escalating alert chain" },
  { num:"Free", label:"To start planning" },
];

export default function TrailDeskPage() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const statusColor = (s: string) => s === "done" ? "var(--trail)" : s === "planned" ? "var(--sky)" : "var(--earth)";

  return (
    <>
      <nav className="nav">
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <TrailDeskLogo size={34} />
          <span className="nav-name">TrailDesk</span>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:"clamp(0.75rem,2vw,1.5rem)" }}>
          <a href="/explore" style={{ fontSize:"0.82rem", color:"rgba(239,248,244,0.5)", textDecoration:"none", letterSpacing:"0.03em" }}>Explore</a>
          <a href="/trips" style={{ fontSize:"0.82rem", color:"rgba(239,248,244,0.5)", textDecoration:"none", letterSpacing:"0.03em" }}>My Trips</a>
          <a href="/plan" style={{ fontSize:"0.82rem", color:"rgba(239,248,244,0.5)", textDecoration:"none", letterSpacing:"0.03em" }}>Plan</a>
          <a href="/gear" style={{ fontSize:"0.82rem", color:"rgba(239,248,244,0.5)", textDecoration:"none", letterSpacing:"0.03em" }}>Gear</a>
          <a href="/plan" className="nav-cta">Start Planning →</a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero topo-bg">
        <div className="hero-glow" />
        {/* Topographic overlay lines */}
        <div aria-hidden style={{ position:"absolute", inset:0, backgroundImage:"repeating-radial-gradient(ellipse 100% 60% at 50% 105%, transparent 0, transparent 35px, rgba(52,211,153,0.04) 36px, rgba(52,211,153,0.04) 37px)", pointerEvents:"none" }} />

        <div className="hero-badge">
          <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"var(--trail)", animation:"pulse 2s ease-in-out infinite" }} />
          Offline-first · Works anywhere · No signal needed
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        </div>

        <h1 className="hero-title">
          Trip planning that works<br />when your <span className="accent">signal&nbsp;doesn&apos;t.</span>
        </h1>

        <p className="hero-sub">
          Offline route mapping, smart gear checklists, emergency contacts, and trip archives — built for people who take going outside seriously enough to actually prepare for it.
        </p>

        <div className="hero-actions">
          <a href="/explore" className="btn-primary">Explore destinations →</a>
          <a href="#waitlist" className="btn-ghost">Join the waitlist</a>
        </div>

        {/* Stats strip */}
        <div className="trail-stat-strip reveal" ref={addReveal} style={{ maxWidth:700, width:"100%", background:"rgba(6,12,10,0.8)" }}>
          {STATS.map((s) => (
            <div key={s.label} className="trail-stat-item">
              <div className="trail-stat-num">{s.num}</div>
              <div className="trail-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" className="section">
        <p className="section-label reveal" ref={addReveal}>Features</p>
        <h2 className="section-title reveal" ref={addReveal}>Prepared before you leave.<br />Safe while you&apos;re out there.</h2>
        <p className="section-sub reveal" ref={addReveal}>Every feature is built around the assumption that you will lose signal — because you will.</p>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card-v2 reveal" ref={addReveal} style={{ transitionDelay:`${i * 0.06}s` }}>
              <div className="feature-icon" style={{ background:f.color, border:`1px solid ${f.color.replace("0.1","0.3").replace("0.12","0.3").replace("0.08","0.2")}` }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="topo-rule" />

      {/* ── TRIP DEMO ────────────────────────────────────────── */}
      <div style={{ background:"var(--bg2)", padding:"5rem 1.5rem", borderTop:"1px solid var(--border)" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <p className="section-label reveal" ref={addReveal}>Your trips</p>
          <h2 className="section-title reveal" ref={addReveal}>Plan. Prepare. Archive.</h2>
          <p className="section-sub reveal" ref={addReveal}>Planned routes, completed archives, and saved drafts — all accessible offline, always.</p>

          {TRIPS.map((trip, i) => (
            <div key={i} className="conditions-card reveal" ref={addReveal} style={{ transitionDelay:`${i*0.07}s` }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:"0.875rem", flexWrap:"wrap" }}>
                <div>
                  <div className="trip-name">{trip.name}</div>
                  <div style={{ fontSize:"0.78rem", color:"var(--text-mute)", marginTop:3 }}>📍 {trip.region}</div>
                </div>
                <span style={{ padding:"3px 10px", borderRadius:100, fontSize:"0.7rem", fontWeight:700, background:`rgba(${statusColor(trip.status)==="var(--trail)"?"52,211,153":statusColor(trip.status)==="var(--sky)"?"96,183,255":"200,149,92"},0.12)`, color:statusColor(trip.status), border:`1px solid ${statusColor(trip.status)}44`, flexShrink:0, textTransform:"capitalize" }}>
                  {trip.status}
                </span>
              </div>
              <div className="trip-meta" style={{ marginBottom:"1rem" }}>
                {trip.tags.map((t) => <span key={t} className="trip-tag">{t}</span>)}
                <span style={{ fontSize:"0.75rem", color:"var(--text-mute)", alignSelf:"center" }}>{trip.date}</span>
              </div>
              {/* Conditions bars */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  { label:"Difficulty", val:trip.cond.difficulty, color:"var(--earth)" },
                  { label:"Exposure",   val:trip.cond.exposure,   color:"var(--sky)" },
                  { label:"Water",      val:trip.cond.water,       color:"var(--trail)" },
                ].map((bar) => (
                  <div key={bar.label} className="condition-row" style={{ marginBottom:0 }}>
                    <span className="condition-label">{bar.label}</span>
                    <div className="condition-bar">
                      <div className="condition-fill" style={{ width:`${bar.val}%`, background:bar.color, opacity:0.75 }} />
                    </div>
                    <span style={{ fontSize:"0.7rem", fontFamily:"monospace", color:"var(--text-mute)", width:28, textAlign:"right" }}>{bar.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="section">
        <p className="section-label reveal" ref={addReveal}>How it works</p>
        <h2 className="section-title reveal" ref={addReveal}>Three steps before the trailhead.</h2>
        <div className="steps">
          {[
            { num:"01", icon:"🗺️", title:"Plan your route", desc:"Search or draw your route. Add waypoints, campsites, estimated times, and elevation profiles. Connect to AllTrails or import any GPX file." },
            { num:"02", icon:"📦", title:"Prepare offline", desc:"Download maps for your area. Build your gear checklist from templates. Set your emergency contact's schedule and share your full route plan before you leave." },
            { num:"03", icon:"🏔️", title:"Go — without worry", desc:"Navigate with cached offline maps. Log notes and photos at waypoints. Check in on schedule. Your contact sees your progress in real time." },
          ].map((step, i) => (
            <div key={i} className="step reveal" ref={addReveal} style={{ transitionDelay:`${i * 0.1}s` }}>
              <div className="step-num">{step.num}</div>
              <div style={{ fontSize:"1.5rem", marginBottom:"0.75rem" }}>{step.icon}</div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="topo-rule" />

      {/* ── EXPLORE TEASER ──────────────────────────────────── */}
      <div style={{ background:"var(--bg2)", padding:"5rem 1.5rem", borderTop:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", textAlign:"center" }}>
          <p className="section-label reveal" style={{ textAlign:"center", justifyContent:"center" }}>Explore</p>
          <h2 className="section-title reveal" style={{ textAlign:"center", marginBottom:"1rem" }}>Real trails, mapped and ready.</h2>
          <p className="section-sub reveal" style={{ margin:"0 auto 2.5rem", textAlign:"center" }}>
            Start from well-known routes across Africa. Open any one on Google Maps, get directions, then save it as a trip to plan your gear and check-ins.
          </p>
          <div className="reveal" style={{ display:"flex", flexWrap:"wrap", gap:"0.6rem", justifyContent:"center", marginBottom:"2.25rem" }}>
            {EXPLORE_TEASER.map((t) => (
              <span key={t} style={{ fontSize:"0.85rem", fontWeight:600, color:"var(--text)", background:"var(--surface)", border:"1px solid var(--border-trail)", borderRadius:"100px", padding:"7px 15px" }}>{t}</span>
            ))}
          </div>
          <a href="/explore" className="btn-primary reveal">Explore all destinations →</a>
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <div style={{ background:"var(--bg)", padding:"5rem 1.5rem", borderTop:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p className="section-label reveal" ref={addReveal}>Pricing</p>
          <h2 className="section-title reveal" ref={addReveal}>Simple. No surprises.</h2>
          <p className="section-sub reveal" ref={addReveal}>Pay for what you use. Free for occasional hikers, Explorer for regulars, Expedition for guides and professionals.</p>
          <div className="price-grid">
            {[
              { tier:"Free", amount:"$0", period:"", desc:"For day trips and occasional use.", features:["3 saved trips","Basic gear checklists","1 emergency contact","Manual GPX import","7-day trip archive"], featured:false },
              { tier:"Explorer", amount:"$6", period:"/mo", desc:"For people who go out every month.", features:["Unlimited saved trips","Offline map downloads (10 regions)","Smart gear checklists by trip type","Emergency check-in schedule","Weather forecast sync","Trip archive with photos & GPX","Condition logs for each route"], featured:true },
              { tier:"Expedition", amount:"$12", period:"/mo", desc:"For guides, instructors, and serious adventurers.", features:["Everything in Explorer","Unlimited offline regions","Group trip sharing (10 people)","Satellite messenger integration","GPX/KML export for SAR","Priority route updates","Custom emergency protocols"], featured:false },
            ].map((p, i) => (
              <div key={i} className={`price-card reveal ${p.featured?"featured":""}`} ref={addReveal} style={{ transitionDelay:`${i * 0.08}s` }}>
                {p.featured && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,var(--trail),transparent)" }} />}
                <div className="price-tier">{p.tier}</div>
                <div className="price-amount">{p.amount}<span>{p.period}</span></div>
                <div className="price-desc">{p.desc}</div>
                <ul className="price-features">
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <a href="#waitlist" className={p.featured?"btn-primary":"btn-ghost"} style={{ width:"100%", justifyContent:"center", display:"flex" }}>
                  {p.featured ? "Get Early Access →" : "Join Waitlist"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WAITLIST ─────────────────────────────────────────── */}
      <section id="waitlist" style={{ padding:"5rem 1.5rem", background:"var(--bg2)", borderTop:"1px solid var(--border)" }}>
        <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>🏔</div>
          <p className="section-label" style={{ justifyContent:"center", display:"flex" }}>Early Access</p>
          <h2 className="section-title" style={{ textAlign:"center" }}>Be first when we launch.</h2>
          <p className="section-sub" style={{ margin:"0 auto 2rem", textAlign:"center" }}>
            Early access members get 3 months of Explorer free and direct input on features before we ship them. No spam. One email when we launch.
          </p>
          {submitted ? (
            <div style={{ padding:"2rem", background:"rgba(52,211,153,0.1)", borderRadius:"var(--radius)", border:"1px solid rgba(52,211,153,0.3)", color:"var(--trail)", fontWeight:700, fontSize:"1.05rem" }}>
              ✓ You&apos;re on the list. We&apos;ll let you know when it&apos;s ready.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", justifyContent:"center" }}>
              <input
                type="email" required placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex:"1 1 260px", padding:"0.875rem 1.25rem", borderRadius:"var(--radius-sm)", background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:"0.95rem", outline:"none" }}
              />
              <button type="submit" className="btn-primary">Get Early Access →</button>
            </form>
          )}
        </div>
      </section>

      <footer style={{ borderTop:"1px solid var(--border)" }}>
        <div className="footer">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <TrailDeskLogo size={24} />
            <span className="footer-copy">TrailDesk · Built by Brian Josiah</span>
          </div>
          <a href="https://josiah-rawsignal.vercel.app" target="_blank" rel="noopener" className="footer-link">← Portfolio</a>
        </div>
      </footer>
    </>
  );
}
