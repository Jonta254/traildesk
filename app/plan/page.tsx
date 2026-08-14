"use client";

import Link from "next/link";
import { Check, LocateFixed, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { destinationPrefill, findDestination } from "@/app/lib/destinations";
import { GEAR_TEMPLATES, type GearTemplateName } from "@/app/lib/gear";
import { readTrips, writeTrips, type SavedTrip } from "@/app/lib/trips";

type Step = 1 | 2 | 3 | 4;
const stepNames = ["Trip details", "Gear", "Contact plan", "Review"];
const initialForm = { name:"",region:"",date:"",duration:"",distance:"",type:"Day Hike" as GearTemplateName,notes:"",contactName:"",contactPhone:"",checkInPlan:"Tell this contact your route and expected return time.",gear:[] as string[],customGear:"" };

export default function PlanPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState(initialForm);
  const [coordinates, setCoordinates] = useState<{ lat:number; lng:number } | null>(null);
  const [locationState, setLocationState] = useState<"idle"|"loading"|"error">("idle");
  const [origin, setOrigin] = useState("");
  const [saveState, setSaveState] = useState<"idle"|"saved"|"error">("idle");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const destination = findDestination(new URLSearchParams(window.location.search).get("dest"));
      if (!destination) return;
      const prefill = destinationPrefill(destination);
      setForm((current) => ({ ...current, ...prefill, type: prefill.type, gear: [...GEAR_TEMPLATES[prefill.type]] }));
      setOrigin(destination.name);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const update = <K extends keyof typeof form>(key:K,value:(typeof form)[K]) => setForm((current) => ({...current,[key]:value}));
  const setType = (type:GearTemplateName) => setForm((current) => ({...current,type,gear:[...GEAR_TEMPLATES[type]]}));
  const toggleGear = (item:string) => update("gear",form.gear.includes(item) ? form.gear.filter((value) => value !== item) : [...form.gear,item]);
  const addGear = () => { const item=form.customGear.trim(); if(item && !form.gear.includes(item)) setForm((current) => ({...current,gear:[...current.gear,item],customGear:""})); };
  const locate = () => {
    if (!navigator.geolocation) return setLocationState("error");
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(({coords}) => { setCoordinates({lat:Number(coords.latitude.toFixed(5)),lng:Number(coords.longitude.toFixed(5))});setLocationState("idle"); },() => setLocationState("error"),{timeout:10000,enableHighAccuracy:false});
  };
  const save = () => {
    const now=new Date().toISOString();
    const trip:SavedTrip={id:crypto.randomUUID(),name:form.name.trim(),region:form.region.trim(),date:form.date,duration:form.duration.trim(),distance:form.distance.trim(),type:form.type,notes:form.notes.trim(),contactName:form.contactName.trim(),contactPhone:form.contactPhone.trim(),checkInPlan:form.checkInPlan.trim(),gear:form.gear,coordinates,status:"planned",createdAt:now,updatedAt:now};
    try { writeTrips([...readTrips(),trip]); setSaveState("saved"); } catch { setSaveState("error"); }
  };

  return <AppShell><main id="main-content"><header className="page-header"><div className="container"><p className="eyebrow">Local trip planner</p><h1>Build a field-ready brief.</h1><p className="lede">Organise what you know, expose what is still missing, and keep a copy in this browser. TrailDesk does not send alerts or monitor check-ins.</p></div></header><div className="container narrow">
    {origin && saveState==="idle" && <div className="notice"><strong>Started from {origin}.</strong> The catalogue supplied general context. Add a date and replace it with verified route-specific information.</div>}
    {saveState==="saved" ? <section className="card form-card" aria-live="polite"><Check size={30} color="var(--moss)" /><h2>Plan saved on this device.</h2><p>Your contact has not been notified and no tracking is active. Share the plan yourself and keep a separate navigation and emergency system.</p><div className="cluster"><Link className="button button-primary" href="/trips">View saved trips</Link><button className="button" onClick={() => {setForm(initialForm);setCoordinates(null);setOrigin("");setStep(1);setSaveState("idle");}}>Plan another trip</button></div></section> :
    <section className="planner" aria-label="Trip planning form"><ol className="step-list">{stepNames.map((name,index) => <li className={step===index+1?"active":undefined} aria-current={step===index+1?"step":undefined} key={name}>{index+1}. {name}</li>)}</ol><div className="card form-card">
      {step===1 && <><h2>Trip details</h2><p>Use verified route names and leave uncertainty visible in your notes.</p><div className="field"><label htmlFor="trip-name">Trip name *</label><input id="trip-name" value={form.name} onChange={(e)=>update("name",e.target.value)} required /></div><div className="form-grid"><div className="field"><label htmlFor="region">Region / country</label><input id="region" value={form.region} onChange={(e)=>update("region",e.target.value)} /></div><div className="field"><label htmlFor="date">Departure date *</label><input id="date" type="date" value={form.date} onChange={(e)=>update("date",e.target.value)} required /></div><div className="field"><label htmlFor="type">Trip type</label><select id="type" value={form.type} onChange={(e)=>setType(e.target.value as GearTemplateName)}>{Object.keys(GEAR_TEMPLATES).map((type)=><option key={type}>{type}</option>)}</select></div><div className="field"><label htmlFor="distance">Approx. distance (km)</label><input id="distance" type="number" min="0" step="0.1" value={form.distance} onChange={(e)=>update("distance",e.target.value)} /></div></div><div className="field"><label htmlFor="duration">Expected duration</label><input id="duration" value={form.duration} onChange={(e)=>update("duration",e.target.value)} placeholder="For example, 6 hours or 5 days" /></div><div className="field"><label htmlFor="notes">Research notes</label><textarea id="notes" value={form.notes} onChange={(e)=>update("notes",e.target.value)} placeholder="Route, access, permits, water, turnaround points, guide requirements..." /></div><button className="button button-small" type="button" onClick={locate} disabled={locationState==="loading"}><LocateFixed size={15} />{locationState==="loading"?"Requesting location...":"Add my current coordinates"}</button>{coordinates&&<p className="eyebrow" style={{marginTop:"var(--space-3)"}}>Saved reference: {coordinates.lat}, {coordinates.lng}</p>}{locationState==="error"&&<p role="alert" style={{color:"var(--clay)"}}>Location was unavailable. Continue without it or add coordinates to your notes.</p>}<div className="form-actions"><span/><button className="button button-primary" disabled={!form.name.trim()||!form.date} onClick={()=>setStep(2)}>Continue to gear</button></div></>}
      {step===2 && <><h2>Gear checklist</h2><p>The {form.type} template is a prompt, not an authoritative packing list. Adapt it to the route, season, group, and park guidance.</p><div className="check-grid">{GEAR_TEMPLATES[form.type].map((item)=><label className="check-item" key={item}><input type="checkbox" checked={form.gear.includes(item)} onChange={()=>toggleGear(item)} /><span>{item}</span></label>)}</div><div className="field" style={{marginTop:"var(--space-4)"}}><label htmlFor="custom-gear">Add route-specific item</label><div className="cluster" style={{flexWrap:"nowrap"}}><input id="custom-gear" value={form.customGear} onChange={(e)=>update("customGear",e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"){e.preventDefault();addGear();}}} /><button className="button" type="button" onClick={addGear}><Plus size={16}/> Add</button></div></div>{form.gear.filter((item)=>!GEAR_TEMPLATES[form.type].some((value)=>value===item)).map((item)=><button type="button" className="button button-small" onClick={()=>toggleGear(item)} key={item}>{item} Remove</button>)}<div className="form-actions"><button className="button" onClick={()=>setStep(1)}>Back</button><button className="button button-primary" onClick={()=>setStep(3)}>Continue to contact plan</button></div></>}
      {step===3 && <><h2>Contact plan</h2><div className="notice"><strong>Manual coordination only.</strong> TrailDesk stores these notes locally. It does not contact this person, detect missed check-ins, send SMS, or track your position.</div><div className="form-grid" style={{marginTop:"var(--space-4)"}}><div className="field"><label htmlFor="contact-name">Contact name</label><input id="contact-name" value={form.contactName} onChange={(e)=>update("contactName",e.target.value)} /></div><div className="field"><label htmlFor="contact-phone">Contact phone</label><input id="contact-phone" type="tel" value={form.contactPhone} onChange={(e)=>update("contactPhone",e.target.value)} /></div></div><div className="field"><label htmlFor="checkin-plan">Instructions to agree outside TrailDesk</label><textarea id="checkin-plan" value={form.checkInPlan} onChange={(e)=>update("checkInPlan",e.target.value)} /></div><div className="form-actions"><button className="button" onClick={()=>setStep(2)}>Back</button><button className="button button-primary" onClick={()=>setStep(4)}>Review plan</button></div></>}
      {step===4 && <><h2>Review before saving</h2><dl className="summary-list"><div className="summary-row"><dt>Trip</dt><dd>{form.name} / {form.region||"Region not recorded"} / {form.date}</dd></div><div className="summary-row"><dt>Route notes</dt><dd>{form.notes||"No research notes yet"}</dd></div><div className="summary-row"><dt>Gear</dt><dd>{form.gear.length?form.gear.join(" / "):"No gear recorded"}</dd></div><div className="summary-row"><dt>Contact plan</dt><dd>{form.contactName?`${form.contactName}${form.contactPhone?` / ${form.contactPhone}`:""}\n${form.checkInPlan}`:"No contact recorded"}</dd></div><div className="summary-row"><dt>Storage</dt><dd>This browser only. Clearing site data removes the plan.</dd></div></dl>{saveState==="error"&&<p role="alert" style={{color:"var(--clay)"}}>This browser blocked local storage. The plan was not saved.</p>}<div className="form-actions"><button className="button" onClick={()=>setStep(3)}>Back</button><button className="button button-primary" onClick={save}><Save size={16}/> Save on this device</button></div></>}
    </div></section>}
  </div></main></AppShell>;
}



