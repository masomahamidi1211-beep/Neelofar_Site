# نیلوفر Website

A Persian-language, RTL website for نیلوفر built with Next.js and local Markdown/JSON content.

## Content model

All current articles belong to the «مادران و دختران» ویژه‌نامه, extracted from
`مادران و دختران.docx` via `scripts/extract-special-issue.py` (see that script for the
heading-to-section mapping). Re-run it any time the source docx changes:

```
python scripts/extract-special-issue.py
```

It regenerates `content/articles/*.md` and `content/special-issues.json`. Do not hand-edit
`مادران و دختران.docx`-derived articles without also checking whether re-running the script
would just overwrite your change.

## Adding an article by hand

1. Create a new Markdown file in `content/articles/`.
2. Use this frontmatter structure:

```md
---
title: "عنوان مقاله"
author: "نام نویسنده"
section: sarsokhan
order: 19
jalaliDate: "1404-05-01"
footnotes: []
---
```

`section` must be one of the keys in `content/special-issues.json` (or a new section you add
there) if the article should appear grouped under a ویژه‌نامه. `order` controls sort order in
`یادداشت‌ها`. `footnotes` is a list of `{id, text}`; reference a footnote inline in the body
with `<sup class="fn-ref"><a id="fnref-N" href="#fn-N">N</a></sup>`.

3. Add the article body below the frontmatter (Markdown; raw HTML is passed through).

## Adding a book

1. Open `content/books.json`.
2. Add a new object with the fields `title`, `author`, `translator`, `genre`, and `country`.
3. An empty array renders a «به‌زودی» empty state on `/recommendations`.

## Replacing Google Form URLs

1. Open `content/forms.json`.
2. Replace `null` with your real Google Form link for that province/section. `/forms/[slug]`
   renders a «به‌زودی» message in place of the form for any slug whose value is still `null`.

## Known Next.js 16 / Turbopack quirk

In dev mode, `params.slug` on `[slug]` dynamic routes arrives still percent-encoded for
non-ASCII (Persian) slugs instead of pre-decoded. Both `app/notes/[slug]/page.tsx` and
`app/special/[slug]/page.tsx` decode it defensively (`decodeURIComponent` when the raw value
contains `%`). Keep this in mind if you add another Persian-slugged dynamic route.
