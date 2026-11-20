import { getSpecialIssues, getVizheNamehAvval } from "../lib/content-server";
import { IssueOverviewCard } from "../components/issue-overview-card";
import { toPersianDigits } from "../lib/date";

const fa = (n: number) => toPersianDigits(String(n));

/** Landing page: one overview card per special issue; each opens its own page. */
export default function SpecialPage() {
  const first = getVizheNamehAvval();
  const issues = getSpecialIssues();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold">ویژه‌نامه‌ها</h1>
        <p className="mt-4 text-xl leading-8 text-[#4a4a4a]">
          «ویژه‌نامه‌های ما متمرکز بر یک موضوع مشخص – عمدتاً در همکاری با نشریات دیگر فارسی‌زبان – به نشر می‌رسد. هر
          ویژه‌نامه برای ما حکمِ یک «پرونده‌ی باز» را دارد که در آن تلاش می‌کنیم با گردآوری جستارها، نقدها و نگاه‌های
          متفاوت، ابعادِ نادیده‌ی یک پدیده‌ی ادبی را روشن کنیم.»
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 items-stretch gap-10 md:grid-cols-2">
        <IssueOverviewCard
          href="/special/vizhe-nameh-avval"
          title={first.title}
          subtitle={first.subtitle}
          meta={`${fa(first.pieces.length)} نوشته`}
          summary={first.summary}
          cover={first.cover}
          image={first.pieces[0].image}
          imagePosition={first.pieces[0].imagePosition}
          pdf={first.pdf}
        />
        {issues.map((issue) => {
          // The title repeats the subtitle after its colon; show each once.
          const shortTitle = issue.title.split(":")[0].trim();
          const articleCount = issue.sections.reduce((n, s) => n + s.articleSlugs.length, 0);
          return (
            <IssueOverviewCard
              key={issue.slug}
              href={`/special/${issue.slug}`}
              title={shortTitle}
              subtitle={issue.subtitle}
              meta={`${issue.credit} · ${fa(articleCount)} نوشته در ${fa(issue.sections.length)} بخش`}
              summary={issue.summary ?? ""}
              cover={issue.cover}
              image={issue.sections[0]?.image ?? "/images/zan-0.png"}
              imagePosition={issue.sections[0]?.imagePosition ?? undefined}
              pdf={issue.pdf}
            />
          );
        })}
      </div>
    </div>
  );
}
