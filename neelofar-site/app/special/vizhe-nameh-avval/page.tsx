import type { Metadata } from "next";
import { getVizheNamehAvval } from "../../lib/content-server";
import { PatternCardGrid } from "../../components/home-card-grid";
import { BackToIssues, DownloadPdfButton } from "../../components/issue-overview-card";
import { toPersianDigits } from "../../lib/date";

export function generateMetadata(): Metadata {
  const issue = getVizheNamehAvval();
  return { title: issue.title, description: issue.summary };
}

/** The first special issue: every piece as a card, each opening its article. */
export default function FirstIssuePage() {
  const issue = getVizheNamehAvval();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <BackToIssues />
      <h1 className="mt-6 text-4xl font-bold leading-[1.5] sm:text-5xl">{issue.title}</h1>
      <p className="mt-3 text-xl text-[#4a4a4a]">{issue.subtitle}</p>
      <p className="mt-2 text-sm text-[#6b6b6b]">{toPersianDigits(String(issue.pieces.length))} نوشته</p>
      {issue.pdf && <DownloadPdfButton href={issue.pdf} title={issue.title} className="mt-5" />}

      <PatternCardGrid
        className="mt-8"
        cards={issue.pieces.map((p) => ({
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle ? [p.subtitle] : null,
          author: p.author,
          excerpt: p.excerpt,
          date: "",
          image: p.image,
          imagePosition: p.imagePosition,
          imageAlt: "",
        }))}
      />
    </div>
  );
}
