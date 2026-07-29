import { notFound } from "next/navigation";
import { getSpecialIssue, getSpecialIssues, longExcerptOf } from "../../lib/content-server";
import { ArticleGrid } from "../../components/article-grid";
import { SectionIntro } from "../../components/section-intro";
import { WideRow } from "../../components/wide-row";
import StaggerGrid from "../../components/stagger-grid";

export async function generateStaticParams() {
  return getSpecialIssues().map((issue) => ({ slug: issue.slug }));
}

export default async function SpecialIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  // Turbopack's dev router hands this segment still percent-encoded for
  // non-ASCII (Persian) slugs instead of decoding it -- decode defensively.
  const slug = rawSlug.includes("%") ? decodeURIComponent(rawSlug) : rawSlug;
  const issue = getSpecialIssue(slug);

  if (!issue) {
    notFound();
  }

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <p className="text-sm text-[#6b6b6b]">{issue.credit}</p>
      <h1 className="mt-2 text-4xl font-bold leading-[1.5] sm:text-5xl">{issue.title}</h1>
      <p className="mt-3 text-xl text-[#4a4a4a]">{issue.subtitle}</p>

      <div className="mt-5">
        {issue.sections.map((section, index) => {
          const isWideRow = section.layout === "wide-row";
          // No top margin when directly following a wide-row section, so its
          // shared #f0f0f0/hairline treatment reads as one continuous block
          // with zero gap into the next section, instead of a floating row.
          const previousWasWideRow = index > 0 && issue.sections[index - 1].layout === "wide-row";
          const topMargin = index === 0 ? "" : previousWasWideRow ? "" : "mt-10";

          return (
            <section key={section.key} id={section.key} className={`scroll-mt-24 ${topMargin}`}>
              {!isWideRow && <h2 className="section-heading text-3xl font-bold">{section.title}</h2>}
              {section.image && section.description && (
                <div className="mt-2">
                  <SectionIntro
                    image={section.image}
                    imagePosition={section.imagePosition}
                    imageAlt={section.imageAlt}
                    text={section.description}
                  />
                </div>
              )}
              {section.articles.length > 0 && isWideRow && (
                <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
                  {section.articles.map((article) => (
                    <WideRow
                      key={article.slug}
                      article={{
                        slug: article.slug,
                        title: article.title,
                        author: article.author,
                        excerpt: longExcerptOf(article, 140, 260),
                        date: "",
                        image: article.image,
                        imagePosition: article.imagePosition,
                        imageAlt: article.imageAlt,
                      }}
                    />
                  ))}
                </StaggerGrid>
              )}
              {section.articles.length > 0 && !isWideRow && (
                <div className="mt-3">
                  <ArticleGrid
                    articles={section.articles.map((article) => ({
                      slug: article.slug,
                      title: article.title,
                      author: article.author,
                      excerpt: longExcerptOf(article, article.image ? 110 : 220),
                      image: article.image,
                      imagePosition: article.imagePosition,
                      imageAlt: article.imageAlt,
                    }))}
                  />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
