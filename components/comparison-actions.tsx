"use client";

import { useState } from "react";

export function ComparisonActions() {
  const [message, setMessage] = useState("");
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Comparison link copied.");
    } catch {
      setMessage("Copy the address from your browser to share this comparison.");
    }
  }
  return <div className="comparison-actions">
    <button className="button button-small" type="button" onClick={copyLink}>Copy comparison link</button>
    <button className="button button-small" type="button" onClick={() => window.print()}>Print comparison</button>
    <p role="status">{message}</p>
  </div>;
}
