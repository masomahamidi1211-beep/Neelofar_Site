import Link from "next/link";
import { getAllArticles, getSpecialIssue, longExcerptOf, type Article } from "./lib/content-server";
import { ArticleEntry, type EntryArticle } from "./components/article-entry";
import { HairlineGrid, HairlineFlex } from "./components/hairline-grid";
import { PullQuote } from "./components/pull-quote";
import ScrollReveal from "./components/scroll-reveal";

// The 3 pieces featured at the top of the page. قصه‌ی مریم و هم‌باغش
// deliberately also appears again in its own «ترجمه‌ها و گفتگو» section below --
// a flagship piece earning both the featured spot and its normal section slot.
const FEATURED_SLUGS = ["سرسخن", "هشت-گفتگو", "قصهی-مریم-و-همباغش"];

function entryOf(article: Pick<Article, "slug" | "title" | "author" | "image" | "body">): EntryArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article),
    image: article.image,
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
          <HairlineGrid className="mt-2 grid-cols-1 lg:grid-cols-3">
            {featured.map((article) => (
              <ArticleEntry key={article.slug} article={entryOf(article)} className="bg-white" />
            ))}
          </HairlineGrid>
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
            <HairlineFlex>
              {hashtInterviews.map((article) => (
                <ArticleEntry key={article.slug} article={entryOf(article)} className="bg-white" />
              ))}
            </HairlineFlex>
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
            <HairlineFlex>
              {alexievichSection.articles.map((article) => (
                <ArticleEntry key={article.slug} article={entryOf(article)} className="bg-white" />
              ))}
            </HairlineFlex>
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
            <HairlineGrid className="grid-cols-1 lg:grid-cols-3">
              {tarjomehaSection.articles.map((article) => (
                <ArticleEntry key={article.slug} article={entryOf(article)} className="bg-white" />
              ))}
            </HairlineGrid>
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
