import { ReactNode } from "react";

/**
 * A brief fade between route changes instead of an instant hard cut.
 * Mount this keyed by pathname (see SiteShell) so React remounts it -- and
 * the CSS animation (.page-fade in globals.css) runs again -- on every
 * navigation. Pure CSS: the page is visible as soon as the HTML arrives,
 * without waiting for JavaScript (it used to stay at opacity 0 until React
 * had loaded, which delayed the first paint by about a second).
 */
export default function PageFade({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
