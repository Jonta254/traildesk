"use client";
import { AppShell } from "@/components/app-shell";

export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <AppShell><main id="main-content" className="container narrow section"><p className="eyebrow">Unexpected error</p><h1>TrailDesk could not open this view.</h1><p className="lede">Your locally saved plans have not been intentionally changed. Try the view again.</p><button className="button button-primary" onClick={reset}>Try again</button></main></AppShell>}
