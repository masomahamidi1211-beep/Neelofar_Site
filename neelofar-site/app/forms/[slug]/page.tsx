import { notFound } from "next/navigation";
import { getForms } from "../../lib/content-server";

const labels: Record<string, string> = {
  kabul: "کابل",
  herat: "هرات",
  balkh: "بلخ",
  bamyan: "بامیان",
  collaboration: "همکاری با ما",
};

const programInfo = [
  "شش ماه",
  "هر صنف یک آموزگار",
  "هر هفته دو جلسه",
  "هر ماه یک کتاب",
  "هزینه‌ی انترنت از سوی برنامه پرداخت می‌شود",
];

export async function generateStaticParams() {
  return ["kabul", "herat", "balkh", "bamyan", "collaboration"].map((slug) => ({ slug }));
}

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const forms = getForms();
  const url = forms[slug];

  if (!url) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-bold">{labels[slug]}</h1>

      {slug === "collaboration" ? (
        <p className="mt-4 text-lg leading-8 text-[#4a4a4a]">
          نیلوفر را جمعی از پژوهشگران، نویسندگان و دوستداران فرهنگ عمدتاً به صورت رضاکارانه پیش می‌برند. در صورت
          علاقمندی به همکاری با ما، از طریق ارسال فرم زیرین می‌توانید با ما به تماس شوید.
        </p>
      ) : (
        <div className="hairline-grid mt-6 grid-cols-2 sm:grid-cols-3">
          {programInfo.map((item) => (
            <div key={item} className="hairline-cell bg-white text-sm text-[#333333]">
              {item}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 aspect-[3/4] w-full border border-[var(--hairline)] sm:aspect-[4/3]">
        <iframe src={url} className="h-full w-full" title={labels[slug]} />
      </div>
    </div>
  );
}
