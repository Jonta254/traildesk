"use client";
import { useState } from "react";
import Link from "next/link";

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="url(#tg-bg)"/>
      <path d="M5 26L12 12L17 20L22 10L29 26H5Z" fill="none" stroke="url(#tg-pk)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M22 10L19.5 16L24.5 16L22 10Z" fill="url(#tg-sn)" opacity="0.8"/>
      <circle cx="22" cy="10" r="1.5" fill="url(#tg-dt)"/>
      <defs>
        <linearGradient id="tg-bg" x1="0" y1="0" x2="34" y2="34"><stop offset="0%" stopColor="#061A10"/><stop offset="100%" stopColor="#030A08"/></linearGradient>
        <linearGradient id="tg-pk" x1="5" y1="26" x2="29" y2="10"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#60B7FF"/></linearGradient>
        <linearGradient id="tg-sn" x1="19" y1="10" x2="25" y2="16"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/><stop offset="100%" stopColor="#60B7FF" stopOpacity="0.5"/></linearGradient>
        <radialGradient id="tg-dt"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#20A876"/></radialGradient>
      </defs>
    </svg>
  );
}

type GearItem = { id: string; name: string; weight?: string; category: string; checked: boolean };
type GearList = { id: string; name: string; type: string; items: GearItem[] };

const DEFAULT_LISTS: GearList[] = [
  {
    id: "day", name: "Day Hike — Standard", type: "Day Hike",
    items: [
      { id:"1", name:"Water (2L minimum)", weight:"2.0 kg", category:"Hydration", checked:false },
      { id:"2", name:"Trail snacks / lunch", weight:"0.5 kg", category:"Food", checked:false },
      { id:"3", name:"Rain jacket", weight:"0.35 kg", category:"Clothing", checked:false },
      { id:"4", name:"First aid kit", weight:"0.2 kg", category:"Safety", checked:false },
      { id:"5", name:"Sunscreen SPF50+", weight:"0.1 kg", category:"Personal", checked:false },
      { id:"6", name:"Sun hat or cap", weight:"0.1 kg", category:"Clothing", checked:false },
      { id:"7", name:"Navigation (charged phone + maps downloaded)", weight:"0.2 kg", category:"Navigation", checked:false },
      { id:"8", name:"Emergency whistle", weight:"0.02 kg", category:"Safety", checked:false },
      { id:"9", name:"Headlamp + spare batteries", weight:"0.15 kg", category:"Light", checked:false },
    ],
  },
  {
    id: "overnight", name: "Overnight — Lightweight", type: "Overnight",
    items: [
      { id:"o1", name:"Tent or bivvy (inner + fly)", weight:"1.2 kg", category:"Shelter", checked:false },
      { id:"o2", name:"Sleeping bag (rated to expected low)", weight:"1.0 kg", category:"Sleep", checked:false },
      { id:"o3", name:"Sleeping mat (insulated)", weight:"0.4 kg", category:"Sleep", checked:false },
      { id:"o4", name:"MSR pocket rocket stove + fuel canister", weight:"0.35 kg", category:"Cook", checked:false },
      { id:"o5", name:"Pot (700ml titanium)", weight:"0.12 kg", category:"Cook", checked:false },
      { id:"o6", name:"Food (per day — dehydrated / compact)", weight:"0.8 kg", category:"Food", checked:false },
      { id:"o7", name:"Water filter (Sawyer Squeeze)", weight:"0.1 kg", category:"Hydration", checked:false },
      { id:"o8", name:"Trekking poles", weight:"0.45 kg", category:"Movement", checked:false },
      { id:"o9", name:"10L waterproof bags × 2", weight:"0.1 kg", category:"Pack", checked:false },
      { id:"o10", name:"Merino base layer + thermal mid", weight:"0.55 kg", category:"Clothing", checked:false },
      { id:"o11", name:"Waterproof shell (jacket + pants)", weight:"0.6 kg", category:"Clothing", checked:false },
      { id:"o12", name:"First aid kit (expanded)", weight:"0.25 kg", category:"Safety", checked:false },
      { id:"o13", name:"Headlamp + spare batteries", weight:"0.15 kg", category:"Light", checked:false },
    ],
  },
];

