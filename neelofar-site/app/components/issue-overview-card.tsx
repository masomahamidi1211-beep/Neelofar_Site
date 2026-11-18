import Link from "next/link";

/**
 * One special issue on the ویژه‌نامه‌ها landing page: a cream card that opens
 * the issue's own page. The whole card is a single link.
 */
export function IssueOverviewCard({
  href,
  title,
  subtitle,
  meta,
  summary,
  image,
  imagePosition,
}: {
  href: string;
  title: string;
  subtitle: string;
  meta: string;
  summary: string;
  image: string;
  imagePosition?: string;
}) {
  return (
    <Link
      href={href}
      className="baru-focus group flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#d8ccbc] bg-[#f3ede2] p-5 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-6"
    >
      <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: imagePosition ?? "50% 40%" }}
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
