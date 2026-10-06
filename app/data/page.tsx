"use client";

import { Download, ShieldCheck, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { createWorkspaceBackup, restoreWorkspaceRecords, validateWorkspaceBackup } from "@/app/lib/workspace";
import "./data.css";

const MAX_BACKUP_BYTES = 2 * 1024 * 1024;

export default function DataPage() {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  function exportAll() {
    try {
      const backup = createWorkspaceBackup(localStorage);
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `traildesk-workspace-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage(`Workspace backup exported with ${Object.keys(backup.records).length} saved datasets.`);
    } catch { setMessage("This browser could not create the workspace backup."); }
  }
  async function restore(event: React.ChangeEvent<HTMLInputElement>) {
    const picker = event.currentTarget, file = picker.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) {
        setMessage("Choose a TrailDesk backup smaller than 2 MB. No records were changed.");
        return;
      }
      let value: unknown;
      try { value = JSON.parse(await file.text()); }
      catch { setMessage("This file could not be read as TrailDesk backup JSON. No records were changed."); return; }
      const checked = validateWorkspaceBackup(value), count = Object.keys(checked.records).length;
      if (!count) { setMessage(checked.errors.join(" ") || "No valid TrailDesk records were found."); return; }
      if (!confirm(`Restore ${count} validated dataset(s)? Matching browser-local data will be replaced.${checked.errors.length ? ` ${checked.errors.length} invalid dataset(s) will be skipped.` : ""}`)) {
        setMessage("Restore cancelled. Your existing records are unchanged.");
        return;
      }
      restoreWorkspaceRecords(localStorage, checked.records);
      setMessage(`Restored ${count} dataset(s).${checked.errors.length ? ` ${checked.errors.length} invalid dataset(s) were skipped.` : ""} Open a product page to see the restored records.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Browser storage is unavailable. Restore could not be completed.");
    } finally { picker.value = ""; setBusy(false); }
  }
  return <AppShell><main id="main-content">
    <header className="page-header"><div className="container">
      <p className="eyebrow">Your records, on your terms</p><h1>Keep your TrailDesk workspace portable.</h1>
      <p className="lede">Download one file containing saved trips, departure checks, debriefs, gear progress and local review drafts. Nothing is uploaded.</p>
    </div></header>
    <div className="container narrow">
      <div className="notice"><strong>Keep your backup private.</strong> It can contain contact and medical notes. The downloaded file is not encrypted.</div>
      <div className="data-grid">
        <section className="card"><Download size={26} aria-hidden="true" /><h2>Export workspace</h2><p>Create a dated JSON backup from readable TrailDesk records in this browser.</p><button className="button button-primary" disabled={busy} onClick={exportAll}>Download backup</button></section>
        <section className="card"><Upload size={26} aria-hidden="true" /><h2>Restore workspace</h2><p>Choose a backup up to 2 MB. We check its records and ask before replacing matching data.</p><button className="button" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Checking backup…" : "Choose backup file"}</button><input ref={input} className="sr-only" type="file" accept=".json,application/json" aria-label="TrailDesk workspace backup file" onChange={restore} /></section>
      </div>
      <p role="status" aria-live="polite">{message}</p>
      <section className="section"><ShieldCheck size={28} aria-hidden="true" /><h2>What travels with your backup</h2><ul className="data-list">
        <li>Saved trips, departure checks, debriefs, gear selections and personal review drafts.</li>
        <li>Only matching datasets are replaced; other workspace records stay in place.</li>
        <li>If a storage write fails, TrailDesk attempts to restore the records it replaced and reports the outcome.</li>
        <li>This is a manual backup. There is no automatic cloud copy or device sync.</li>
      </ul></section>
    </div>
  </main></AppShell>;
}
