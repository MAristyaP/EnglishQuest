"""Render three local handwriting stimuli to SVG paths (no browser font dependency)."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

root = Path(__file__).resolve().parent
font = TTFont(r'C:\Windows\Fonts\segoesc.ttf')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
scale = 82 / font['head'].unitsPerEm
for index, word in enumerate(['cat', 'book', 'night'], 1):
    pen = SVGPathPen(glyphs)
    position = 25
    for char in word:
        glyph = glyphs[cmap[ord(char)]]
        glyph.draw(TransformPen(pen, (scale, 0, 0, -scale, position, 100)))
        position += glyph.width * scale
    width = round(position + 25)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 135"><rect width="100%" height="100%" rx="16" fill="#fff6dd"/><path d="M15 105H{width-15}" stroke="#d5bf91"/><path d="{pen.getCommands()}" fill="#4c327c"/></svg>'
    (root / f'handwriting-{index}.svg').write_text(svg, encoding='utf-8')
print('Saved 3 handwriting stimuli as SVG paths.')
