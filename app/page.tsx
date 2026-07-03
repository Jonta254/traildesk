"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FEATURES = [
  { icon: "🗺️", color: "rgba(52,211,153,0.12)", title: "Offline-First Maps", desc: "Download topo maps before you leave. Routes, waypoints, and terrain data are available without signal — cached locally on your device." },
  { icon: "🎒", color: "rgba(96,183,255,0.1)", title: "Smart Gear Checklists", desc: "Build reusable packing lists by trip type. Check items off as you pack. Never leave a first aid kit behind because you forgot to check." },
  { icon: "🆘", color: "rgba(200,149,92,0.12)", title: "Emergency Contacts", desc: "Set a contact who gets your planned route and a check-in schedule. If you don't check in, they get an alert. Simple, but it might save your life." },
  { icon: "📷", color: "rgba(52,211,153,0.08)", title: "Trail Archive", desc: "Log every trip with notes, photos, GPX tracks, and conditions. Build a personal atlas of routes you've done — and ones you want to do." },
  { icon: "🌤️", color: "rgba(96,183,255,0.12)", title: "Conditions & Forecasts", desc: "Sync weather forecasts to your planned departure points before you go offline. Check conditions against your route for any flagged hazards." },
  { icon: "🔋", color: "rgba(200,149,92,0.1)", title: "Battery Efficient", desc: "Built to run all day on a phone. Minimal background processing. Screen-on time for navigation without killing your battery on the descent." },
];

const SAVED_TRIPS = [
  { name: "Tongariro Alpine Crossing", tags: ["Downloaded", "8hr", "Volcanic"], date: "Planned: 15 Jul" },
  { name: "Milford Track — Day 3", tags: ["Archived", "19km", "Completed"], date: "Done: 22 Apr" },
  { name: "Copland Track", tags: ["Draft", "3 days", "Hot Springs"], date: "Saved for later" },
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
    revealRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-mark">🏔</div>
          <span className="nav-name">TrailDesk</span>
        </Link>
        <a href="#waitlist" className="nav-cta">Get Early Access</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">🏔 Offline-first · No signal required</div>
        <h1 className="hero-title">
          Trip planning that works<br />when your <span className="accent">signal doesn&apos;t.</span>
        </h1>
        <p className="hero-sub">
          Offline route mapping, gear checklists, emergency contacts, and trail archives. For people who take going outside seriously enough to prepare for it.
        </p>
        <div className="hero-actions">
          <a href="#waitlist" className="btn-primary">Join the Waitlist →</a>
          <a href="#features" className="btn-ghost">See Features</a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><span className="hero-stat-num">100%</span><span className="hero-stat-label">Offline capable</span></div>
          <div className="hero-stat"><span className="hero-stat-num">All day</span><span className="hero-stat-label">Battery life</span></div>
          <div className="hero-stat"><span className="hero-stat-num">0</span><span className="hero-stat-label">Data required</span></div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section">
        <p className="section-label reveal" ref={addReveal}>Features</p>
        <h2 className="section-title reveal" ref={addReveal}>Prepared before you leave. Safe while you&apos;re out there.</h2>
        <p className="section-sub reveal" ref={addReveal}>Every feature built around the assumption that you will lose signal — because you will.</p>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card reveal" ref={addReveal} style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRIP DEMO */}
      <div style={{ background: "var(--bg2)", padding: "5rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p className="section-label reveal" ref={addReveal}>Your trips</p>
          <h2 className="section-title reveal" ref={addReveal}>Everything in one place.</h2>
          <p className="section-sub reveal" ref={addReveal}>Planned, archived, and in-progress trips — all accessible offline.</p>
          <div>
            {SAVED_TRIPS.map((trip, i) => (
              <div key={i} className="trip-card reveal" ref={addReveal} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="trip-name">{trip.name}</div>
                <div className="trip-meta">
                  {trip.tags.map((t) => <span key={t} className="trip-tag">{t}</span>)}
                  <span style={{ fontSize: "0.8rem", color: "var(--text-mute)", alignSelf: "center" }}>{trip.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section">
        <p className="section-label reveal" ref={addReveal}>How it works</p>
        <h2 className="section-title reveal" ref={addReveal}>Three steps before the trailhead.</h2>
        <div className="steps">
          {[
            { num: "01", title: "Plan your route", desc: "Search or draw your route on the map. Add waypoints, estimated times, and campsites." },
            { num: "02", title: "Prepare offline", desc: "Download maps for your area. Pack your gear with the checklist. Set your emergency contact schedule." },
            { num: "03", title: "Go — without worrying", desc: "Navigate with cached maps. Log notes and photos. Check in with your contact at planned points." },
          ].map((step, i) => (
            <div key={i} className="step reveal" ref={addReveal} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="step-num">{step.num}</div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <div style={{ background: "var(--bg2)", padding: "5rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="section-label reveal" ref={addReveal}>Pricing</p>
          <h2 className="section-title reveal" ref={addReveal}>Simple. No surprises.</h2>
          <div className="price-grid">
            {[
              { tier: "Free", amount: "$0", period: "", desc: "For day trips and occasional use.", features: ["3 saved trips", "Basic gear checklists", "1 emergency contact", "Manual GPX import"], featured: false },
              { tier: "Explorer", amount: "$6", period: "/mo", desc: "For people who go out regularly.", features: ["Unlimited saved trips", "Offline map downloads (10 regions)", "Smart gear checklists", "Emergency check-in schedule", "Weather sync", "Trail archive with photos"], featured: true },
              { tier: "Expedition", amount: "$12", period: "/mo", desc: "For guides, instructors, and serious adventurers.", features: ["Everything in Explorer", "Unlimited offline regions", "Group trip sharing", "Satellite messenger integration", "Export to GPX/KML"], featured: false },
            ].map((p, i) => (
              <div key={i} className={`price-card reveal ${p.featured ? "featured" : ""}`} ref={addReveal} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="price-tier">{p.tier}</div>
                <div className="price-amount">{p.amount}<span>{p.period}</span></div>
                <div className="price-desc">{p.desc}</div>
                <ul className="price-features">
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <a href="#waitlist" className={p.featured ? "btn-primary" : "btn-ghost"} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                  Get Early Access
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WAITLIST */}
      <section id="waitlist" style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p className="section-label" style={{ justifyContent: "center", display: "flex" }}>Early Access</p>
          <h2 className="section-title" style={{ textAlign: "center" }}>Get notified when we launch.</h2>
          <p className="section-sub" style={{ margin: "0 auto 2rem", textAlign: "center" }}>
            Early access members get 3 months of Explorer free and direct input on features before we ship them.
          </p>
          {submitted ? (
            <div style={{ padding: "2rem", background: "rgba(52,211,153,0.1)", borderRadius: "var(--radius)", border: "1px solid rgba(52,211,153,0.3)", color: "var(--trail)", fontWeight: 700 }}>
              You&apos;re in. We&apos;ll let you know when it&apos;s ready.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email" required placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: "1 1 260px", padding: "0.875rem 1.25rem", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontSize: "0.95rem", outline: "none" }}
              />
              <button type="submit" className="btn-primary">Get Early Access →</button>
            </form>
          )}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "3rem 1.5rem" }}>
        <div className="footer">
          <div className="footer-copy">TrailDesk · Built by Brian Josiah</div>
          <a href="https://josiah.rawsignal.dev" target="_blank" rel="noopener" className="footer-link">← Back to Portfolio</a>
        </div>
      </footer>
    </>
  );
}
