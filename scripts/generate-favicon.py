"""Generate Aaru Wealth Modern Minimal favicon assets from geometric mark."""

from __future__ import annotations

import os
import shutil
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
APP = os.path.join(ROOT, "src", "app")

# Sampled from the selected Modern Minimal Icon source
NAVY = (17, 31, 57, 255)  # #111F39
GOLD = (185, 143, 62, 255)  # #B98F3E

SVG = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Aaru Wealth">
  <path fill="#111F39" d="M64 10 L114 118 H88.5 L64 52 L39.5 118 H14 Z"/>
  <path fill="#B98F3E" d="M64 70 L82 114 H46 Z"/>
</svg>
"""


def draw_mark(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    s = size / 128.0

    def pts(*coords: float):
        return [(coords[i] * s, coords[i + 1] * s) for i in range(0, len(coords), 2)]

    # Navy stylized A (thick chevron / inverted V)
    draw.polygon(pts(64, 10, 114, 118, 88.5, 118, 64, 52, 39.5, 118, 14, 118), fill=NAVY)
    # Gold triangle with gap from navy inner edges; base aligned near leg bottoms
    draw.polygon(pts(64, 70, 82, 114, 46, 114), fill=GOLD)
    return img


def main() -> None:
    os.makedirs(PUBLIC, exist_ok=True)
    os.makedirs(APP, exist_ok=True)

    with open(os.path.join(PUBLIC, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(SVG)

    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
    }

    for name, sz in sizes.items():
        path = os.path.join(PUBLIC, name)
        draw_mark(sz).save(path, "PNG")
        print("wrote", path)

    ico_path = os.path.join(PUBLIC, "favicon.ico")
    # Pillow generates 16/32/48 from a high-res master
    draw_mark(256).save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("wrote", ico_path)

    # Next.js App Router file conventions
    shutil.copy2(ico_path, os.path.join(APP, "favicon.ico"))
    draw_mark(32).save(os.path.join(APP, "icon.png"), "PNG")
    draw_mark(180).save(os.path.join(APP, "apple-icon.png"), "PNG")
    print("wrote src/app/favicon.ico, icon.png, apple-icon.png")

    # Local QA previews (not shipped)
    draw_mark(256).save(os.path.join(ROOT, "_favicon_preview.png"), "PNG")
    draw_mark(16).resize((128, 128), Image.NEAREST).save(
        os.path.join(ROOT, "_favicon_16_preview.png"), "PNG"
    )


if __name__ == "__main__":
    main()
