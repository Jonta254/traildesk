import type { ReactNode } from "react";

export function StatusBadge({ tone = "neutral", children }: { tone?: "available" | "online" | "planned" | "neutral"; children: ReactNode }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}
