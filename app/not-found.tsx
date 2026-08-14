import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function NotFound(){return <AppShell><main id="main-content" className="container narrow section"><p className="eyebrow">404</p><h1>That trail ends here.</h1><p className="lede">The page you requested does not exist.</p><Link className="button button-primary" href="/explore">Return to Explore</Link></main></AppShell>}
