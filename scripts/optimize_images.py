#!/usr/bin/env python3
"""井堀バドミントンクラブHP用画像最適化スクリプト
- 選定写真を複数サイズにリサイズ + WebP化
- ロゴ・監督イラストもWebP化
"""
import os
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path("/Users/uriur/Projects/iboriweb/images")
OUT = Path("/Users/uriur/Projects/iboriweb/assets/photos")
LOGO_OUT = Path("/Users/uriur/Projects/iboriweb/assets/logo")
OUT.mkdir(parents=True, exist_ok=True)
LOGO_OUT.mkdir(parents=True, exist_ok=True)

# キュレーションした写真 (元ファイル名 -> 役割)
CURATED = {
    "963320_0.jpg": ("hero-smash", "smash-action"),     # 単独スマッシュ(ヒーロー候補)
    "963340_0.jpg": ("action-team", "practice"),         # 練習中のジャンプスマッシュ
    "963315_0.jpg": ("action-kids", "tournament"),       # 大会で並ぶ子供たち
    "963287_0.jpg": ("award-group", "achievement"),      # 賞状を持つ集合
    "963288_0.jpg": ("award-boys4", "achievement"),      # 賞状男子4人
    "963295_0.jpg": ("huddle-girls", "team-spirit"),     # 円陣
    "963290_0.jpg": ("beach-peace", "event"),            # 浜辺ピース
    "963308_0.jpg": ("beach-dig", "event"),              # 潮干狩り
    "963345_0.jpg": ("walking-pair", "friendship"),      # 肩組み歩く
    "963330_0.jpg": ("award-ceremony", "award"),         # 表彰式
    "963305_0.jpg": ("coach-girls", "coach"),            # コーチと女子整列
    "963311_0.jpg": ("warmup-grass", "warmup"),          # 芝生でウォーミング
    "963300_0.jpg": ("girls-bench", "team"),             # ベンチで談笑
    "963350_0.jpg": ("peace-girls", "fun"),              # ピースで笑顔
    "963312_0.jpg": ("team-stretch", "training"),        # IBCユニ集合
    "963325_0.jpg": ("boys-team", "tournament"),         # 男子チーム遠征
}

SIZES = [
    ("xl", 1920),  # ヒーロー
    ("lg", 1280),  # セクション大
    ("md", 800),   # ギャラリー
    ("sm", 480),   # サムネ
]

def process(src_path: Path, slug: str):
    img = Image.open(src_path)
    img = ImageOps.exif_transpose(img)
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    for label, max_w in SIZES:
        if w <= max_w:
            new = img.copy()
        else:
            ratio = max_w / w
            new = img.resize((max_w, int(h * ratio)), Image.LANCZOS)
        out_path = OUT / f"{slug}-{label}.webp"
        new.save(out_path, "WEBP", quality=82, method=6)
        print(f"  {out_path.name}: {new.size}")

def process_logo():
    logo_src = SRC / "ロゴ.png"
    if logo_src.exists():
        img = Image.open(logo_src).convert("RGBA")
        for label, max_w in [("xl", 800), ("lg", 400), ("sm", 200)]:
            if img.width > max_w:
                ratio = max_w / img.width
                new = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
            else:
                new = img.copy()
            new.save(LOGO_OUT / f"logo-{label}.webp", "WEBP", quality=92, lossless=False, method=6)
            new.save(LOGO_OUT / f"logo-{label}.png", "PNG", optimize=True)
        print(f"  logo processed")

    kantoku_src = SRC / "kantoku.png"
    if kantoku_src.exists():
        img = Image.open(kantoku_src).convert("RGBA")
        for label, max_w in [("lg", 800), ("md", 500), ("sm", 300)]:
            if img.width > max_w:
                ratio = max_w / img.width
                new = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
            else:
                new = img.copy()
            new.save(LOGO_OUT / f"kantoku-{label}.webp", "WEBP", quality=88, method=6)
        print(f"  kantoku processed")

if __name__ == "__main__":
    print("=== Optimizing curated photos ===")
    for fname, (slug, _) in CURATED.items():
        src = SRC / fname
        if not src.exists():
            print(f"!! missing: {fname}")
            continue
        print(f"{fname} -> {slug}")
        process(src, slug)
    print("\n=== Logo & Kantoku ===")
    process_logo()
    print("\nDone.")
