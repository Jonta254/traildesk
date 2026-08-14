"use client";

import { Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { GEAR_TEMPLATES, type GearTemplateName } from "@/app/lib/gear";

const STORAGE_KEY="traildesk_gear_v1";
type PackedState=Record<string,string[]>;

export default function GearPage(){
  const templates=Object.keys(GEAR_TEMPLATES) as GearTemplateName[];const [active,setActive]=useState<GearTemplateName>("Day Hike");const [packed,setPacked]=useState<PackedState>({});const [custom,setCustom]=useState<Record<string,string[]>>({});const [newItem,setNewItem]=useState("");const [ready,setReady]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const value=JSON.parse(raw);setPacked(value.packed??{});setCustom(value.custom??{})}}catch{}setReady(true)},0);return()=>window.clearTimeout(timer)},[]);
  const save=(nextPacked:PackedState,nextCustom=custom)=>{setPacked(nextPacked);setCustom(nextCustom);try{localStorage.setItem(STORAGE_KEY,JSON.stringify({packed:nextPacked,custom:nextCustom}))}catch{}};
  const items=useMemo(()=>[...GEAR_TEMPLATES[active],...(custom[active]??[])],[active,custom]);const done=packed[active]??[];const percentage=items.length?Math.round(done.filter((item)=>items.some((value)=>value===item)).length/items.length*100):0;
  const toggle=(item:string)=>save({...packed,[active]:done.includes(item)?done.filter((value)=>value!==item):[...done,item]});
  const add=()=>{const item=newItem.trim();if(!item||items.some((value)=>value===item))return;save(packed,{...custom,[active]:[...(custom[active]??[]),item]});setNewItem("")};
  const reset=()=>save({...packed,[active]:[]});
  return <AppShell><main id="main-content"><header className="page-header"><div className="container"><p className="eyebrow">Reusable preparation lists</p><h1>Pack deliberately.</h1><p className="lede">Use these templates to start a conversation with the route--not to end it. Local guides, park authorities, weather, altitude, and season determine what you actually need.</p></div></header><div className="container">
    <div className="notice"><strong>General prompts only.</strong> TrailDesk does not assess your route or certify that a list is complete. Specialist and technical equipment requires appropriate training.</div>
    <section className="gear-layout" style={{marginTop:"var(--space-6)"}}><nav className="gear-tabs" aria-label="Gear templates">{templates.map((template)=><button type="button" aria-pressed={active===template} onClick={()=>setActive(template)} key={template}>{template}<span style={{display:"block",fontSize:".72rem",color:"var(--ink-faint)"}}>{GEAR_TEMPLATES[template].length} starting items</span></button>)}</nav><div className="card form-card"><div className="split"><div><p className="eyebrow">{percentage}% marked</p><h2>{active}</h2></div><button className="button button-small" type="button" onClick={reset}><RotateCcw size={14}/> Reset checks</button></div><p>Selections and custom items are saved in this browser independently from individual trip plans.</p>{!ready?<p aria-live="polite">Loading this device&apos;s checklist...</p>:<div>{items.map((item)=><label className={`gear-row${done.includes(item)?" is-packed":""}`} key={item}><input type="checkbox" checked={done.includes(item)} onChange={()=>toggle(item)}/><span>{item}</span>{(custom[active]??[]).includes(item)&&<small>Custom</small>}</label>)}</div>}<div className="field" style={{marginTop:"var(--space-5)"}}><label htmlFor="new-gear-item">Add an item</label><div className="cluster" style={{flexWrap:"nowrap"}}><input id="new-gear-item" value={newItem} onChange={(e)=>setNewItem(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"){e.preventDefault();add()}}}/><button className="button" type="button" onClick={add}><Plus size={16}/> Add</button></div></div></div></section>
  </div></main></AppShell>;
}



