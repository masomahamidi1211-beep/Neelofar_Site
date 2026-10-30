function articleFromFile(slug: string, fullPath: string): Article {
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const body = marked.parse(content) as string;
  const wordCount = countWords(body);

  const titleStr = typeof data.title === "string" ? data.title : "";
  const isSarsokhan = slug.includes("sarsokhan") || titleStr.includes("سرسخن");
  const resolvedImage = typeof data.image === "string" 
    ? data.image 
    : (isSarsokhan ? "/images/madaran/book-30.png" : null);

  const rawTags = Array.isArray(data.tags) ? data.tags : [];
  const defaultTags = rawTags.length > 0 
    ? rawTags 
    : [data.section ? String(data.section) : "یادداشت", "مادران و دختران"];

  return {
    slug,
    title: titleStr,
    author: data.author ?? "",
    section: data.section ?? "",
    order: typeof data.order === "number" ? data.order : 0,
    jalaliDate: normalizeDate(data.jalaliDate),
    footnotes: Array.isArray(data.footnotes)
      ? data.footnotes.map((footnote) => ({
          id: String(footnote.id),
          text: String(footnote.text ?? ""),
          ...(typeof footnote.title === "string" ? { title: footnote.title } : {}),
          ...(typeof footnote.url === "string" ? { url: footnote.url } : {}),
        }))
      : [],
    body,
    wordCount,
    readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
    image: resolvedImage,
    imagePosition: typeof data.imagePosition === "string" ? data.imagePosition : null,
    imageAlt: typeof data.imageAlt === "string" ? data.imageAlt : null,
    subtitle: Array.isArray(data.subtitle) ? data.subtitle : null,
    tags: defaultTags,
  };
}