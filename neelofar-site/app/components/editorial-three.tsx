import Link from "next/link";
import type { BaruArticle } from "./article-box";

const DEFAULT_POSITION = "50% 20%";

/**
 * The homepage's three-column editorial block: one solid #f0f0f0 slab,
 * zero gaps, 1px #d4d4d4 hairlines between columns instead of individual
 * card borders. The first column in DOM order sits at 1.5x width and,
 * under the site's RTL direction, lands on the right (grid track 1 is
 * inline-start, which is the right edge in RTL) -- exactly the "featured
 * column is rightmost" layout, with no RTL-specific overrides needed.
 *
 * The featured column carries a bigger title/photo and a shorter excerpt;
 * the two regular columns have smaller photos (same ratio, narrower box)
 * and a longer excerpt -- that's deliberate, not a mistake: the narrower
 * photo is shorter in absolute pixels, leaving more vertical room for
 * text, which is what actually keeps all three columns bottom-aligned.
 */
export function EditorialThree({ featured, regular }: { featured: BaruArticle; regular: [BaruArticle, BaruArticle] }) {
  return (
    <div className="grid grid-cols-1 divide-y divide-[#d4d4d4] bg-[#f0f0f0] sm:grid-cols-[1.5fr_1fr_1fr] sm:divide-x sm:divide-x-reverse sm:divide-y-0">
      <Column article={featured} isFeatured />
      <Column article={regular[0]} />
      <Column article={regular[1]} />
    </div>
  );
}

function Column({ article, isFeatured = false }: { article: BaruArticle; isFeatured?: boolean }) {
  const href = `/notes/${article.slug}`;
  const photo = article.image && (
    <img
      src={article.image}
      alt={article.imageAlt ?? ""}
      className={`w-full object-cover aspect-[3/2] ${isFeatured ? "" : "mt-3"}`}
      style={{ objectPosition: article.imagePosition ?? DEFAULT_POSITION }}
    />
  );

  return (
    <Link href={href} className="group flex flex-col p-6 sm:p-7">
      {isFeatured && photo}
      <h3 className={`font-bold text-black ${isFeatured ? "mt-4 text-2xl" : "text-xl"}`}>{article.title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{article.author}</p>
      {!isFeatured && photo}
      <p
        className={`justified-fa mt-4 text-[15px] leading-[1.9] text-[#4a4a4a] ${
          isFeatured ? "line-clamp-[9]" : "line-clamp-[16]"
        }`}
      >
        {article.excerpt} <span className="font-semibold whitespace-nowrap text-black">ادامه‌ی مطلب ←</span>
      </p>
    </Link>
  );
}