export default function GearPage() {
  const [lists, setLists] = useState<GearList[]>(DEFAULT_LISTS);
  const [activeList, setActiveList] = useState<string>("day");
  const [newItem, setNewItem] = useState("");
  const [filter, setFilter] = useState<string>("All");

  const list = lists.find(l => l.id === activeList);
  const categories = list ? ["All", ...Array.from(new Set(list.items.map(i => i.category)))] : ["All"];
  const visible = list?.items.filter(i => filter === "All" || i.category === filter) ?? [];
  const packed = list?.items.filter(i => i.checked).length ?? 0;
  const total = list?.items.length ?? 0;

  const toggle = (itemId: string) => {
    setLists(prev => prev.map(l =>
      l.id === activeList
        ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) }
        : l
    ));
  };

  const addItem = () => {
    if (!newItem.trim() || !list) return;
    const item: GearItem = { id: Date.now().toString(), name: newItem.trim(), category: "Custom", checked: false };
    setLists(prev => prev.map(l => l.id === activeList ? { ...l, items: [...l.items, item] } : l));
    setNewItem("");
  };

  const resetList = () => {
    setLists(prev => prev.map(l =>
      l.id === activeList ? { ...l, items: l.items.map(i => ({ ...i, checked: false })) } : l
    ));
  };

  const pct = total > 0 ? Math.round((packed / total) * 100) : 0;
  const totalWeight = list?.items
    .filter(i => i.checked && i.weight)
    .reduce((sum, i) => sum + parseFloat(i.weight!), 0)
    .toFixed(1);

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
        .nav-btn{background:var(--trail);color:#04120B;font-size:0.78rem;font-weight:700;padding:7px 16px;border-radius:6px;text-decoration:none;letter-spacing:0.04em}
        .list-tab{font-size:0.82rem;padding:8px 16px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text-dim);cursor:pointer;transition:all 180ms;white-space:nowrap}
        .list-tab.active{background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.3);color:var(--trail)}
        .list-tab:hover:not(.active){border-color:rgba(255,255,255,0.15);color:var(--text)}
        .cat-pill{font-size:0.72rem;font-family:'JetBrains Mono',monospace;padding:4px 12px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text-mute);cursor:pointer;transition:all 180ms}
        .cat-pill.active{background:rgba(96,183,255,0.1);border-color:rgba(96,183,255,0.3);color:var(--sky)}
        .gear-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:background 150ms}
        .gear-row:last-child{border-bottom:none}
        .gear-row:hover{background:rgba(255,255,255,0.02);margin:0 -12px;padding:10px 12px;border-radius:6px}
        .gear-check{width:18px;height:18px;border:1px solid var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 180ms;font-size:11px}
        .gear-check.checked{background:rgba(52,211,153,0.15);border-color:rgba(52,211,153,0.5);color:var(--trail)}
        .gear-name{flex:1;font-size:0.875rem;transition:opacity 180ms}
        .gear-name.done{opacity:0.35;text-decoration:line-through}
        .gear-weight{font-size:0.72rem;color:var(--text-mute);font-family:'JetBrains Mono',monospace;flex-shrink:0}
        .progress-bar{height:4px;border-radius:2px;background:rgba(255,255,255,0.06)}
        .progress-fill{height:100%;border-radius:2px;background:linear-gradient(to right,var(--trail),var(--sky));transition:width 300ms}
        input{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:10px 14px;font-size:0.875rem;font-family:'Inter',sans-serif;outline:none;transition:border-color 180ms}
        input:focus{border-color:rgba(52,211,153,0.4)}
        .btn-sm{font-size:0.78rem;padding:9px 16px;border-radius:7px;font-family:'Inter',sans-serif;cursor:pointer;transition:all 180ms;font-weight:600}
        .btn-primary{background:var(--trail);color:#04120B;border:none}
        .btn-primary:hover{filter:brightness(1.1)}
        .btn-ghost{background:transparent;color:var(--text-mute);border:1px solid var(--border)}
        .btn-ghost:hover{border-color:rgba(255,255,255,0.2);color:var(--text)}
        @media(max-width:600px){.nav-links a:not(.nav-btn){display:none}}
      `}</style>

      <nav className="nav">
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <Logo />
          <span style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--text)" }}>TrailDesk</span>
        </Link>
        <div className="nav-links">
          <Link href="/trips" className="nav-link">My Trips</Link>
          <Link href="/plan" className="nav-link">Plan a Trip</Link>
          <Link href="/gear" className="nav-link active">Gear Lists</Link>
          <Link href="/plan" className="nav-btn">+ New Trip</Link>
        </div>
      </nav>

      <main style={{ maxWidth:720, margin:"0 auto", padding:"clamp(1.5rem,4vw,3rem) clamp(1rem,4vw,2rem)" }}>

        <div style={{ marginBottom:"clamp(1.25rem,3vw,2rem)" }}>
          <h1 style={{ fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:700, marginBottom:4 }}>Gear Lists</h1>
          <p style={{ color:"var(--text-dim)", fontSize:"0.875rem" }}>Reusable checklists by trip type. Tick off as you pack.</p>
        </div>

        {/* List tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:"1.5rem", overflowX:"auto", paddingBottom:4 }}>
          {lists.map(l => (
            <button key={l.id} className={`list-tab${activeList===l.id?" active":""}`} onClick={()=>{setActiveList(l.id);setFilter("All")}}>
              {l.name}
            </button>
          ))}
        </div>

        {list && (
          <>
            {/* Progress summary */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"1.25rem", marginBottom:"1.25rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div>
                  <span style={{ fontSize:"1.5rem", fontWeight:700, color:"var(--trail)" }}>{packed}</span>
                  <span style={{ fontSize:"0.875rem", color:"var(--text-dim)" }}> / {total} packed</span>
                </div>
                <div style={{ textAlign:"right" }}>
                  {totalWeight && <div style={{ fontSize:"0.82rem", fontFamily:"'JetBrains Mono',monospace", color:"var(--text-dim)" }}>~{totalWeight} kg packed</div>}
                  <button className="btn-sm btn-ghost" onClick={resetList} style={{ marginTop:6, fontSize:"0.72rem" }}>Reset all</button>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${pct}%` }} />
              </div>
              {pct === 100 && (
                <p style={{ fontSize:"0.82rem", color:"var(--trail)", marginTop:8 }}>✓ All packed — you&apos;re ready to go.</p>
              )}
            </div>

            {/* Category filter */}
            <div style={{ display:"flex", gap:6, marginBottom:"1rem", flexWrap:"wrap" }}>
              {categories.map(cat => (
                <button key={cat} className={`cat-pill${filter===cat?" active":""}`} onClick={()=>setFilter(cat)}>{cat}</button>
              ))}
            </div>

            {/* Gear items */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"1rem 1.25rem", marginBottom:"1.25rem" }}>
              {visible.map(item => (
                <div key={item.id} className="gear-row" onClick={()=>toggle(item.id)}>
                  <div className={`gear-check${item.checked?" checked":""}`}>{item.checked?"✓":""}</div>
                  <div className={`gear-name${item.checked?" done":""}`}>{item.name}</div>
                  {item.weight && <div className="gear-weight">{item.weight}</div>}
                  <span style={{ fontSize:"0.68rem", fontFamily:"'JetBrains Mono',monospace", color:"var(--text-mute)", padding:"2px 7px", border:"1px solid var(--border)", borderRadius:10 }}>{item.category}</span>
                </div>
              ))}
            </div>

            {/* Add custom item */}
            <div style={{ display:"flex", gap:8 }}>
              <input placeholder="Add item to this list…" value={newItem} onChange={e=>setNewItem(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")addItem()}} />
              <button className="btn-sm btn-primary" onClick={addItem} style={{ flexShrink:0, padding:"9px 20px" }}>Add</button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
