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

// Per-province round announcement -- only rendered where set.
const roundAnnouncements: Record<string, string> = {
  kabul: "درخواست‌نامهٔ دور ششم برنامه ادبیات جهان در کابل باز است.",
  balkh: "درخواست‌نامهٔ دور چهارم برنامه ادبیات جهان در مزار شریف باز است.",
};

const SHARED_BANNER =
  "دو دور جدید برنامه ادبیات جهان به‌زودی در کابل و مزار شریف آغاز می‌شود. درخواست‌نامه‌های ما تا ۱۰ اسد برای هر دو ولایت باز است. لطفاً درخواست‌نامه‌ها را با دخترانِ ۱۷ تا ۲۲ ساله که به ادبیات و کتاب‌خوانی علاقه‌مند هستند، به اشتراک بگذارید.";

// lnkd.in short links route through a bot-detection challenge page that
// refuses to render inside an iframe (confirmed directly -- both URLs
// 403 with a reCAPTCHA "checking your browser" page instead of the
// form), so these two open in a new tab instead of embedding.
const NO_IFRAME_SLUGS = new Set(["kabul", "balkh"]);

export async function generateStaticParams() {
  return ["kabul", "herat", "balkh", "bamyan", "collaboration"].map((slug) => ({ slug }));
}

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const forms = getForms();

  if (!(slug in forms)) {
    notFound();
  }

  const url: string | null = forms[slug];
  const announcement = roundAnnouncements[slug];
  const showSharedBanner = slug === "kabul" || slug === "balkh";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-bold">{labels[slug]}</h1>

      {announcement && <p className="mt-4 text-lg font-semibold text-[var(--accent)]">{announcement}</p>}

      {showSharedBanner && (
        <div className="mt-4 border border-[var(--accent)] bg-[var(--accent)]/5 p-5">
          <p className="text-sm leading-8 text-[#333333]">{SHARED_BANNER}</p>
        </div>
      )}

      {slug === "collaboration" ? (
        <p className="mt-4 text-lg leading-8 text-[#4a4a4a]">
          نیلوفر را جمعی از پژوهشگران، نویسندگان و دوستداران فرهنگ عمدتاً به صورت رضاکارانه پیش می‌برند. در صورت
          علاقمندی به همکاری با ما، از طریق ارسال فرم زیرین می‌توانید با ما به تماس شوید.
        </p>
      ) : (
        <div className="hairline-grid mt-6 grid-cols-2 sm:grid-cols-3">
          {programInfo.map((item, index) => (
            <div
              key={item}
              className={`hairline-cell bg-white text-sm text-[#333333] ${
                index === programInfo.length - 1 ? "col-span-2" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {!url ? (
        <div className="mt-8 border border-dashed border-[var(--hairline)] py-16 text-center text-[#6b6b6b]">
          <p className="text-lg font-semibold text-[#111111]">به‌زودی</p>
          <p className="mt-2 text-sm">
            {slug === "collaboration"
              ? "فرم همکاری با ما به‌زودی فعال می‌شود."
              : "فرم درخواست‌نامهٔ این بخش به‌زودی فعال می‌شود."}
          </p>
        </div>
      ) : NO_IFRAME_SLUGS.has(slug) ? (
        <div className="mt-8 border border-[var(--hairline)] bg-[var(--panel)] p-8 text-center">
          <p className="text-sm text-[#4a4a4a]">
            فرم درخواست‌نامه در همین صفحه قابل نمایش نیست؛ از طریق دکمه زیر آن را در یک تب جدید باز کنید.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:opacity-85"
          >
            باز کردن فرم درخواست‌نامه
          </a>
        </div>
      ) : (
        <div className="mt-8 aspect-[3/4] w-full border border-[var(--hairline)] sm:aspect-[4/3]">
          <iframe src={url} className="h-full w-full" title={labels[slug]} />
        </div>
      )}
    </div>
  );
}
