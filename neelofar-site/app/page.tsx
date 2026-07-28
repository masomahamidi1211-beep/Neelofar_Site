import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { IssuePoster } from "./components/issue-poster";
import { EditorialThree } from "./components/editorial-three";
import { WideRow } from "./components/wide-row";
import ScrollReveal from "./components/scroll-reveal";

// The 18 articles of the ویژه‌نامه, curated once into sections below.
// Every slug appears in exactly one list -- pickUnique() (same per-render
// safeguard used elsewhere on this site) enforces that at render time too.
//
// HERO_LIST_COUNT is NOT a slug list: the hero's stacked rows must always
// start with the section-intro piece (هشت‌گفتگو, order 2) and then follow
// the ویژه‌نامه's own order (Article.order, sorted by getAllArticles())
// -- never a hardcoded title list, so a future article slots in correctly
// just by its order number. Kept to 3 (orders 2-4) so the list's height
// roughly matches the سرسخن hero image beside it; orders 5-7 move into
// their own three-column editorial block right below instead.
const HERO_LIST_COUNT = 3;
// Two identically-styled editorial blocks (see EditorialSection below),
// covering orders 5-7 and 8-10 -- the rest of هشت گفتگو after the hero
// list's first three rows.
const EDITORIAL_1_FEATURED_SLUG = "تا-رسم-نابجا-را-بجا-کنیم";
const EDITORIAL_1_REGULAR_SLUGS: [string, string] = [
  "زندگی-در-جنگ-و-زندگی-در-فرار-از-جنگ",
  "خرمن-دشت-از-ما-گذشت",
];
const EDITORIAL_2_FEATURED_SLUG = "لباس-پسرانه-میپوشیدم-و-عین-پسرها-رفتار-میکردم";
const EDITORIAL_2_REGULAR_SLUGS: [string, string] = [
  "بچیم-زن-زود-پیر-میشه",
  "از-نسلی-به-نسل-دیگر-و-از-جنگی-به-جنگ",
];
const MOSAIC_TEXT_SLUGS = ["الکسیویچخوانی-در-مزار", "آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است"];
const MOSAIC_CREAM_SLUG = "افغانستان-بدون-الکسیویچ-و-ضرورت-ادبیات-مستند";
// Full-width WideRow pair (orders 14-15), replacing the old vertical
// photo-top cards for these two.
const WIDE_ROW_SLUGS = ["شاهکار-یا-دروغپردازی-گزارشی-درباب-حواشی-تاکتیکها-و", "یادداشتهایی-از-بامیان-و-مزار-شریف-درباره-کتاب-جنگ-چهرهی"];
const PORTRAIT_SLUGS = ["لندی-مویه-زنان-پشتون-است", "قصهی-مریم-و-همباغش", "بیستو-پنجسال-در-خدمت-صداهای-جنوب-جهانی"];

// Crop for the hero poster only -- deliberately not read from the سرسخن
// article's own imagePosition, so this block can be tuned independently
// without touching that article, its page, or its card image anywhere
// else on the site. Title/credit/excerpt are pulled from the article's
// real data instead of hardcoded, so they can't drift out of sync with it.
const POSTER_IMAGE_POSITION = "50% 10%";

function createSlugPicker() {
  const used = new Set<string>();
  return {
    pickUnique(slugs: string[]): string[] {
      return slugs.filter((slug) => {
        if (used.has(slug)) return false;
        used.add(slug);
        return true;
      });
    },
  };
}

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [90, 160]
): BaruArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article, excerptBounds[0], excerptBounds[1]),
    date: toPersianDigits(article.jalaliDate.replace(/-/g, "/")),
    image: article.image,
    imagePosition: article.imagePosition,
    imageAlt: article.imageAlt,
  };
}

/**
 * Both three-column editorial blocks on the homepage share this exact
 * shell (optional heading + EditorialThree), so they can't drift apart
 * in style -- there is only one place that renders the section/heading
 * wrapper, and EditorialThree itself is already generic over its 3
 * articles.
 */
function EditorialSection({
  heading,
  featured,
  regular,
}: {
  heading?: string;
  featured: Article;
  regular: [Article, Article];
}) {
  return (
    <ScrollReveal>
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {heading && <h2 className="mb-3 text-2xl font-bold text-[var(--title)]">{heading}</h2>}
        <EditorialThree
          featured={toBaru(featured, [90, 160])}
          regular={[toBaru(regular[0], [260, 440]), toBaru(regular[1], [260, 440])]}
        />
      </section>
    </ScrollReveal>
  );
}

