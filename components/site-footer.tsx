import Link from "next/link";
import { BrandLogo } from "./brand-logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <BrandLogo />
          <p>A practical planning workspace for researching and preparing African treks.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/explore">Explore</Link><Link href="/plan">Plan</Link><Link href="/trips">Trips</Link><Link href="/gear">Gear</Link>
        </nav>
        <p className="footer-note">Planning aid only. Confirm permits, access, weather, guide requirements, and safety advice with the relevant park authority.</p>
      </div>
    </footer>
  );
}
