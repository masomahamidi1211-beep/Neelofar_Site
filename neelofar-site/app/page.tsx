import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { IssuePoster } from "./components/issue-poster";
import { DownloadBar } from "./components/download-bar";
import { SpotIllustration } from "./components/spot-illustration";
import ScrollReveal from "./components/scroll-reveal";

// The 18 articles of the ویژه‌نامه, curated once into sections A-F below.
// Every slug appears in exactly one list -- pickUnique() (same per-render
// safeguard used elsewhere on this site) enforces that at render time too.
const HERO_LIST_SLUGS = ["سرسخن", "سرگردانیهای-او-روزا", "قاب-عکسی-از-سالهال-دور", "تا-رسم-نابجا-را-بجا-کنیم"];
const MOSAIC_TEXT_SLUGS = ["الکسیویچخوانی-در-مزار", "آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است", "خرمن-دشت-از-ما-گذشت"];
const MOSAIC_CREAM_SLUG = "افغانستان-بدون-الکسیویچ-و-ضرورت-ادبیات-مستند";
const MOSAIC_PHOTO_SLUGS = ["زندگی-در-جنگ-و-زندگی-در-فرار-از-جنگ", "هشت-گفتگو"];
const HORIZONTAL_SLUGS = ["لباس-پسرانه-میپوشیدم-و-عین-پسرها-رفتار-میکردم", "بچیم-زن-زود-پیر-میشه", "از-نسلی-به-نسل-دیگر-و-از-جنگی-به-جنگ"];
const PORTRAIT_SLUGS = ["شاهکار-یا-دروغپردازی-گزارشی-درباب-حواشی-تاکتیکها-و", "یادداشتهایی-از-بامیان-و-مزار-شریف-درباره-کتاب-جنگ-چهرهی", "لندی-مویه-زنان-پشتون-است"];
const DARK_SLUGS = ["قصهی-مریم-و-همباغش", "بیستو-پنجسال-در-خدمت-صداهای-جنوب-جهانی"];

// Overlay title + crop for the hero poster only -- deliberately not read
// from the سرسخن article's own title/imagePosition, so this block can be
// tuned independently without touching that article, its page, or its
// card image anywhere else on the site.
const POSTER_TITLE = "مادران و خواهران: زندگی در جنگ و زندگی بعد از جنگ";
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

function seasonOf(jalaliDate: string): string {
  const month = Number(jalaliDate.split("-")[1] ?? "0");
  if (month <= 3) return "بهار";
  if (month <= 6) return "تابستان";
  if (month <= 9) return "پاییز";
  return "زمستان";
}

function toBaru(article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">): BaruArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article, 90, 160),
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

  const heroList = pickUnique(HERO_LIST_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const mosaicText = pickUnique(MOSAIC_TEXT_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const mosaicCream = pickUnique([MOSAIC_CREAM_SLUG]).map(get).filter((a): a is Article => Boolean(a))[0];
  const mosaicPhoto = pickUnique(MOSAIC_PHOTO_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const horizontal = pickUnique(HORIZONTAL_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const portrait = pickUnique(PORTRAIT_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const dark = pickUnique(DARK_SLUGS).map(get).filter((a): a is Article => Boolean(a));

  const sarsokhan = get("سرسخن");
  const contributors = Array.from(new Set(articles.map((a) => a.author)));

  return (
    <div className="bg-[var(--bg)]">
      {/* --- Section A: split hero --- */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-6 border-t border-[var(--line)] pt-8 lg:grid-cols-[45%_1fr] lg:gap-10 lg:divide-x lg:divide-x-reverse lg:divide-[var(--line)]">
            <div className="lg:pl-10">
              {sarsokhan && (
                <IssuePoster
                  href="/special/مادران-و-دختران"
                  image={sarsokhan.image ?? ""}
                  imagePosition={POSTER_IMAGE_POSITION}
                  imageAlt={POSTER_TITLE}
                  label="مجلهٔ نیلوفر"
                  title={POSTER_TITLE}
                  seasonYear={`${seasonOf(sarsokhan.jalaliDate)} ${toPersianDigits(sarsokhan.jalaliDate.split("-")[0])}`}
                  contributors={contributors}
                />
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:pr-2">
              {heroList.map((a) => (
                <ArticleBox key={a.slug} article={toBaru(a)} variant="list" />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* --- Section B: the main mosaic --- */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {mosaicText.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="text" />
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {mosaicCream && <ArticleBox article={toBaru(mosaicCream)} variant="cream" />}
            <SpotIllustration kind="lotus" />
            <SpotIllustration kind="moon" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mosaicPhoto.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="photo-top" />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* --- Section C: small horizontal cards row --- */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {horizontal.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="horizontal-small" />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* --- Section D: illustrated portrait row --- */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
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

      {/* --- Section E: publication / download block --- */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
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

      {/* --- Section F: dark feature pair --- */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {dark.map((a) => (
              <ArticleBox key={a.slug} article={toBaru(a)} variant="dark" />
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
