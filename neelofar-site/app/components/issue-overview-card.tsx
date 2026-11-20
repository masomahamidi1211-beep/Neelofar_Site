import Link from "next/link";

/**
 * One special issue on the ویژه‌نامه‌ها landing page: a cream card whose
 * cover, title and text open the issue's own page, with the PDF download
 * button underneath (a separate link -- links can't be nested).
 */
export function IssueOverviewCard({
  href,
  title,
  subtitle,
  meta,
  summary,
  cover,
  image,
  imagePosition,
  pdf,
}: {
  href: string;
  title: string;
  subtitle: string;
  meta: string;
  summary: string;
  /** First page of the PDF: shown whole (portrait) on a cream mat. */
  cover?: string;
  /** Fallback photo when there is no cover, cropped to the frame. */
  image: string;
  imagePosition?: string;
  pdf?: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#d8ccbc] bg-[#f3ede2] p-5 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-6">
      <Link href={href} className="baru-focus group flex flex-1 flex-col">
        <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-[#e7dcc8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover ?? image}
            alt={cover ? `جلد ${title}` : ""}
            className={
              cover
                ? "h-full w-full object-contain p-3 drop-shadow-md transition duration-300 ease-out group-hover:scale-[1.03]"
                : "h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
            }
            style={cover ? undefined : { objectPosition: imagePosition ?? "50% 40%" }}
          />
        </div>
        <p className="mt-5 text-sm text-[#5f574f]">{meta}</p>
        <h2 className="article-title mt-2 text-3xl leading-snug text-[var(--title)] transition duration-200 group-hover:text-[var(--accent)]">
          {title}
        </h2>
        <p className="mt-2 text-lg leading-8 text-[#4a423c]">{subtitle}</p>
        <p className="article-body mt-4 flex-1 text-[17px] leading-8 text-[var(--ink)]">{summary}</p>
        <span className="mt-5 inline-block text-base font-bold text-[#8c2222] underline-offset-4 group-hover:underline">
          مشاهده‌ی نوشته‌ها ←
        </span>
      </Link>
      {pdf && <DownloadPdfButton href={pdf} title={title} className="mt-5" />}
    </div>
  );
}

/** Downloads the whole special issue as a PDF. */
export function DownloadPdfButton({ href, title, className = "" }: { href: string; title: string; className?: string }) {
  return (
    <a
      href={href}
      download={`${title}.pdf`}
      className={`baru-focus inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#8c2222] bg-[#8c2222] px-5 py-3 text-base font-bold text-[#faf7f2] transition duration-200 hover:bg-[#6f1b1b] hover:text-[#faf7f2] ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14" />
      </svg>
      دانلود نسخه‌ی PDF ویژه‌نامه
    </a>
  );
}

/** Link at the top of each issue's page, back to the landing page. */
export function BackToIssues() {
  return (
    <Link
      href="/special"
      className="baru-focus inline-block rounded-lg border-2 border-[#d8ccbc] bg-[#f3ede2] px-4 py-2 text-base font-bold text-[#2a2421] transition duration-200 hover:shadow-md"
    >
      → بازگشت به ویژه‌نامه‌ها
    </Link>
  );
}
