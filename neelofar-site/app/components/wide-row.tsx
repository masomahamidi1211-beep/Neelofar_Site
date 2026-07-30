import Link from "next/link";
import { AuthorLine } from "./author-line";
import type { BaruArticle } from "./article-box";

const DEFAULT_POSITION = "50% 20%";

/**
 * A full-width row: fixed square photo at one end, text filling the
 * rest. Meant to be stacked inside a `divide-y divide-[#d4d4d4]
 * bg-[#f0f0f0]` wrapper so consecutive rows share a hairline with zero
 * gap, matching the site's other zero-gap editorial blocks.
 *
 * DOM order is [image, text] so that on mobile (flex-col) the image
 * naturally lands on top -- the `order` utilities then flip the visual
 * position at sm+: text becomes order-1 (placed first along the RTL
 * inline-start, i.e. the right) and image becomes order-2 (placed
 * second, landing at the left), without needing different DOM order
 * per breakpoint.
 */
export function WideRow({ article, className = "" }: { article: BaruArticle; className?: string }) {
  const href = `/notes/${article.slug}`;
  return (
    <Link href={href} className={`group flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6 ${className}`}>
      {article.image && (
        <div className="order-1 aspect-[4/3] w-full shrink-0 overflow-hidden sm:order-2 sm:aspect-square sm:h-[240px] sm:w-[240px]">
          <img
            src={article.image}
            alt={article.imageAlt ?? ""}
            className="h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: article.imagePosition ?? DEFAULT_POSITION }}
          />
        </div>
      )}
      <div className="order-2 min-w-0 flex-1 sm:order-1">
        <AuthorLine author={article.author} />
        <h3 className="article-title mt-1 text-2xl text-black transition duration-200 group-hover:text-[var(--title)] sm:text-3xl">
          {article.title}
        </h3>
        {article.subtitle && (
          <div className="article-author mt-1 space-y-0.5 text-base text-[#6b6b6b]">
            {article.subtitle.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
        <p className="article-body justified-fa mt-3 line-clamp-[7] text-[17px] leading-[1.9] text-[#4a4a4a]">
          {article.excerpt} <span className="font-semibold whitespace-nowrap text-black">ادامه‌ی مطلب ←</span>
        </p>
      </div>
    </Link>
  );
}
