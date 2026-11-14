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

## Content editor (CMS) at `/admin`

The site has a no-code editor ([Decap CMS](https://decapcms.org)) at
`https://<site>/admin`. It edits the same files in this repository: every
save is a commit to `master`, and Vercel redeploys the site automatically
(about 1–2 minutes). What it can edit:

- **مقاله‌ها و روایت‌ها** — every article in `content/articles/` (title,
  author, date, cover image and crop, optional PDF, keywords, footnotes, text).
  New articles can be created; deleting is turned off on purpose.
- **تنظیمات ← صفحه‌ی اول** — `content/homepage.json`: section headings and
  which articles appear in each homepage section.
- **تنظیمات ← پیوندهای فرم ثبت‌نام** — `content/forms.json`.
- Uploaded images and PDFs go to `public/uploads/` (served at `/uploads/...`).

The configuration is `public/admin/config.yml`; the GitHub connection is set
in `public/admin/index.html`.

**Article text** opens in markdown mode, which keeps existing footnote marks
(`<sup class="fn-ref">`), figures and bold text exactly as they are. Avoid
switching older articles to rich-text mode — it can drop that markup.

**Careful:** `scripts/extract-special-issue.py` regenerates the special-issue
articles from the Word file and would overwrite edits made in the CMS.

### One-time login setup (GitHub OAuth app)

Login uses GitHub, through this site's own `/api/auth` and `/api/callback`
routes. To turn it on:

1. On GitHub (as the repository owner), go to **Settings → Developer settings →
   OAuth Apps → New OAuth App** and enter:
   - Application name: `Neelofar CMS`
   - Homepage URL: `https://neelofar-site.vercel.app`
   - Authorization callback URL: `https://neelofar-site.vercel.app/api/callback`
2. Create it, then click **Generate a new client secret**.
3. In Vercel → the `neelofar-site` project → **Settings → Environment
   Variables**, add (for Production):
   - `GITHUB_OAUTH_CLIENT_ID` = the app's Client ID
   - `GITHUB_OAUTH_CLIENT_SECRET` = the client secret
4. Redeploy once (Deployments → ⋯ → Redeploy) so the new variables apply.

Anyone who should edit needs **write access** to the GitHub repository
(Settings → Collaborators). If the site moves to another domain, add that
domain's `/api/callback` to the OAuth app.

### Editing locally without logging in

Run the site (`npm run dev`) and, from the repository root (the folder
above `neelofar-site`), `npx decap-server`. Then open
`http://localhost:3000/admin` — edits are written straight to your local files.
