import { Mountain } from "lucide-react";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="TrailDesk home">
      <span className="brand-mark" aria-hidden="true"><Mountain size={20} strokeWidth={1.8} /></span>
      {!compact && <span className="brand-name">TrailDesk</span>}
    </span>
  );
}