// Resolves a featured+regular trio through pickUnique, so a slug that's
// somehow already claimed elsewhere is dropped instead of duplicated,
// mirroring how every other section on this page stays safe against
// accidental double-claims.
function resolveEditorialTrio(
  pickUnique: (slugs: string[]) => string[],
  get: (slug: string) => Article | undefined,
  featuredSlug: string,
  regularSlugs: [string, string]
): { featured: Article; regular: [Article, Article] } | null {
  const claimed = pickUnique([featuredSlug, ...regularSlugs]);
  const featured = claimed.includes(featuredSlug) ? get(featuredSlug) : undefined;
  const regular = regularSlugs.filter((s) => claimed.includes(s)).map(get).filter((a): a is Article => Boolean(a));
  if (!featured || regular.length !== 2) return null;
  return { featured, regular: [regular[0], regular[1]] };
}

export default function HomePage() {
  const articles = getAllArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const get = (slug: string) => bySlug.get(slug);

  const { pickUnique } = createSlugPicker();

  // Everything except سرسخن (poster-only), already sorted by order via
  // getAllArticles() -- so the hero list's own order falls straight out
  // of each article's `order` field instead of being hand-picked here.
  const heroListSlugs = articles
    .filter((a) => a.slug !== "سرسخن")
    .slice(0, HERO_LIST_COUNT)
    .map((a) => a.slug);
  const heroList = pickUnique(heroListSlugs).map(get).filter((a): a is Article => Boolean(a));

  const editorial1 = resolveEditorialTrio(pickUnique, get, EDITORIAL_1_FEATURED_SLUG, EDITORIAL_1_REGULAR_SLUGS);
  const editorial2 = resolveEditorialTrio(pickUnique, get, EDITORIAL_2_FEATURED_SLUG, EDITORIAL_2_REGULAR_SLUGS);

  const mosaicText = pickUnique(MOSAIC_TEXT_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const mosaicCream = pickUnique([MOSAIC_CREAM_SLUG]).map(get).filter((a): a is Article => Boolean(a))[0];
  const wideRows = pickUnique(WIDE_ROW_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const portrait = pickUnique(PORTRAIT_SLUGS).map(get).filter((a): a is Article => Boolean(a));

  const sarsokhan = get("سرسخن");

  return (
    <div className="bg-[var(--bg)]">
      {/* --- Section A: split hero --- */}
      {/* Divider sits on the outer, unpadded section so it touches the
          frame's side borders edge-to-edge; padding lives on the inner
          grid instead. */}
      <ScrollReveal>
        <section className="border-t border-[var(--line)]">
          <div className="grid grid-cols-1 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:divide-x lg:divide-x-reverse lg:divide-[#d4d4d4] lg:px-8 lg:py-14">
            <div className="lg:pl-10">
              {sarsokhan && (
                <IssuePoster
                  href="/notes/سرسخن"
                  image={sarsokhan.image ?? ""}
                  imagePosition={POSTER_IMAGE_POSITION}
                  imageAlt={sarsokhan.title}
                  title={sarsokhan.title}
                  credit={sarsokhan.author}
                  excerpt={longExcerptOf(sarsokhan, 60, 110)}
                />
              )}
            </div>
            {/* bg-[#f9f9f9] so the ~15px gaps between rows read as canvas,
                matching the rows' own borderless #f0f0f0-on-canvas look,
                not the page's white background. */}
            <div className="grid grid-cols-1 gap-[15px] bg-[#f9f9f9] lg:pr-2">
              {heroList.map((a) => (
                <ArticleBox key={a.slug} article={toBaru(a)} variant="list" />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* --- Section B: three-column editorial (orders 5-7) --- */}
      {editorial1 && (
        <EditorialSection
          heading="هشت گفتگو: هزار زندگی (ادامه)"
          featured={editorial1.featured}
          regular={editorial1.regular}
        />
      )}

      {/* --- Section C: three-column editorial (orders 8-10) --- */}
      {/* No heading -- this is a direct continuation of Section B (same
          هشت گفتگو section), and repeating the heading right below itself
          would read as a duplicate rather than distinct content. */}
      {editorial2 && <EditorialSection featured={editorial2.featured} regular={editorial2.regular} />}

      {/* --- Section D: the main mosaic (orders 11-13) --- */}
      <ScrollReveal>
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {mosaicText.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="text" />
            ))}
            {mosaicCream && <ArticleBox article={toBaru(mosaicCream)} variant="cream" />}
          </div>
        </section>
      </ScrollReveal>

      {/* --- Section D.5: wide rows (orders 14-15) --- */}
      {wideRows.length > 0 && (
        <ScrollReveal>
          <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
            <div className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
              {wideRows.map((a) => (
                <WideRow key={a.slug} article={toBaru(a, [90, 160])} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* --- Section E: illustrated portrait row (orders 16-18) --- */}
      <ScrollReveal>
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {portrait.map((a, i) => (
              <ArticleBox
                key={a.slug}
                article={toBaru(a)}
                variant="photo-top"
                tone={i === 2 ? "cream" : "tan"}
                authorFirst
              />
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
