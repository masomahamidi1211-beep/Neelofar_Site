import Link from "next/link";
import { getAllArticles, getSpecialIssue, longExcerptOf, type Article } from "./lib/content-server";
import { type CardArticle } from "./components/feature-card";
import { ArticleGrid } from "./components/article-grid";
import { PullQuote } from "./components/pull-quote";
import { SectionIntro } from "./components/section-intro";
import ScrollReveal from "./components/scroll-reveal";

// The single piece featured at the very top of the page, above the 4
// sections. هشت-گفتگو and قصه‌ی مریم و هم‌باغش used to appear here too, but
// each already has its proper home below (هشت-گفتگو as the hasht section's
// intro, قصه‌ی مریم و هم‌باغش in ترجمه‌ها) -- showing them here as well made
// them show up twice on the page.
const FEATURED_SLUGS = ["سرسخن"];

// Claims every article slug placed on the homepage exactly once, in render
// order. If a slug is ever added to two lists by mistake, pickUnique()
// silently drops the second occurrence instead of rendering the same
// article twice. A fresh Set per call -- this must never be a module-level
// singleton, or the second request served by this module instance would
// find every slug already "used" and render an empty homepage.
function createSlugPicker() {
  const usedSlugs = new Set<string>();
  return {
    claim(slug: string) {
      usedSlugs.add(slug);
    },
    pickUnique<T extends { slug: string }>(items: T[]): T[] {
      return items.filter((item) => {
        if (usedSlugs.has(item.slug)) return false;
        usedSlugs.add(item.slug);
        return true;
      });
    },
  };
}

function entryOf(
  article: Pick<Article, "slug" | "title" | "author" | "image" | "imagePosition" | "imageAlt" | "body">
): CardArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    // text-only cells pull noticeably more words so they can match the
    // height of a neighboring image cell in the same grid row instead of
    // stretching to a mostly-blank cell.
    excerpt: longExcerptOf(article, article.image ? 110 : 220),
    image: article.image,
    imagePosition: article.imagePosition,
    imageAlt: article.imageAlt,
  };
}

export default function HomePage() {
  const articles = getAllArticles();
  const issue = getSpecialIssue("مادران-و-دختران");
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  const hashtSection = issue?.sections.find((s) => s.key === "hasht");
  const alexievichSection = issue?.sections.find((s) => s.key === "alexievich");
  const tarjomehaSection = issue?.sections.find((s) => s.key === "tarjomeha");

  const { claim, pickUnique } = createSlugPicker();

  // هشت-گفتگو's image/text are shown via the hasht section's SectionIntro
  // block below, not as its own card -- claim its slug up front so it can
  // never also render as a regular grid card, no matter what else changes.
  claim("هشت-گفتگو");

  const featured = pickUnique(
    FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter((a): a is NonNullable<typeof a> => Boolean(a))
  );
  const hashtInterviews = pickUnique(hashtSection?.articles ?? []);
  const alexievichArticles = pickUnique(alexievichSection?.articles ?? []);
  const tarjomehaArticles = pickUnique(tarjomehaSection?.articles ?? []);

  return (
    <div>
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 lg:px-8">
          <h1 className="section-heading text-xl font-bold">ویژه‌نامه «مادران و دختران»</h1>
          <div className="mt-2">
            <ArticleGrid articles={featured.map(entryOf)} />
          </div>
        </section>
      </ScrollReveal>

      {hashtSection && (
        <ScrollReveal>
          <section className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 lg:px-8">
            <div className="mb-2 flex items-end justify-between">
              <h2 className="section-heading text-xl font-bold">{hashtSection.title}</h2>
              <Link
                href="/special/مادران-و-دختران#hasht"
                className="text-sm font-semibold text-[var(--accent)] transition duration-200 hover:opacity-70"
              >
                همهٔ مطالب ←
              </Link>
            </div>
            {hashtSection.image && hashtSection.description && (
              <SectionIntro
                image={hashtSection.image}
                imagePosition={hashtSection.imagePosition}
                imageAlt={hashtSection.imageAlt}
                text={hashtSection.description}
                href="/special/مادران-و-دختران#hasht"
              />
            )}
            <ArticleGrid articles={hashtInterviews.map(entryOf)} />
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <PullQuote
          quote="جنگ تمام هستی ما را نابود کرده است"
          source="از «هشت گفتگو: هزار زندگی»"
          href="/notes/هشت-گفتگو"
        />
      </ScrollReveal>

      {alexievichSection && (
        <ScrollReveal>
          <section className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 lg:px-8">
            <div className="mb-2 flex items-end justify-between">
              <h2 className="section-heading text-xl font-bold">{alexievichSection.title}</h2>
              <Link
                href="/special/مادران-و-دختران#alexievich"
                className="text-sm font-semibold text-[var(--accent)] transition duration-200 hover:opacity-70"
              >
                همهٔ مطالب ←
              </Link>
            </div>
            {alexievichSection.image && alexievichSection.description && (
              <SectionIntro
                image={alexievichSection.image}
                imagePosition={alexievichSection.imagePosition}
                imageAlt={alexievichSection.imageAlt}
                text={alexievichSection.description}
                href="/special/مادران-و-دختران#alexievich"
              />
            )}
            <ArticleGrid articles={alexievichArticles.map(entryOf)} />
          </section>
        </ScrollReveal>
      )}

      {tarjomehaSection && (
        <ScrollReveal>
          <section className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 lg:px-8">
            <div className="mb-2 flex items-end justify-between">
              <h2 className="section-heading text-xl font-bold">{tarjomehaSection.title}</h2>
              <Link
                href="/special/مادران-و-دختران#tarjomeha"
                className="text-sm font-semibold text-[var(--accent)] transition duration-200 hover:opacity-70"
              >
                همهٔ مطالب ←
              </Link>
            </div>
            <ArticleGrid articles={tarjomehaArticles.map(entryOf)} />
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <PullQuote
          quote="بچیم زن زود پیر میشه"
          source="از «بچیم زن زود پیر میشه» — ز. حبیبی"
          href="/notes/بچیم-زن-زود-پیر-میشه"
        />
      </ScrollReveal>
    </div>
  );
}
