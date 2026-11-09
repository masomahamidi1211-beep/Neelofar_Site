import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  poweredByHeader: false,
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
