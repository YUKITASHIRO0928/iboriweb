#!/usr/bin/env python3
"""V25.html の写真パスを assets/photos-all/ の多様な番号に置換"""
import re
from pathlib import Path

HTML = Path("/Users/uriur/Projects/iboriweb/v25.html")
text = HTML.read_text()

# 既存 assets/photos/ パスを assets/photos-all/963XXX_0-...webp にマッピング
# キュレーション写真の番号は既知
NAME_TO_NUM = {
    "hero-smash":     "963320_0",
    "action-team":    "963340_0",
    "action-kids":    "963315_0",
    "award-group":    "963287_0",
    "award-boys4":    "963288_0",
    "huddle-girls":   "963295_0",
    "beach-peace":    "963290_0",
    "beach-dig":      "963308_0",
    "walking-pair":   "963345_0",
    "award-ceremony": "963330_0",
    "coach-girls":    "963305_0",
    "warmup-grass":   "963311_0",
    "girls-bench":    "963300_0",
    "peace-girls":    "963350_0",
    "team-stretch":   "963312_0",
    "boys-team":      "963325_0",
}

# 順に置換: assets/photos/{name}-{size}.webp -> assets/photos-all/{num}-{size}.webp
for name, num in NAME_TO_NUM.items():
    for size in ["xl", "lg", "md", "sm"]:
        old = f"assets/photos/{name}-{size}.webp"
        new = f"assets/photos-all/{num}-{size}.webp"
        text = text.replace(old, new)

HTML.write_text(text)
print("Done")
print(f"Remaining assets/photos/ paths: {text.count('assets/photos/')}")
print(f"New assets/photos-all/ paths: {text.count('assets/photos-all/')}")
