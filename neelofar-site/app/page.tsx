import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { IssuePoster } from "./components/issue-poster";
import { EditorialThree } from "./components/editorial-three";
import { DownloadBar } from "./components/download-bar";
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
const EDITORIAL_FEATURED_SLUG = "تا-رسم-نابجا-را-بجا-کنیم";
const EDITORIAL_REGULAR_SLUGS: [string, string] = [
  "زندگی-در-جنگ-و-زندگی-در-فرار-از-جنگ",
  "خرمن-دشت-از-ما-گذشت",
];
const HORIZONTAL_SLUGS = ["لباس-پسرانه-میپوشیدم-و-عین-پسرها-رفتار-میکردم", "بچیم-زن-زود-پیر-میشه", "از-نسلی-به-نسل-دیگر-و-از-جنگی-به-جنگ"];
const MOSAIC_TEXT_SLUGS = ["الکسیویچخوانی-در-مزار", "آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است"];
const MOSAIC_CREAM_SLUG = "افغانستان-بدون-الکسیویچ-و-ضرورت-ادبیات-مستند";
const MOSAIC_PHOTO_SLUGS = ["شاهکار-یا-دروغپردازی-گزارشی-درباب-حواشی-تاکتیکها-و", "یادداشتهایی-از-بامیان-و-مزار-شریف-درباره-کتاب-جنگ-چهرهی"];
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

  const editorialSlugs = pickUnique([EDITORIAL_FEATURED_SLUG, ...EDITORIAL_REGULAR_SLUGS]);
  const editorialFeatured = editorialSlugs.includes(EDITORIAL_FEATURED_SLUG) ? get(EDITORIAL_FEATURED_SLUG) : undefined;
  const editorialRegular = EDITORIAL_REGULAR_SLUGS.filter((s) => editorialSlugs.includes(s))
    .map(get)
    .filter((a): a is Article => Boolean(a));

  const horizontal = pickUnique(HORIZONTAL_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const mosaicText = pickUnique(MOSAIC_TEXT_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const mosaicCream = pickUnique([MOSAIC_CREAM_SLUG]).map(get).filter((a): a is Article => Boolean(a))[0];
  const mosaicPhoto = pickUnique(MOSAIC_PHOTO_SLUGS).map(get).filter((a): a is Article => Boolean(a));
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
      {editorialFeatured && editorialRegular.length === 2 && (
        <ScrollReveal>
          <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
            <h2 className="mb-3 text-2xl font-bold text-[var(--title)]">هشت گفتگو: هزار زندگی (ادامه)</h2>
            <EditorialThree
              featured={toBaru(editorialFeatured, [90, 160])}
              regular={[
                toBaru(editorialRegular[0], [260, 440]),
                toBaru(editorialRegular[1], [260, 440]),
              ]}
            />
          </section>
        </ScrollReveal>
      )}

      {/* --- Section C: small horizontal cards row (orders 8-10) --- */}
      <ScrollReveal>
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {horizontal.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="horizontal-small" />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* --- Section D: the main mosaic (orders 11-15) --- */}
      <ScrollReveal>
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {mosaicText.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="text" />
            ))}
            {mosaicCream && <ArticleBox article={toBaru(mosaicCream)} variant="cream" />}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mosaicPhoto.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="photo-top" />
            ))}
          </div>
        </section>
      </ScrollReveal>

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

      {/* --- Section F: publication / download block --- */}
      <ScrollReveal>
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="article-box grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col bg-[var(--tan)]">
              <div className="flex flex-1 items-center justify-center p-10">
                <svg
                  aria-hidden="true"
                  width="88"
                  height="88"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M32 54c0-12 6-20 6-20s6 8 6 20" />
                  <path d="M20 46c4-10 12-14 18-12" />
                  <path d="M44 46c-4-10-12-14-18-12" />
                  <path d="M14 40c6-8 16-10 24-6" />
                  <path d="M50 40c-6-8-16-10-24-6" />
                  <path d="M38 54h-4" />
                </svg>
              </div>
              <DownloadBar href="/docs/rahnama-entekhab-roman.pdf" label="دانلود راهنما (PDF)" />
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-xs font-semibold tracking-[0.15em] text-[var(--muted)]">راهنما</p>
              <h2 className="mt-2 text-2xl font-bold leading-snug text-[var(--title)] sm:text-3xl">
                راهنمای انتخاب رمان
              </h2>
              <p className="justified-fa mt-5 text-[15px] text-[var(--ink)]">
                در زمانه‌ای که صنعت چاپ بی‌وقفه و بی‌توجه به کیفیت اثر، مدام کتاب چاپ می‌کند، تفکیک رمان/مجموعه
                داستان درخشان از اثر معمولی به هنر دشواری تبدیل شده است. راهنمای نیلوفر برای انتخاب رمان خوب،
                آماده‌ی مطالعه و دانلود است.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
