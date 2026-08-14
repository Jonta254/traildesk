"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, MapPin, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { readTrips, writeTrips, type SavedTrip, type TripStatus } from "@/app/lib/trips";

const filters = ["all","planned","completed","draft"] as const;
type Filter=(typeof filters)[number];

export default function TripsPage(){
  const [trips,setTrips]=useState<SavedTrip[]>([]);const [ready,setReady]=useState(false);const [filter,setFilter]=useState<Filter>("all");const [expanded,setExpanded]=useState<string|null>(null);const [storageError,setStorageError]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{setTrips(readTrips());setReady(true)},0);return()=>window.clearTimeout(timer)},[]);
  const visible=useMemo(()=>filter==="all"?trips:trips.filter((trip)=>trip.status===filter),[filter,trips]);
  const persist=(next:SavedTrip[])=>{try{writeTrips(next);setTrips(next);setStorageError(false)}catch{setStorageError(true)}};
  const changeStatus=(id:string,status:TripStatus)=>persist(trips.map((trip)=>trip.id===id?{...trip,status,updatedAt:new Date().toISOString()}:trip));
  const remove=(trip:SavedTrip)=>{if(window.confirm(`Delete "${trip.name}" from this browser? This cannot be undone.`))persist(trips.filter((item)=>item.id!==trip.id))};
  return <AppShell><main id="main-content"><header className="page-header"><div className="container"><p className="eyebrow">Browser-local workspace</p><div className="split"><div><h1>Saved trips.</h1><p className="lede">Plans created here stay on this device. They are not backed up, shared, monitored, or synchronised.</p></div><Link className="button button-primary" href="/plan"><Plus size={16}/> New plan</Link></div></div></header><div className="container narrow">
    <div className="notice"><strong>Storage note.</strong> Clearing browser data or switching browsers removes these plans. Copy important details into a durable document before departure.</div>
    <div className="filter-group" role="group" aria-label="Filter trips" style={{marginBlock:"var(--space-5)"}}>{filters.map((value)=><button className="filter-button" aria-pressed={filter===value} onClick={()=>setFilter(value)} key={value}>{value[0].toUpperCase()+value.slice(1)}</button>)}</div>
    {storageError&&<p role="alert" style={{color:"var(--clay)"}}>The browser refused the storage update. Your change may not persist.</p>}
    {!ready?<div className="empty-state" aria-live="polite">Loading trips from this browser...</div>:visible.length===0?<div className="empty-state"><h2>{trips.length?"No trips match this filter":"No saved trips yet"}</h2><p>{trips.length?"Choose another status to see your plans.":"Start from a destination or create a blank plan. TrailDesk will save it in this browser."}</p>{!trips.length&&<Link className="button button-primary" href="/explore">Explore destinations</Link>}</div>:
    <section className="trip-list" aria-label="Saved trips">{visible.map((trip)=>{const open=expanded===trip.id;return <article className="card trip-card" key={trip.id}><button type="button" className="trip-toggle" aria-expanded={open} aria-controls={`trip-${trip.id}`} onClick={()=>setExpanded(open?null:trip.id)}><div className="split"><div><div className="cluster"><StatusBadge tone={trip.status==="completed"?"available":"neutral"}>{trip.status}</StatusBadge><span className="destination-meta">{trip.type}</span></div><h2 style={{marginTop:"var(--space-2)"}}>{trip.name}</h2><div className="destination-meta"><span>{trip.region||"Region not recorded"}</span><span>{trip.date||"Date not recorded"}</span>{trip.distance&&<span>{trip.distance} km</span>}{trip.duration&&<span>{trip.duration}</span>}</div></div>{open?<ChevronUp aria-hidden="true"/>:<ChevronDown aria-hidden="true"/>}</div></button>{open&&<div className="trip-details" id={`trip-${trip.id}`}><dl className="summary-list"><div className="summary-row"><dt>Research notes</dt><dd>{trip.notes||"No notes recorded"}</dd></div><div className="summary-row"><dt>Gear</dt><dd>{trip.gear.length?trip.gear.join(" / "):"No gear recorded"}</dd></div><div className="summary-row"><dt>Contact plan</dt><dd>{trip.contactName?`${trip.contactName}${trip.contactPhone?` / ${trip.contactPhone}`:""}\n${trip.checkInPlan}`:"No contact plan recorded"}</dd></div>{trip.coordinates&&<div className="summary-row"><dt>Saved coordinate</dt><dd><MapPin size={14} aria-hidden="true"/> {trip.coordinates.lat}, {trip.coordinates.lng}</dd></div>}</dl><div className="cluster" style={{marginTop:"var(--space-4)"}}><label className="field-label" htmlFor={`status-${trip.id}`}>Status</label><select id={`status-${trip.id}`} style={{width:"auto"}} value={trip.status} onChange={(e)=>changeStatus(trip.id,e.target.value as TripStatus)}><option value="planned">Planned</option><option value="draft">Draft</option><option value="completed">Completed</option></select><button className="button button-small button-danger" type="button" onClick={()=>remove(trip)}><Trash2 size={14}/> Delete</button></div></div>}</article>})}</section>}
  </div></main></AppShell>;
}


