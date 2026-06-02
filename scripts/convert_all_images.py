#!/usr/bin/env python3
"""井堀バドミントンクラブ - フォルダ内の全画像を一括 WebP 化
出力: assets/photos-all/<元ファイル名without拡張子>-{xl,lg,md,sm}.webp
"""
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path("/Users/uriur/Projects/iboriweb/images")
OUT = Path("/Users/uriur/Projects/iboriweb/assets/photos-all")
OUT.mkdir(parents=True, exist_ok=True)

SIZES = [
    ("xl", 1920),
    ("lg", 1280),
    ("md", 800),
    ("sm", 480),
]

def process(src_path: Path):
    slug = src_path.stem  # 963287_0
    try:
        img = Image.open(src_path)
        img = ImageOps.exif_transpose(img)
        if img.mode != "RGB":
            img = img.convert("RGB")
        w, h = img.size
        for label, max_w in SIZES:
            if w <= max_w:
                im = img.copy()
            else:
                ratio = max_w / w
                im = img.resize((max_w, int(h * ratio)), Image.LANCZOS)
            out = OUT / f"{slug}-{label}.webp"
            im.save(out, "WEBP", quality=82, method=6)
        print(f"OK: {slug}")
    except Exception as e:
        print(f"ERR: {slug} -- {e}")

count = 0
for p in sorted(SRC.glob("*.jpg")):
    process(p)
    count += 1
for p in sorted(SRC.glob("*.JPG")):
    process(p)
    count += 1
print(f"\nProcessed: {count} images")
