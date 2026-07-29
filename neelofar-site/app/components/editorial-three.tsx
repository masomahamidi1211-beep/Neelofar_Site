import Link from "next/link";
import type { BaruArticle } from "./article-box";
import StaggerGrid from "./stagger-grid";

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
    <StaggerGrid className="grid grid-cols-1 divide-y divide-[#d4d4d4] bg-[#f0f0f0] sm:grid-cols-[1.5fr_1fr_1fr] sm:divide-x sm:divide-x-reverse sm:divide-y-0">
      <Column article={featured} isFeatured />
      <Column article={regular[0]} />
      <Column article={regular[1]} />
    </StaggerGrid>
  );
}

function Column({ article, isFeatured = false }: { article: BaruArticle; isFeatured?: boolean }) {
  const href = `/notes/${article.slug}`;

  return (
    <Link href={href} className="group flex flex-col p-6 sm:p-7">
      {article.image && (
        <div className="aspect-[3/2] w-full overflow-hidden sm:aspect-auto sm:h-[220px]">
          <img
            src={article.image}
            alt={article.imageAlt ?? ""}
            className="h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: article.imagePosition ?? DEFAULT_POSITION }}
          />
        </div>
      )}
      <h3
        className={`article-title mt-4 text-black transition duration-200 group-hover:text-[var(--title)] ${
          isFeatured ? "text-3xl" : "text-2xl"
        }`}
      >
        {article.title}
      </h3>
      <p className="article-author mt-2 text-base text-[var(--muted)]">{article.author}</p>
      <p
        className={`article-body justified-fa mt-4 text-[17px] leading-[1.9] text-[#4a4a4a] ${
          isFeatured ? "line-clamp-[9]" : "line-clamp-[16]"
        }`}
      >
        {article.excerpt} <span className="font-semibold whitespace-nowrap text-black">ادامه‌ی مطلب ←</span>
      </p>
    </Link>
  );
}
