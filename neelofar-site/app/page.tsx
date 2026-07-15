import Link from "next/link";
import { getAllArticles, getSpecialIssue, longExcerptOf, type Article } from "./lib/content-server";
import { type CardArticle } from "./components/feature-card";
import { ArticleGrid } from "./components/article-grid";
import { PullQuote } from "./components/pull-quote";
import ScrollReveal from "./components/scroll-reveal";

// The 3 pieces featured at the top of the page. قصه‌ی مریم و هم‌باغش
// deliberately also appears again in its own «ترجمه‌ها و گفتگو» section below --
// a flagship piece earning both the featured spot and its normal section slot.
const FEATURED_SLUGS = ["سرسخن", "هشت-گفتگو", "قصهی-مریم-و-همباغش"];

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

  const featured = FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a)
  );

  const hashtSection = issue?.sections.find((s) => s.key === "hasht");
  const alexievichSection = issue?.sections.find((s) => s.key === "alexievich");
  const tarjomehaSection = issue?.sections.find((s) => s.key === "tarjomeha");

  // "هشت گفتگو: هزار زندگی" (the section intro) is already shown in the
  // featured row above -- don't repeat it here, leaving exactly the 8 گفتگو pieces.
  const hashtInterviews = (hashtSection?.articles ?? []).filter((a) => a.slug !== "هشت-گفتگو");

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
            {alexievichSection.description && (
              <p className="mb-3 max-w-[70ch] text-justify text-sm leading-8 text-[#4a4a4a]">
                {alexievichSection.description}
              </p>
            )}
            <ArticleGrid articles={alexievichSection.articles.map(entryOf)} />
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
            <ArticleGrid articles={tarjomehaSection.articles.map(entryOf)} />
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
