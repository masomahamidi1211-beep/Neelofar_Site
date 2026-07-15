import fitz

path = r"e:\Web\WLP website\madaran-wa-dokhtaran.pdf"
doc = fitz.open(path)
out = open(r"C:\Users\DELL\AppData\Local\Temp\claude\e--Web-WLP-website\1cd0673d-e43b-4e73-b486-1cd33e221790\scratchpad\pdf_toc_full.txt", "w", encoding="utf-8")
def p(*a): print(*a, file=out)

for i in [2, 3]:  # pages 3-4 (0-indexed 2-3)
    p(f"--- page {i+1} ---")
    p(doc[i].get_text())
    p()
