"use client";

import { CheckCircle2, ClipboardCopy, NotebookPen } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DEBRIEFS_STORAGE_KEY, debriefSummary, parseDebriefs, type DebriefRecord, type TripOutcome } from "@/app/lib/debriefs";
import { readTrips, writeTrips, type SavedTrip } from "@/app/lib/trips";
import "./debrief.css";

const emptyRecord = (tripId: string): DebriefRecord => ({ schemaVersion: 1, tripId, outcome: "completed", actualDuration: "", conditions: "", routeChanges: "", gearLessons: "", nextTime: "", contactClosedOut: false, updatedAt: "" });

export default function DebriefPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [records, setRecords] = useState<Record<string, DebriefRecord>>({});
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = readTrips();
      setTrips(saved);
      try { setRecords(parseDebriefs(localStorage.getItem(DEBRIEFS_STORAGE_KEY))); } catch { setMessage("Saved debriefs could not be read in this browser."); }
      const requested = new URLSearchParams(location.search).get("trip");
      setSelected(saved.some((trip) => trip.id === requested) ? requested ?? "" : saved[0]?.id ?? "");
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const trip = useMemo(() => trips.find((item) => item.id === selected), [trips, selected]);
  const record = trip ? records[trip.id] ?? emptyRecord(trip.id) : null;
  const persist = (next: DebriefRecord) => {
    const all = { ...records, [next.tripId]: { ...next, updatedAt: new Date().toISOString() } };
    try { localStorage.setItem(DEBRIEFS_STORAGE_KEY, JSON.stringify(all)); setRecords(all); setMessage("Debrief saved in this browser."); }
    catch { setMessage("This browser could not save the debrief. Copy it before leaving this page."); }
  };
  const update = <K extends keyof DebriefRecord>(key: K, value: DebriefRecord[K]) => record && persist({ ...record, [key]: value });
  const closeTrip = () => {
    if (!trip || !record) return;
    persist({ ...record, contactClosedOut: true });
    try {
      const now = new Date().toISOString();
      const next = trips.map((item) => item.id === trip.id ? { ...item, status: "completed" as const, updatedAt: now } : item);
      writeTrips(next); setTrips(next); setMessage("Contact close-out recorded and trip marked completed.");
    } catch { setMessage("The debrief was saved, but the trip status could not be updated."); }
  };
  const copy = async () => {
    if (!trip || !record) return;
    try { await navigator.clipboard.writeText(debriefSummary(trip, record)); setMessage("Debrief copied."); }
    catch { setMessage("Clipboard access was unavailable."); }
  };

  return <AppShell><main id="main-content"><header className="page-header"><div className="container"><p className="eyebrow">After the trail</p><h1>Keep what the trip taught you.</h1><p className="lede">Close the loop with your trusted contact, record what changed, and keep useful lessons beside the plan that produced them.</p></div></header><div className="container">{!ready ? <div className="empty-state">Opening saved trips…</div> : !trips.length ? <div className="empty-state"><NotebookPen size={30}/><h2>No trip to debrief yet</h2><p>Create a trip brief first. Your debrief will remain attached to that browser-local record.</p><Link className="button button-primary" href="/plan">Build a trip plan</Link></div> : <><label className="field narrow">Trip to debrief<select value={selected} onChange={(event) => setSelected(event.target.value)}>{trips.map((item) => <option value={item.id} key={item.id}>{item.name} — {item.date || "date not set"}</option>)}</select></label>{trip && record ? <div className="debrief-layout section"><section className="card form-card" aria-labelledby="debrief-fields"><p className="eyebrow">Personal field record</p><h2 id="debrief-fields">What actually happened?</h2><p>Write observations, not universal advice. Conditions and access can change after your trip.</p><div className="debrief-fields"><label className="field">Outcome<select value={record.outcome} onChange={(event) => update("outcome", event.target.value as TripOutcome)}><option value="completed">Completed as planned</option><option value="turned-back">Turned back</option><option value="changed-route">Changed route</option><option value="cancelled">Cancelled before starting</option></select></label><label className="field">Actual duration<input value={record.actualDuration} maxLength={100} onChange={(event) => update("actualDuration", event.target.value)} placeholder="For example, 7 hours 20 minutes"/></label><label className="field">Conditions encountered<textarea value={record.conditions} maxLength={800} onChange={(event) => update("conditions", event.target.value)}/></label><label className="field">Route changes or turnaround decision<textarea value={record.routeChanges} maxLength={800} onChange={(event) => update("routeChanges", event.target.value)}/></label><label className="field">Gear that worked—or did not<textarea value={record.gearLessons} maxLength={800} onChange={(event) => update("gearLessons", event.target.value)}/></label><label className="field">What to change next time<textarea value={record.nextTime} maxLength={800} onChange={(event) => update("nextTime", event.target.value)}/></label></div></section><aside className="card form-card debrief-side" aria-live="polite"><CheckCircle2 size={26}/><p className="eyebrow">Close-out</p><h2>{record.contactClosedOut ? "Trip closed out" : "Contact still needs closure"}</h2><p>{record.contactClosedOut ? "You recorded that the trusted contact was told the group returned." : "Tell the trusted contact the group is back. TrailDesk cannot send this message for you."}</p><div className="debrief-state"><strong>{trip.name}</strong><p className="destination-meta">Status: {trip.status} · {record.updatedAt ? `updated ${new Date(record.updatedAt).toLocaleString()}` : "not yet saved"}</p></div>{!record.contactClosedOut ? <button className="button button-primary" onClick={closeTrip}>Record contact close-out</button> : null}<button className="button" onClick={copy}><ClipboardCopy size={15}/> Copy debrief</button><Link className="button" href={`/plan?edit=${trip.id}`}>Review original brief</Link></aside></div> : null}</>}{message ? <p role="status">{message}</p> : null}</div></main></AppShell>;
}
