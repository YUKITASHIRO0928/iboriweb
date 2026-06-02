#!/usr/bin/env python3
"""ヒーロー用 背景除去 + WebP化"""
import io
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

SRC = Path("/Users/uriur/Projects/iboriweb/images")
OUT = Path("/Users/uriur/Projects/iboriweb/assets/cutouts")
OUT.mkdir(parents=True, exist_ok=True)

# モデル: isnet-general-use は人物切り抜きで高品質
session = new_session("isnet-general-use")

# 切り抜く写真
TARGETS = {
    "963320_0.jpg": "hero-smash-cutout",
    "963340_0.jpg": "action-team-cutout",
    "963315_0.jpg": "kids-court-cutout",
    "963287_0.jpg": "award-group-cutout",
    "963350_0.jpg": "peace-girls-cutout",
}

def cutout(src_path: Path, slug: str):
    print(f"processing {src_path.name} -> {slug}")
    with open(src_path, "rb") as f:
        data = f.read()
    result = remove(data, session=session)
    img = Image.open(io.BytesIO(result)).convert("RGBA")

    # bbox cropping to remove transparent borders
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w, h = img.size

    # multiple sizes
    for label, max_w in [("xl", 1400), ("lg", 1000), ("md", 700)]:
        if w > max_w:
            ratio = max_w / w
            new = img.resize((max_w, int(h * ratio)), Image.LANCZOS)
        else:
            new = img.copy()
        out_path = OUT / f"{slug}-{label}.webp"
        new.save(out_path, "WEBP", quality=86, method=6)
        print(f"  -> {out_path.name}: {new.size}")
    out_png = OUT / f"{slug}.png"
    img.save(out_png, "PNG", optimize=True)
    print(f"  -> {out_png.name} (master PNG)")

if __name__ == "__main__":
    for fname, slug in TARGETS.items():
        src = SRC / fname
        if not src.exists():
            print(f"!! missing {fname}")
            continue
        try:
            cutout(src, slug)
        except Exception as e:
            print(f"!! error on {fname}: {e}")
    print("Done.")
