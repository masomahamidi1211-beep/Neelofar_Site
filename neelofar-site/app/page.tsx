import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { IssuePoster } from "./components/issue-poster";
import { EditorialThree } from "./components/editorial-three";
import { WideRow } from "./components/wide-row";
import ScrollReveal from "./components/scroll-reveal";
import StaggerGrid from "./components/stagger-grid";

// The 17 articles of the ویژه‌نامه, curated once into sections below.
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
const EDITORIAL_1_FEATURED_DOODLE = { src: "/images/logo-05.png", alt: "نشان تزئینی" };
const EDITORIAL_1_REGULAR_SLUGS: [string, string] = [
  "زندگی-در-جنگ-و-زندگی-در-فرار-از-جنگ",
  "خرمن-دشت-از-ما-گذشت",
];
const EDITORIAL_2_FEATURED_SLUG = "لباس-پسرانه-میپوشیدم-و-عین-پسرها-رفتار-میکردم";
const EDITORIAL_2_FEATURED_DOODLE = { src: "/images/logo-03.png", alt: "نشان تزئینی نیلوفر" };
const EDITORIAL_2_REGULAR_SLUGS: [string, string] = [
  "بچیم-زن-زود-پیر-میشه",
  "از-نسلی-به-نسل-دیگر-و-از-جنگی-به-جنگ",
];
// Full-width WideRow sitting directly above the mosaic (Section D) --
// topically unrelated to الکسیویچ (it's about حسین فخری), so it isn't part
// of that curated trio, just positioned immediately before it.
const PRE_MOSAIC_WIDE_ROW_SLUG = "چرا-حسین-فخری-حافظهی-ادبیات-افغانستان-است";
const MOSAIC_SLUGS = [
  "الکسیویچخوانی-در-مزار",
  "آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است",
  "افغانستان-بدون-الکسیویچ-و-ضرورت-ادبیات-مستند",
];
// The 16:9 photo-top crop is much shorter than the square crop these same
// images use on the special-issue grid, so the shared frontmatter
// imagePosition (tuned for the square crop) needs its own override here --
// same rationale as POSTER_IMAGE_POSITION. zan-23's default top-biased crop
// already works for both shapes, so it's left unset.
const MOSAIC_IMAGE_POSITIONS: Record<string, string> = {
  "الکسیویچخوانی-در-مزار": "50% 65%",
  "آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است": "50% 55%",
};
// Full-width WideRow pair (orders 14-15), replacing the old vertical
// photo-top cards for these two.
const WIDE_ROW_SLUGS = ["شاهکار-یا-دروغپردازی-گزارشی-درباب-حواشی-تاکتیکها-و", "یادداشتهایی-از-بامیان-و-مزار-شریف-درباره-کتاب-جنگ-چهرهی"];
const PORTRAIT_SLUGS = ["قصهی-مریم-و-همباغش", "بیستو-پنجسال-در-خدمت-صداهای-جنوب-جهانی"];

