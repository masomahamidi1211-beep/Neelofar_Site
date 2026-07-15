import sys
sys.path.insert(0, r"C:\Users\DELL\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\LocalCache\local-packages\Python312\site-packages")
import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)

out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\pdf_middle.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

p("Total pages:", doc.page_count)
p("Metadata:", doc.metadata)

mid = doc.page_count // 2
p(f"\n=== Page {mid} (0-indexed) / page {mid+1} (1-indexed) text ===\n")
page = doc[mid]
text = page.get_text()
p(text)

p("\n=== TOC (if embedded) ===")
toc = doc.get_toc()
if toc:
    for entry in toc:
        p(entry)
else:
    p("No embedded TOC found.")

p("\n=== images on this page ===")
imgs = page.get_images(full=True)
p(f"{len(imgs)} images referenced on page {mid+1}")
