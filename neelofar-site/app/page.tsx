import { getAllArticles, getHomepage, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [120, 240],
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
 * Asymmetrical card grid (baru.ir style): the FIRST article of a section (as
 * listed in content/homepage.json) is the large lead card; the rest are
 * smaller companions.
 * - phone: one column, lead card on top.
 * - tablet / small laptop (md): lead card full width, companions side by
 *   side beneath it.
 * - desktop (xl): five columns -- the lead card takes three columns and both
 *   rows, the two companions stack in the other two columns. leadSide
 *   "start" puts the lead on the right (RTL start), "end" on the left.
 */
function AsymmetricGrid({
  articles,
  leadSide,
  firstTone,
}: {
  articles: Article[];
  leadSide: "start" | "end";
  firstTone: "tan" | "cream";
}) {
  const otherTone = firstTone === "tan" ? "cream" : "tan";
  // Literal class strings (Tailwind only generates classes it can see).
  const leadPlacement =
    leadSide === "start"
      ? "md:col-span-2 xl:col-span-3 xl:row-span-2 xl:col-start-1 xl:row-start-1"
      : "md:col-span-2 xl:col-span-3 xl:row-span-2 xl:col-start-3 xl:row-start-1";
  const companionPlacement =
    leadSide === "start"
      ? ["xl:col-span-2 xl:col-start-4 xl:row-start-1", "xl:col-span-2 xl:col-start-4 xl:row-start-2"]
      : ["xl:col-span-2 xl:col-start-1 xl:row-start-1", "xl:col-span-2 xl:col-start-1 xl:row-start-2"];

  return (
    <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch">
      {articles.map((a, i) => {
        const lead = i === 0;
        return (
          <div
            key={a.slug}
            className={`bg-white p-6 rounded-xl border border-[#e2d8c9] shadow-xs flex flex-col h-full hover:shadow-md transition-all duration-300 ${
              lead ? leadPlacement : companionPlacement[i - 1] ?? "xl:col-span-2"
            }`}
          >
            <ArticleBox
              article={toBaru(a, lead ? [220, 340] : [70, 120])}
              variant="photo-top"
              size={lead ? "featured" : "compact"}
              excerptMinHeight={lead ? "12rem" : "8rem"}
              className="flex-1"
              tone={i % 2 === 0 ? firstTone : otherTone}
            />
          </div>
        );
      })}
    </StaggerGrid>
  );
}

export default function HomePage() {
  const articles = getAllArticles();

  // Which articles go in each section, and the section headings, live in
  // content/homepage.json (editable at /admin). Articles are listed by slug
  // (file name), so retitling an article never moves it.
  const home = getHomepage();
  const bySlug = (slug?: string) => (slug ? articles.find((a) => a.slug === slug) : undefined);
  const pick = (slugs: string[] = []) => slugs.map(bySlug).filter((a): a is Article => Boolean(a));

  const heroArticle = bySlug(home.hero?.article);
  const upperGridArticles = pick(home.notes?.articles);
  const middleHorizontalArticle = bySlug(home.featured?.article);
  const lowerGridArticles = pick(home.translations?.articles);
  const featuredStory = bySlug(home.story?.article);

  return (
    <div className="bg-[var(--page-bg)] min-h-screen text-[#2a2421] font-serif dir-rtl">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* 1. TOP HERO (سرسخن) */}
        {heroArticle && (
          <section className="border-b border-[#e5ded4] pb-10">
            <div className="bg-[#f3ede2] p-6 md:p-8 rounded-xl border border-[#e2d8c9] shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#d8ccbc]">
                <span className="bg-[#8c2222] text-[#faf7f2] text-xs font-sans font-bold px-3 py-1 rounded-sm tracking-widest">
                  {home.hero.badge}
                </span>
                <span className="text-xs text-[#786e65] font-sans">{home.hero.label}</span>
              </div>
              <WideRow article={toBaru(heroArticle, [220, 380])} />
            </div>
          </section>
        )}

        {/* 2. UPPER 3 GRID CARDS */}
        {upperGridArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-[#2a2421]">
              <h2 className="text-xl font-bold tracking-tight">{home.notes.heading}</h2>
            </div>

            <AsymmetricGrid articles={upperGridArticles} leadSide="start" firstTone="tan" />
          </section>
        )}

        {/* 3. MIDDLE HORIZONTAL SECTION: یادداشت ویژه */}
        {middleHorizontalArticle && (
          <section className="my-10">
            <div className="bg-[#f3ede2] p-6 md:p-8 rounded-xl border border-[#e2d8c9] shadow-sm">
              <div className="mb-4 pb-2 border-b border-[#d8ccbc]">
                <span className="text-xs font-sans font-bold text-[#8c2222] tracking-widest uppercase">
                  {home.featured.heading}
                </span>
              </div>
              <WideRow article={toBaru(middleHorizontalArticle, [160, 300])} />
            </div>
          </section>
        )}

        {/* 4. LOWER 3 GRID CARDS */}
        {lowerGridArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-[#2a2421]">
              <h2 className="text-xl font-bold tracking-tight">{home.translations.heading}</h2>
            </div>

            {/* Mirrored: lead card on the left, so the two sections alternate. */}
            <AsymmetricGrid articles={lowerGridArticles} leadSide="end" firstTone="cream" />
          </section>
        )}

        {/* 5. روایت/ داستان ویژه -- opens the story's reading page */}
        {featuredStory && (
        <section className="pb-12">
          <div className="bg-[#f3ede2] p-6 md:p-8 rounded-xl border border-[#e2d8c9] shadow-sm">
            <div className="mb-4 pb-2 border-b border-[#d8ccbc]">
              <h2 className="text-xs font-sans font-bold text-[#8c2222] tracking-widest">
                {home.story.heading}
              </h2>
            </div>
            <WideRow article={toBaru(featuredStory, [160, 300])} />
          </div>
        </section>
        )}

      </div>
    </div>
  );
}