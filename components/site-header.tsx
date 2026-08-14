"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "./brand-logo";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/trips", label: "My trips" },
  { href: "/gear", label: "Gear lists" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-link" onClick={() => setOpen(false)}><BrandLogo /></Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((value) => !value)}>
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="primary-nav" className={`primary-nav${open ? " is-open" : ""}`} aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>
          ))}
          <Link href="/plan" className="button button-primary button-small" aria-current={pathname === "/plan" ? "page" : undefined} onClick={() => setOpen(false)}>
            <Plus size={16} aria-hidden="true" /> Plan a trip
          </Link>
        </nav>
      </div>
    </header>
  );
}
