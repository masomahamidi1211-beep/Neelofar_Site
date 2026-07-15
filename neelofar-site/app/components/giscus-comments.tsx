"use client";

import Script from "next/script";

// Replace these with real values from https://giscus.app once the repo has the
// giscus GitHub App installed. Until then, we intentionally skip loading the
// client script -- it makes a live request to giscus.app that fails loudly in
// the console/error overlay for a repo that doesn't exist.
const GISCUS_REPO = "neelofar/placeholder";
const GISCUS_REPO_ID = "MDEwOlJlcG9zaXRvcnkxMjM0NTY3OA==";
const GISCUS_CATEGORY = "Announcements";
const GISCUS_CATEGORY_ID = "DIC_kwDOAAAAAB4B-xyz";
const GISCUS_CONFIGURED = !GISCUS_REPO.endsWith("/placeholder");

export default function GiscusComments() {
  return (
    <div className="mt-6 border border-[var(--hairline)] p-6">
      <div className="text-sm text-[#6b6b6b]">
        این بخش برای بارگذاری نظرات با Giscus آماده است. برای فعال‌سازی، مقادیر `GISCUS_REPO` و
        `GISCUS_REPO_ID` را در این فایل با مقادیر واقعی جایگزین کنید.
      </div>
      <div className="mt-6 border border-[var(--hairline)]" id="giscus-container" />
      {GISCUS_CONFIGURED && (
        <Script
          src="https://giscus.app/client.js"
          data-repo={GISCUS_REPO}
          data-repo-id={GISCUS_REPO_ID}
          data-category={GISCUS_CATEGORY}
          data-category-id={GISCUS_CATEGORY_ID}
          data-mapping="pathname"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="light"
          data-lang="fa"
          strategy="lazyOnload"
          async
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}
