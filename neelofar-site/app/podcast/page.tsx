import { getPodcastEpisodes } from "../lib/content-server";
import { gridSpanFor } from "../components/hairline-grid";
import StaggerGrid from "../components/stagger-grid";
import { formatJalaliDate } from "../lib/date";

export default function PodcastPage() {
  const episodes = getPodcastEpisodes();

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">پادکست</h1>
      <p className="mt-2 text-[#4a4a4a]">قسمت‌های پادکست نیلوفر.</p>

      <div className="mt-5">
        {episodes.length > 0 ? (
          <StaggerGrid className="hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep, i) => {
              const span = gridSpanFor(i, episodes.length, 3);
              return (
                <a
                  key={ep.url}
                  href={ep.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ gridColumn: `span ${span} / span ${span}` }}
                  className="group flex h-full flex-col bg-white transition duration-200 hover:bg-[var(--panel)]"
                >
                  <div className="hairline-cell flex flex-1 flex-col">
                    <p className="text-xs text-[#6b6b6b]">{formatJalaliDate(ep.date)}</p>
                    <h3 className="mt-1 text-lg font-bold transition duration-200 group-hover:text-[var(--accent)]">
                      {ep.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-8 text-[#333333]">{ep.description}</p>
                  </div>
                </a>
              );
            })}
          </StaggerGrid>
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
