import { notFound } from "next/navigation";
import { getSpecialIssue, getSpecialIssues, longExcerptOf } from "../../lib/content-server";
import { ArticleGrid } from "../../components/article-grid";

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
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
      <p className="text-xs text-[#6b6b6b]">{issue.credit}</p>
      <h1 className="mt-2 text-3xl font-bold leading-[1.5] sm:text-4xl">{issue.title}</h1>
      <p className="mt-3 text-lg text-[#4a4a4a]">{issue.subtitle}</p>

      <div className="mt-5 space-y-5">
        {issue.sections.map((section) => (
          <section key={section.key} id={section.key} className="scroll-mt-24">
            <h2 className="section-heading text-2xl font-bold">{section.title}</h2>
            {section.description && (
              <p className="mt-2 max-w-[70ch] text-justify leading-8 text-[#4a4a4a]">{section.description}</p>
            )}
            {section.articles.length > 0 && (
              <div className="mt-3">
                <ArticleGrid
                  articles={section.articles.map((article) => ({
                    slug: article.slug,
                    title: article.title,
                    author: article.author,
                    excerpt: longExcerptOf(article, article.image ? 110 : 220),
                    image: article.image,
                  }))}
                />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
