import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "@/components/effects.css";
import "./campaign.css";
import "@/components/brand-journey.css";
import "./product-duos.css";
import "./motion-polish.css";

export const metadata: Metadata = {
  title: "Campa — Born Original. | Jio Creativity Labs",
  description: "An Indian original. An all-new energy. A creative Campa brand experience by Jio Creativity Labs. Explore the flavour universe and find your kind of good time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
