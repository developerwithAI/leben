"""
Generates app icon assets for Leben in Deutschland.
Design: German flag (black/red/gold) + bold white checkmark.
"""
from PIL import Image, ImageDraw, ImageFilter
import math, os

ASSETS = os.path.join(os.path.dirname(__file__), '..', 'assets')

BLACK  = (0,   0,   0)
RED    = (198,  0,  18)   # Bundesrot – official German red
GOLD   = (255, 204,  0)   # Bundesgold
WHITE  = (255, 255, 255)


def draw_checkmark(draw, size, line_w, x_offset=0, y_offset=0):
    """Draw a bold rounded white checkmark centred in `size`."""
    s = size
    x1, y1 = int(0.19*s) + x_offset, int(0.50*s) + y_offset   # left tip
    xm, ym = int(0.40*s) + x_offset, int(0.73*s) + y_offset   # bottom vertex
    x2, y2 = int(0.81*s) + x_offset, int(0.27*s) + y_offset   # right tip

    r = line_w // 2
    draw.line([x1, y1, xm, ym], fill=WHITE, width=line_w)
    draw.line([xm, ym, x2, y2], fill=WHITE, width=line_w)
    # round caps and joint
    for px, py in [(x1, y1), (xm, ym), (x2, y2)]:
        draw.ellipse([px-r, py-r, px+r, py+r], fill=WHITE)


def make_icon(size=1024):
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)

    b = size // 3
    draw.rectangle([0,   0,    size, b    ], fill=BLACK)
    draw.rectangle([0,   b,    size, b*2  ], fill=RED)
    draw.rectangle([0,   b*2,  size, size ], fill=GOLD)

    # Subtle divider lines between bands
    lw = max(2, size // 256)
    draw.rectangle([0, b-lw,   size, b+lw  ], fill=(255,255,255,80))
    draw.rectangle([0, b*2-lw, size, b*2+lw], fill=(255,255,255,80))

    draw_checkmark(draw, size, line_w=max(4, size//13))
    return img


def make_adaptive_icon(size=1024):
    """Android adaptive icon: logo centred on flag background with safe zone margins."""
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)

    b = size // 3
    draw.rectangle([0, 0, size, b   ], fill=BLACK)
    draw.rectangle([0, b,    size, b*2 ], fill=RED)
    draw.rectangle([0, b*2, size, size ], fill=GOLD)

    # Slightly smaller checkmark to keep within Android safe zone (66% of canvas)
    margin = int(size * 0.12)
    inner = size - margin * 2
    draw_checkmark(draw, inner, line_w=max(4, inner//13), x_offset=margin, y_offset=margin)
    return img


def make_splash(size=512):
    """Splash icon: white bg, flag-coloured rounded rectangle, white checkmark."""
    img = Image.new('RGB', (size, size), WHITE)
    draw = ImageDraw.Draw(img)

    pad  = size // 8
    rx   = 24   # corner radius approximation
    box  = [pad, pad, size-pad, size-pad]

    # Draw rounded rect background – approximate with rectangle + circles
    b = (size - pad*2) // 3
    y0 = pad
    draw.rectangle([pad, y0,        size-pad, y0+b    ], fill=BLACK)
    draw.rectangle([pad, y0+b,      size-pad, y0+b*2  ], fill=RED)
    draw.rectangle([pad, y0+b*2,    size-pad, y0+b*3  ], fill=GOLD)

    inner = size - pad * 2
    draw_checkmark(draw, inner, line_w=max(4, inner//13), x_offset=pad, y_offset=pad)
    return img


if __name__ == '__main__':
    os.makedirs(ASSETS, exist_ok=True)

    icon = make_icon(1024)
    icon.save(os.path.join(ASSETS, 'icon.png'))
    print('✓ icon.png')

    adaptive = make_adaptive_icon(1024)
    adaptive.save(os.path.join(ASSETS, 'adaptive-icon.png'))
    print('✓ adaptive-icon.png')

    splash = make_splash(512)
    splash.save(os.path.join(ASSETS, 'splash-icon.png'))
    print('✓ splash-icon.png')

    favicon = make_icon(64)
    favicon.save(os.path.join(ASSETS, 'favicon.png'))
    print('✓ favicon.png')

    print('\nAll assets generated.')