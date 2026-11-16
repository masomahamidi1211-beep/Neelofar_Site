import { getAllArticles, getHomepage } from "../lib/content-server";
import { HomeCardGrid } from "../components/home-card-grid";

export default function NotesPage() {
  // Texts listed under "notesPage.hidden" in content/homepage.json (editable
  // at /admin) are left out of this listing; they remain published.
  const hidden = new Set(getHomepage().notesPage?.hidden ?? []);
  const articles = getAllArticles().filter((a) => !hidden.has(a.slug));

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">یادداشت‌ها</h1>
      <p className="mt-2 text-lg text-[#4a4a4a]">تمام مقاله‌های نیلوفر، به ترتیب ویژه‌نامه.</p>

      <HomeCardGrid articles={articles} className="mt-6" />
    </div>
  );
}
