import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVizheNamehAvval } from "../../../lib/content-server";
import { toPersianDigits } from "../../../lib/date";
import PdfReader from "../../../components/pdf-reader";

// One piece of the first special issue: its pages of the original PDF,
// shown in the in-page reader (no download, no new tab).

export function generateStaticParams() {
  return getVizheNamehAvval().pieces.map((p) => ({ n: String(p.n) }));
}

function findPiece(n: string) {
  const issue = getVizheNamehAvval();
  const index = issue.pieces.findIndex((p) => String(p.n) === n);
  return { issue, index, piece: index >= 0 ? issue.pieces[index] : null };
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const { issue, piece } = findPiece(n);
  if (!piece) return {};
  return { title: `${piece.title} | ${issue.title}`, description: piece.subtitle || piece.excerpt.slice(0, 160) };
}

export default async function PdfIssuePiecePage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const { issue, index, piece } = findPiece(n);
  if (!piece) notFound();

  const prev = index > 0 ? issue.pieces[index - 1] : null;
  const next = index < issue.pieces.length - 1 ? issue.pieces[index + 1] : null;
  const pages =
    piece.from === piece.to
      ? `صفحه‌ی ${toPersianDigits(String(piece.from))}`
      : `صفحه‌های ${toPersianDigits(String(piece.from))} تا ${toPersianDigits(String(piece.to))}`;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/special#vizhe-nameh-avval" className="text-sm text-[var(--accent)] hover:underline">
        ← {issue.title}
      </Link>
      <h1 className="article-title mt-3 text-3xl font-bold leading-snug text-[var(--title)] sm:text-4xl">{piece.title}</h1>
      {piece.subtitle && <p className="mt-3 text-lg text-[#4a4a4a]">{piece.subtitle}</p>}
      <p className="mt-2 text-sm text-[#6b6b6b]">
        {piece.author} · {pages} از ویژه‌نامه
      </p>

      <div className="mt-6">
        <PdfReader src={issue.pdf} title={piece.title} fromPage={piece.from} toPage={piece.to} />
      </div>

      <nav aria-label="نوشته‌های دیگر این ویژه‌نامه" className="mt-6 flex flex-wrap justify-between gap-4 text-base">
        {prev ? (
          <Link
            href={`/special/vizhe-nameh-avval/${prev.n}`}
            className="rounded-xl border-2 border-[#e2d8c9] bg-white px-4 py-3 shadow-xs transition hover:shadow-md"
          >
            → {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/special/vizhe-nameh-avval/${next.n}`}
            className="rounded-xl border-2 border-[#e2d8c9] bg-white px-4 py-3 shadow-xs transition hover:shadow-md"
          >
            {next.title} ←
          </Link>
        )}
      </nav>
    </div>
  );
}
