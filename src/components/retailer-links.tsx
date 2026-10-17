import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { campaRetailers } from "@/lib/retailers";

export default function RetailerLinks({ variant = "dialog" }: { variant?: "dialog" | "inline" }) {
  return <div className={`retailer-destinations retailer-destinations-${variant}`} aria-label="Find Campa at online retailers">
    {campaRetailers.map(retailer => <a key={retailer.id} className={`retailer-option retailer-option-${retailer.id}`} style={{ "--retailer-accent": retailer.accent } as CSSProperties} href={retailer.href} target="_blank" rel="noopener noreferrer" aria-label={`${retailer.name}: ${retailer.description} (opens in a new tab)`}>
      <span className="retailer-option-top"><span className="retailer-name">{retailer.name}</span><ArrowUpRight size={18} /></span>
      <span className="retailer-description">{retailer.description}</span>
    </a>)}
  </div>;
}
