"""
Resizes icn_de.png to all required platform sizes. No colour changes.
"""
from PIL import Image
import os

ASSETS = os.path.join(os.path.dirname(__file__), '..', 'assets')
SRC    = os.path.join(ASSETS, 'imgde.png')

SIZES = [
    # (output filename, width, height)
    ('icon.png',          1024, 1024),   # iOS App Store / Expo default
    ('adaptive-icon.png', 1024, 1024),   # Android adaptive foreground
    ('splash-icon.png',   1242, 1242),   # Splash screen
    ('favicon.png',         48,   48),   # Web
]

if __name__ == '__main__':
    src = Image.open(SRC)
    print(f'Source: {src.size[0]}×{src.size[1]}  mode={src.mode}')

    for filename, w, h in SIZES:
        out = src.resize((w, h), Image.LANCZOS)
        out.save(os.path.join(ASSETS, filename))
        print(f'✓  {filename:<25} {w}×{h}')

    print('\nDone.')