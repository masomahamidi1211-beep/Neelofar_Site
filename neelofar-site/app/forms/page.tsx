import Link from "next/link";
import { getForms } from "../lib/content-server";
import { ProgramDescription } from "./program-description";

const cities = [
  { slug: "kabul", label: "کابل" },
  { slug: "herat", label: "هرات" },
  { slug: "balkh", label: "بلخ" },
  { slug: "bamyan", label: "بامیان" },
];

export default function FormsPage() {
  const forms = getForms();
  const openCities = cities.filter((city) => forms[city.slug]);
  const soonCities = cities.filter((city) => !forms[city.slug]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-4xl font-bold">درخواست‌نامه‌ها</h1>

      <p className="mt-6 text-justify text-xl leading-9 text-[#4a4a4a]">
        نیلوفر فعلاً «برنامه‌ی ادبیات جهان» را در شهرهای کابل، هرات، بلخ و بامیان برای دختران نوجوان و جوان برگزار
        می‌کند.
      </p>

      <h2 className="mt-10 text-2xl font-bold">درباره‌ی برنامه</h2>
      <ProgramDescription className="mt-4" />

      <h2 className="mt-10 text-2xl font-bold">همکاری با ما</h2>
      <p className="mt-4 text-justify text-lg leading-9 text-[#333333]">
        نیلوفر را جمعی از پژوهشگران، نویسندگان و دوستداران فرهنگ عمدتاً به‌صورت رضاکارانه پیش می‌برند. اگر به
        همکاری با ما علاقه دارید،{" "}
        <Link href="/forms/collaboration" className="font-semibold text-[var(--accent)] underline underline-offset-4 hover:opacity-80">
          صفحه‌ی همکاری با ما
        </Link>{" "}
        را ببینید.
      </p>

      {/* Registration -- always the last thing on the page. */}
      <section aria-labelledby="register" className="mt-12 border-t border-[var(--hairline)] pt-8">
        <h2 id="register" className="text-2xl font-bold">ثبت‌نام</h2>
        <p className="mt-4 text-justify text-lg leading-9 text-[#333333]">
          {openCities.length > 0 ? (
            <>
              درخواست‌نامه‌ی برنامه در حال حاضر برای {openCities.map((city) => city.label).join(" و ")} باز است. برای
              ثبت‌نام، فرم شهر خود را پر کنید.
            </>
          ) : (
            <>در حال حاضر درخواست‌نامه‌ی بازی نداریم؛ دور بعدی به‌زودی اعلام می‌شود.</>
          )}
          {soonCities.length > 0 && (
            <> درخواست‌نامه‌ی {soonCities.map((city) => city.label).join(" و ")} به‌زودی باز می‌شود.</>
          )}
        </p>
        {openCities.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {openCities.map((city) => (
              <a
                key={city.slug}
                href={forms[city.slug] as string}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white transition duration-200 hover:opacity-85"
              >
                ثبت‌نام در {city.label} ↗
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
