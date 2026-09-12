"""Assemble directly rendered simulation frames into the README GIF. Requires Pillow."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
paths = sorted((root / 'output' / 'frames').glob('frame-*.png'))
if not paths:
    raise SystemExit('Render frames first: node scripts/render-figures.mjs --frames')
frames = [Image.open(path).convert('RGB') for path in paths]
palette = frames[len(frames)//2].quantize(colors=128)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
indexed[0].save(root / 'assets' / 'figures' / 'observation-loop.gif', save_all=True,
                append_images=indexed[1:], duration=80, loop=0, optimize=True, disposal=2)
print(f'Created replay GIF from {len(indexed)} model frames.')
