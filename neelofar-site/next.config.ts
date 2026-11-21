import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

function firstIssueRedirects() {
  const file = path.join(__dirname, "content", "vizhe-nameh-avval.json");
  const issue = JSON.parse(fs.readFileSync(file, "utf8")) as { pieces: { n: number; slug: string }[] };
  return issue.pieces.map((p) => ({
    source: `/special/vizhe-nameh-avval/${p.n}`,
    destination: encodeURI(`/notes/${p.slug}`),
    permanent: true,
  }));
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  poweredByHeader: false,
  // Put the (small, Tailwind) CSS straight into each page instead of a
  // separate render-blocking file: first-time visitors see the page sooner.
  experimental: { inlineCss: true },
  // Baseline security headers for every page. The CSP is deliberately
  // narrow -- it blocks other sites from framing this one, plugins, and
  // <base>/form hijacking -- and leaves script/style/frame sources open so
  // Next's inline scripts and the embedded forms/videos keep working.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Content editor (Decap CMS) lives at public/admin/index.html.
      { source: "/admin", destination: "/admin/index.html", permanent: false },
      // First special issue: its pieces used to open in a PDF reader at
      // /special/vizhe-nameh-avval/{n}; they are now regular article pages.
      ...firstIssueRedirects(),
      // سارا راخفوس interview: slug changed when the piece was retitled to
      // its real published title -- keep the old share links/bookmarks alive.
      {
        source: encodeURI("/notes/گفتگو-با-سارا-راخفوس-در-صنف-ادبیات-جهان"),
        destination: encodeURI("/notes/کوچهی-ما-تلاشی-برای-حفظ-زندگی-از-دسترفته"),
        permanent: true,
      },
      // «لندی، مویه زنان پشتون است» removed from the site entirely --
      // anyone who had the old URL bookmarked/shared lands on یادداشت‌ها
      // instead of a dead 404.
      {
        source: encodeURI("/notes/لندی-مویه-زنان-پشتون-است"),
        destination: "/notes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
