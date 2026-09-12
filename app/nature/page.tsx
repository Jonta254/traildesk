import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { DESTINATIONS } from "@/app/lib/destinations";
import { DESTINATION_GALLERY } from "@/app/lib/photo-credits";
import { NATURE_LESSONS } from "@/app/lib/nature";
import "./nature.css";

const featured = ["mount-kenya", "rwenzori", "simien", "fish-river", "longonot", "kilimanjaro"];
export default function NaturePage() {
  return <AppShell><main id="main-content"><header className="nature-hero"><div className="container"><p className="eyebrow">Field notes · responsible travel</p><h1>Read the landscape before you walk through it.</h1><p className="lede">A practical nature guide for noticing ground, water, weather and wildlife—and making decisions that keep the trail healthy for the next person.</p><Link className="button button-primary" href="/explore">Choose a destination</Link></div></header>
    <section className="container nature-intro"><p className="eyebrow">What to carry into the field</p><h2>Good planning includes the place itself.</h2><div className="nature-lessons">{NATURE_LESSONS.map((lesson,i)=><article className="nature-lesson" key={lesson.slug}><span className="lesson-index">0{i+1}</span><h3>{lesson.title}</h3><p className="lesson-principle">{lesson.principle}</p><p><strong>Notice</strong> {lesson.notice}</p><p><strong>Do</strong> {lesson.do}</p><a href={lesson.sourceUrl} target="_blank" rel="noreferrer">{lesson.sourceLabel} ↗</a></article>)}</div></section>
    <section className="nature-destinations"><div className="container"><p className="eyebrow">Learn by landscape</p><h2>Start with a real place.</h2><p className="section-lede">Open a destination guide for route facts, field photographs, access notes and preparation details from the shared TrailDesk source.</p><div className="nature-destination-grid">{featured.map(slug=>{const d=DESTINATIONS.find(x=>x.slug===slug); const photo=DESTINATION_GALLERY[slug]?.[0]; if(!d||!photo)return null; return <Link className="nature-destination" href={`/explore/${slug}`} key={slug}><Image src={photo.src} alt={photo.alt} width={720} height={480} sizes="(max-width: 700px) 100vw, 33vw"/><div><p>{d.country} · {d.routeType}</p><h3>{d.name}</h3><span>{d.difficulty} · {d.typicalDuration}</span></div></Link>})}</div></div></section>
    <section className="container nature-close"><div><p className="eyebrow">A useful final check</p><h2>Know the rules where you are going.</h2><p>TrailDesk helps you prepare a clear brief. It does not replace park notices, local guides, ranger advice, permits, weather services or emergency plans.</p></div><Link className="button" href="/readiness">Run a departure check</Link></section>
  </main></AppShell>;
}
