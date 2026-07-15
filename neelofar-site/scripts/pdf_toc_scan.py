import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\pdf_toc_scan.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

# scan first 15 pages for anything that looks like a table of contents
for i in range(min(15, doc.page_count)):
    text = doc[i].get_text()
    if "فهرست" in text or len(text.strip()) < 400:
        p(f"--- page {i+1} ---")
        p(text[:1500])
        p()
