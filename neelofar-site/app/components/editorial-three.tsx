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
 * All three columns share the exact same element order: photo, title,
 * author, excerpt, read-more. On desktop (sm+) the photo gets a shared
 * FIXED height instead of a fixed aspect-ratio -- a wider column (the
 * featured one) and a narrower one (the regular two) can't both keep an
 * identical width:height ratio AND share the same top+bottom edge; a
 * wider box at the same ratio is necessarily taller. Since lining up the
 * photo row (and the titles starting right under it) is the more visibly
 * load-bearing requirement, height is what's held constant -- the photos
 * still crop with object-cover and still read as "the same treatment,
 * just wider for the featured column," just not a literal identical
 * ratio. On mobile, where columns stack full-width with no row to align,
 * each photo instead uses a plain aspect-[3/2].
 *
 * The featured column carries a bigger title and a shorter excerpt; the
 * two regular columns have a smaller title and a longer excerpt -- that
 * gap is what keeps all three columns bottom-aligned despite the shared
 * photo height and differing title sizes.
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

  return (
    <Link href={href} className="group flex flex-col p-6 sm:p-7">
      {article.image && (
        <img
          src={article.image}
          alt={article.imageAlt ?? ""}
          className="aspect-[3/2] w-full object-cover sm:aspect-auto sm:h-[220px]"
          style={{ objectPosition: article.imagePosition ?? DEFAULT_POSITION }}
        />
      )}
      <h3 className={`mt-4 font-bold text-black ${isFeatured ? "text-2xl" : "text-xl"}`}>{article.title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{article.author}</p>
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