// Crop for the hero poster only -- deliberately not read from the سرسخن
// article's own imagePosition, so this block can be tuned independently
// without touching that article, its page, or its card image anywhere
// else on the site. Title/credit/excerpt are pulled from the article's
// real data instead of hardcoded, so they can't drift out of sync with it.
const POSTER_IMAGE_POSITION = "50% 60%";

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
  excerptBounds: [number, number] = [90, 160],
  // Same idea as POSTER_IMAGE_POSITION below: a card's own imagePosition is
  // shared with every other spot that image appears (the special-issue
  // grid uses a square crop), so a homepage slot needing a different crop
  // shape overrides it here instead of mutating the article's frontmatter.
  imagePositionOverride?: string
): BaruArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article, excerptBounds[0], excerptBounds[1]),
    date: toPersianDigits(article.jalaliDate.replace(/-/g, "/")),
    image: article.image,
    imagePosition: imagePositionOverride ?? article.imagePosition,
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
  featuredDoodle,
}: {
  heading?: string;
  featured: Article;
  regular: [Article, Article];
  featuredDoodle?: { src: string; alt: string };
}) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {heading && <h2 className="mb-3 text-3xl font-bold text-[var(--title)]">{heading}</h2>}
      <EditorialThree
        featured={toBaru(featured, [90, 160])}
        regular={[toBaru(regular[0], [260, 440]), toBaru(regular[1], [260, 440])]}
        featuredDoodle={featuredDoodle}
      />
    </section>
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

  const preMosaicWideRow = pickUnique([PRE_MOSAIC_WIDE_ROW_SLUG]).map(get).filter((a): a is Article => Boolean(a))[0];
  const mosaic = pickUnique(MOSAIC_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const wideRows = pickUnique(WIDE_ROW_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const portrait = pickUnique(PORTRAIT_SLUGS).map(get).filter((a): a is Article => Boolean(a));

  const sarsokhan = get("سرسخن");

  return (
    <div className="bg-[var(--bg)]">
      {/* --- Section A: split hero --- */}
      {/* Divider sits on the outer, unpadded section so it touches the
          frame's side borders edge-to-edge; padding lives on the inner
          grid instead. */}
      <section className="border-t border-[var(--line)]">
        <div className="grid grid-cols-1 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:divide-x lg:divide-x-reverse lg:divide-[#d4d4d4] lg:px-8 lg:py-14">
          <ScrollReveal className="lg:pl-10">
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
          </ScrollReveal>
          {/* bg-[#f9f9f9] so the ~15px gaps between rows read as canvas,
              matching the rows' own borderless #f0f0f0-on-canvas look,
              not the page's white background. */}
          <StaggerGrid className="grid grid-cols-1 gap-[15px] bg-[#f9f9f9] lg:pr-2">
            {heroList.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="list" />
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* --- Section B: three-column editorial (orders 5-7) --- */}
      {editorial1 && (
        <EditorialSection
          heading="هشت گفتگو: هزار زندگی (ادامه)"
          featured={editorial1.featured}
          regular={editorial1.regular}
          featuredDoodle={EDITORIAL_1_FEATURED_DOODLE}
        />
      )}

      {/* --- Section C: three-column editorial (orders 8-10) --- */}
      {/* No heading -- this is a direct continuation of Section B (same
          هشت گفتگو section), and repeating the heading right below itself
          would read as a duplicate rather than distinct content. */}
      {editorial2 && (
        <EditorialSection
          featured={editorial2.featured}
          regular={editorial2.regular}
          featuredDoodle={EDITORIAL_2_FEATURED_DOODLE}
        />
      )}

      {/* --- Wide row directly above Section D, same gray treatment as the
          الکسیویچ wide rows below (Section D.5) --- */}
      {preMosaicWideRow && (
        <section className="px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            <WideRow article={toBaru(preMosaicWideRow, [140, 260])} />
          </StaggerGrid>
        </section>
      )}

      {/* --- Section D: the main mosaic (orders 11-13) --- */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {mosaic.map((a) => (
            <ArticleBox
              key={a.slug}
              article={toBaru(a, [90, 160], MOSAIC_IMAGE_POSITIONS[a.slug])}
              variant="photo-top"
            />
          ))}
        </StaggerGrid>
      </section>

      {/* --- Section D.5: wide rows (orders 14-15) --- */}
      {wideRows.length > 0 && (
        <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            {wideRows.map((a) => (
              <WideRow key={a.slug} article={toBaru(a, [90, 160])} />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* --- Section E: illustrated portrait row (orders 17-18) --- */}
      {/* Two columns, not three -- لندی، مویه زنان پشتون است (the row's
          original third piece) was deleted, and stretching this back to a
          3-col grid would leave a permanent blank trailing cell instead of
          just sizing the row to what's actually here. */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {portrait.map((a, i) => (
            <ArticleBox
              key={a.slug}
              article={toBaru(a)}
              variant="photo-top"
              tone={i % 2 === 0 ? "tan" : "cream"}
              authorFirst
            />
          ))}
        </StaggerGrid>
      </section>
    </div>
  );
}
