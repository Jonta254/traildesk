import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ComparisonActions } from "@/components/comparison-actions";
import { DESTINATIONS, type Destination } from "@/app/lib/destinations";
import { comparisonDestinations } from "@/app/lib/comparison";
import { PHOTO_CREDITS } from "@/app/lib/photo-credits";
import "./compare.css";

export const metadata: Metadata = {
  title: "Compare destinations",
  description: "Compare up to three real trekking destinations by duration, season, terrain, water, access and preparation needs.",
  robots: { index: false, follow: true },
};

const metrics: { label: string; value: (destination: Destination) => string }[] = [
  { label: "Route type", value: d => d.routeType },
  { label: "Typical duration", value: d => d.typicalDuration },
  { label: "Distance", value: d => d.distance },
  { label: "Highest point", value: d => d.highestPoint },
  { label: "Difficulty", value: d => d.difficulty },
  { label: "Season", value: d => d.seasonSummary },
  { label: "Terrain", value: d => d.terrain.join(" · ") },
  { label: "Water planning", value: d => d.waterNote },
  { label: "Weather", value: d => d.weatherNote },
  { label: "Altitude", value: d => d.altitudeNote },
  { label: "Permits & access", value: d => d.permitNote },
  { label: "Guide requirements", value: d => d.guideNote },
  { label: "Accommodation", value: d => d.accommodationStyle },
];

export default async function ComparePage({ searchParams }: {
  searchParams: Promise<{ route?: string | string[] }>;
}) {
  const query = await searchParams;
  const selected = comparisonDestinations(query.route);
  const catalogue = [...DESTINATIONS].sort((a, b) => a.name.localeCompare(b.name));
  return <AppShell><main id="main-content" className="compare-page">
    <header className="page-header"><div className="container">
      <p className="eyebrow">Choose with context</p>
      <h1>Which trail fits your trip?</h1>
      <p className="lede">Compare up to three destinations. Look beyond the summit: time, terrain, water and access can change what your group needs to prepare.</p>
      <Link href="/explore">Back to all destinations</Link>
    </div></header>
    <section className="container" aria-labelledby="choose-heading">
      <h2 id="choose-heading">Choose your routes</h2>
      <form action="/compare" method="get" className="compare-form">
        {[0, 1, 2].map(index => <div className="field" key={index}>
          <label htmlFor={`route-${index}`}>Destination {index + 1}{index === 2 ? " · optional" : ""}</label>
          <select id={`route-${index}`} name="route" defaultValue={selected[index]?.id ?? ""}>
            <option value="">Choose a destination</option>
            {catalogue.map(d => <option value={d.id} key={d.id}>{d.name} · {d.country}</option>)}
          </select>
        </div>)}
        <button type="submit" className="button button-primary">Compare routes</button>
      </form>
      {selected.length < 2 ? <div className="empty-state"><h3>Choose at least two different destinations.</h3><p>Select another route above to see its preparation needs alongside your first choice.</p></div> : <>
        <div className="compare-introduction"><p>Comparing {selected.map(d => d.name).join(" · ")}</p><ComparisonActions /></div>
        <p id="compare-scroll-hint" className="compare-scroll-hint">On smaller screens, scroll the comparison sideways to see every route.</p>
        <div className="compare-table-wrap" role="region" aria-label="Destination comparison" aria-describedby="compare-scroll-hint" tabIndex={0}>
          <table className="compare-table">
            <caption className="sr-only">Destination facts and preparation requirements</caption>
            <thead><tr><th scope="col">Planning question</th>{selected.map(d => {
              const credit = PHOTO_CREDITS[d.id];
              return <th scope="col" key={d.id}>
                {d.image ? <Image src={d.image} alt={d.imageAlt} width={520} height={340} sizes="(max-width: 700px) 280px, 30vw" /> : null}
                <p className="compare-country">{d.country}</p>
                <h2><Link href={`/explore/${d.slug}`}>{d.name}</Link></h2>
                {credit ? <p className="compare-credit"><a href={credit.source} target="_blank" rel="noreferrer">{credit.author}</a> · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a></p> : null}
              </th>;
            })}</tr></thead>
            <tbody>{metrics.map(metric => <tr key={metric.label}><th scope="row">{metric.label}</th>{selected.map(d => <td key={d.id}>{metric.value(d) || "Confirm with the responsible authority."}</td>)}</tr>)}
              <tr><th scope="row">Official sources</th>{selected.map(d => <td key={d.id}><ul>{d.officialSources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul><p className="compare-reviewed">Catalogue reviewed: {d.lastReviewedAt}</p></td>)}</tr>
              <tr><th scope="row">Next step</th>{selected.map(d => <td key={d.id}><Link className="button button-primary button-small" href={`/plan?from=${d.id}`}>Plan this trip</Link><p><Link href={`/explore/${d.slug}`}>Read the full guide</Link></p></td>)}</tr>
            </tbody>
          </table>
        </div>
        <p className="compare-context">Difficulty describes the general route, not your group’s readiness. Confirm current conditions, exact itinerary, permits and guide requirements with each destination’s responsible authority.</p>
      </>}
    </section>
  </main></AppShell>;
}
