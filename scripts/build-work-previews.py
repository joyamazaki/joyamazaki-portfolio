"""Build lossless HTML fallbacks; leave source PDFs and PDF.js rendering intact.
Requires PyMuPDF and Pillow. Run from the repository root.
"""
from pathlib import Path
import html
import json
import re
import shutil
import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
for slug in ('archx', 'percentz', 'hwk', 'belulu'):
    name = slug.upper()
    document = fitz.open(ROOT / 'assets' / f'{slug}.pdf')
    directory = ROOT / 'works' / slug / 'pages'
    directory.mkdir(exist_ok=True)
    sections = []
    images = []
    for number, page in enumerate(document, 1):
        # Match the existing viewer's maximum raster width; use lossless encoding.
        pixmap = page.get_pixmap(matrix=fitz.Matrix(4096 / page.rect.width, 4096 / page.rect.width), alpha=False)
        image = Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)
        target = directory / f'{number:02}.webp'
        image.save(target, 'WEBP', lossless=True, method=4)
        text = ' '.join(page.get_text().split())
        # The alt describes the actual visible page, using its PDF text, not keywords.
        alt = html.escape(f'{name} — page {number} of {len(document)}. {text}', quote=True)
        loading = 'fetchpriority="high"' if number == 1 else 'loading="lazy"'
        sections.append(f'        <section class="pdf-page" id="page-{number}" data-page-number="{number}" style="aspect-ratio: {page.rect.width} / {page.rect.height}" aria-label="{name}, page {number} of {len(document)}">\n          <img class="pdf-preview" src="./pages/{number:02}.webp" alt="{alt}" width="{pixmap.width}" height="{pixmap.height}" {loading} decoding="async" />\n        </section>')
        images.append(f'https://joyamazaki.com/works/{slug}/pages/{number:02}.webp')
    path = ROOT / 'works' / slug / 'index.html'
    source = path.read_text()
    source = re.sub(r'<h1 class="visually-hidden">.*?</h1>', f'<h1 class="visually-hidden">{name}</h1>', source)
    source = source.replace('aria-busy="true"', 'aria-busy="false"')
    source = source.replace('        <p class="portfolio-status">loading…</p>\n', '')
    source = re.sub(r'        <section class="pdf-page".*?</section>\n', '', source, flags=re.S)
    source = source.replace('        <p class="pdf-fallback"', '\n'.join(sections) + '\n        <p class="pdf-fallback"', 1)
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
    data = json.loads(match[1])
    data['mainEntity'] = {'@type': 'CreativeWork', 'name': name, 'url': f'https://joyamazaki.com/works/{slug}/', 'creator': {'@id': 'https://joyamazaki.com/#person'}, 'image': images, 'encoding': {'@type': 'MediaObject', 'contentUrl': f'https://joyamazaki.com/assets/{slug}.pdf', 'encodingFormat': 'application/pdf'}}
    source = source[:match.start(1)] + '\n' + json.dumps(data, ensure_ascii=False, indent=2) + '\n    ' + source[match.end(1):]
    path.write_text(source)
    shutil.copytree(ROOT / 'works' / slug, ROOT / 'dist' / 'works' / slug, dirs_exist_ok=True)
    print(slug, len(document), 'pages', sum(p.stat().st_size for p in directory.glob('*.webp')), 'bytes', flush=True)
