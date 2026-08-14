"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Map, Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { DESTINATIONS, mapsDirectionsUrl, mapsEmbedUrl, mapsSearchUrl } from "@/app/lib/destinations";
import { PHOTO_CREDITS } from "@/app/lib/photo-credits";

const filters = ["All", "Moderate", "Hard", "Expert"] as const;
type Filter = (typeof filters)[number];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const results = useMemo(() => DESTINATIONS.filter((destination) => {
    const matchesDifficulty = filter === "All" || destination.difficulty === filter;
    const haystack = `${destination.name} ${destination.country} ${destination.type} ${destination.description}`.toLowerCase();
    return matchesDifficulty && (!deferredQuery || haystack.includes(deferredQuery));
  }), [deferredQuery, filter]);

  return (
    <AppShell>
      <main id="main-content">
        <header className="page-header"><div className="container"><p className="eyebrow">Destination catalogue</p><h1>Research African treks.</h1><p className="lede">A curated starting set of established destinations. Details are orientation notes, not live trail reports. Confirm every route with official sources before travel.</p></div></header>
        <div className="container">
          <div className="notice"><strong>Maps require internet.</strong> TrailDesk embeds Google Maps for orientation and links out for directions. It does not download maps or provide offline navigation.</div>
          <section className="controls" aria-label="Destination filters">
            <div className="field" style={{ marginBottom: 0 }}><label htmlFor="destination-search">Search destinations</label><div style={{ position: "relative" }}><Search size={17} aria-hidden="true" style={{ position:"absolute",left:12,top:14,color:"var(--ink-faint)" }} /><input id="destination-search" className="input" style={{ paddingLeft:38 }} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Place, country, or trek type" /></div></div>
            <div><span className="field-label">Difficulty</span><div className="filter-group" role="group" aria-label="Filter by difficulty">{filters.map((value) => <button type="button" className="filter-button" aria-pressed={filter === value} onClick={() => setFilter(value)} key={value}>{value}</button>)}</div></div>
          </section>
          <p aria-live="polite" className="eyebrow">{results.length} {results.length === 1 ? "destination" : "destinations"}</p>
          {results.length === 0 ? <div className="empty-state"><h2>No matching destination</h2><p>Try another place name or clear the difficulty filter.</p><button className="button" onClick={() => { setQuery(""); setFilter("All"); }}>Reset filters</button></div> : (
            <section className="destination-grid" aria-label="Destinations">
              {results.map((destination) => {
                const open = expanded === destination.id;
                const credit = PHOTO_CREDITS[destination.id];
                return <article id={destination.id} className="card destination-card" key={destination.id}>
                  <div className="destination-photo"><Image src={`/explore/${destination.id}.jpg`} alt={`${destination.name}, ${destination.country}`} fill sizes="(max-width:520px) 100vw,(max-width:900px) 50vw,33vw" /><StatusBadge>{destination.difficulty}</StatusBadge></div>
                  <div className="destination-summary"><div className="destination-meta"><span>{destination.country}</span><span>{destination.type}</span></div><h2>{destination.name}</h2><div className="destination-meta"><span>{destination.headline}</span><span>{destination.duration}</span></div><button className="button button-small" type="button" aria-expanded={open} aria-controls={`details-${destination.id}`} onClick={() => setExpanded(open ? null : destination.id)}>{open ? "Close details" : "Research this trek"}</button></div>
                  {open && <div className="destination-details" id={`details-${destination.id}`}><p>{destination.description}</p><dl className="facts"><div><dt>Typical duration</dt><dd>{destination.duration}</dd></div><div><dt>Common season</dt><dd>{destination.bestSeason}</dd></div></dl><iframe className="map-frame" title={`Google map for ${destination.name}`} src={mapsEmbedUrl(destination.query)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="cluster" style={{ marginTop:"var(--space-4)" }}><Link className="button button-primary button-small" href={`/plan?dest=${destination.id}`}><Map size={15} /> Use as plan starting point</Link><a className="button button-small" href={mapsDirectionsUrl(destination.query)} target="_blank" rel="noopener noreferrer">Directions <ExternalLink size={14} /></a><a className="button button-small" href={mapsSearchUrl(destination.query)} target="_blank" rel="noopener noreferrer">Google Maps <ExternalLink size={14} /></a></div><p className="photo-credit">Photo: {credit.author} / {credit.licenseUrl ? <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">{credit.license}</a> : credit.license} / <a href={credit.source} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></p></div>}
                </article>;
              })}
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}


