import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
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
