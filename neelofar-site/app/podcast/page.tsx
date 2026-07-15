import { getPodcastEpisodes } from "../lib/content-server";
import { HairlineFlex } from "../components/hairline-grid";
import { formatJalaliDate } from "../lib/date";

export default function PodcastPage() {
  const episodes = getPodcastEpisodes();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">پادکست</h1>
      <p className="mt-2 text-[#4a4a4a]">قسمت‌های پادکست نیلوفر.</p>

      <div className="mt-5">
        {episodes.length > 0 ? (
          <HairlineFlex>
            {episodes.map((ep) => (
              <a
                key={ep.url}
                href={ep.url}
                target="_blank"
                rel="noreferrer"
                className="group block bg-white transition duration-200 hover:bg-[var(--panel)]"
              >
                <div className="hairline-cell">
                  <p className="text-xs text-[#6b6b6b]">{formatJalaliDate(ep.date)}</p>
                  <h3 className="mt-1 text-lg font-bold transition duration-200 group-hover:text-[var(--accent)]">
                    {ep.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-8 text-[#333333]">{ep.description}</p>
                </div>
              </a>
            ))}
          </HairlineFlex>
        ) : (
          <div className="border border-dashed border-[var(--hairline)] py-16 text-center text-[#6b6b6b]">
            <p className="text-lg font-semibold text-[#111111]">به‌زودی</p>
            <p className="mt-2 text-sm">قسمت‌های پادکست نیلوفر به‌زودی اینجا منتشر می‌شود.</p>
          </div>
        )}
      </div>
    </div>
  );
}
