import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\image_scan.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

total = 0
kept = 0
seen_xrefs = set()
per_page_count = {}

for pno in range(doc.page_count):
    page = doc[pno]
    imgs = page.get_images(full=True)
    if not imgs:
        continue
    count_this_page = 0
    for img in imgs:
        xref = img[0]
        total += 1
        if xref in seen_xrefs:
            continue
        seen_xrefs.add(xref)
        try:
            base = doc.extract_image(xref)
        except Exception as e:
            continue
        w, h = base.get("width", 0), base.get("height", 0)
        if w >= 200 and h >= 200:
            kept += 1
            count_this_page += 1
    if count_this_page:
        per_page_count[pno + 1] = count_this_page

p("Total image refs across doc:", total)
p("Unique xrefs kept (>=200x200):", kept)
p("Pages with at least one kept image:", len(per_page_count))
p()
for page_num, c in sorted(per_page_count.items()):
    p(f"page {page_num}: {c} image(s)")
