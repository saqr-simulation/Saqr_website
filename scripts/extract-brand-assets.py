"""Extract the supplied PDF's vector mark and display font; keep source intact."""
from pathlib import Path
from io import BytesIO
import json
import urllib.request
import pymupdf
from fontTools import agl
from fontTools.cffLib import CFFFontSet
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.basePen import NullPen
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
fonts = root / 'packages/ui/src/fonts'
fonts.mkdir(parents=True, exist_ok=True)
doc = pymupdf.open(root / 'charte graphique.pdf')
font_entry = next(f for f in doc[0].get_fonts() if 'JumboxRegular' in f[3])
raw = doc.extract_font(font_entry[0])[3]
cff = CFFFontSet()
cff.decompile(BytesIO(raw), None)
top = cff[0]
builder = FontBuilder(1000, isTTF=False)
builder.setupGlyphOrder(top.charset)
cmap = {}
metrics = {}
for name in top.charset:
    text = agl.toUnicode(name)
    if len(text) == 1:
        cmap[ord(text)] = name
    charstring = top.CharStrings[name]
    charstring.draw(NullPen())
    metrics[name] = (round(charstring.width), 0)
builder.setupCharacterMap(cmap)
builder.setupHorizontalMetrics(metrics)
builder.setupHorizontalHeader(ascent=950, descent=-250)
builder.setupNameTable({'familyName': 'Jumbox', 'styleName': 'Regular', 'uniqueFontIdentifier': 'SAQR supplied Jumbox subset', 'fullName': 'Jumbox Regular', 'psName': 'Jumbox-Regular'})
builder.setupOS2(sTypoAscender=950, sTypoDescender=-250, usWinAscent=950, usWinDescent=250)
builder.setupPost()
builder.setupCFF('Jumbox-Regular', {'FullName': 'Jumbox Regular', 'FamilyName': 'Jumbox', 'Weight': 'Regular'}, {name: top.CharStrings[name] for name in top.charset}, {})
builder.font['CFF '].cff = cff
builder.font.flavor = 'woff2'
builder.save(fonts / 'jumbox-brand.woff2')

url = 'https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf'
font = TTFont(BytesIO(urllib.request.urlopen(url).read()))
font.flavor = 'woff2'
font.save(fonts / 'montserrat-variable.woff2')
(fonts / 'Montserrat-OFL.txt').write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/OFL.txt').read())

# The top hero mark is the same falcon silhouette as the attached green logo.
drawing = next(d for d in doc[0].get_drawings() if 160 < d['rect'].x0 < 180 and 70 < d['rect'].y0 < 85 and len(d['items']) > 40)
commands = []
last = None
for item in drawing['items']:
    start = item[1]
    if last != start:
        if last is not None:
            commands.append('Z')
        commands.append(f'M{start.x:.4f} {start.y:.4f}')
    if item[0] == 'l':
        end = item[2]
        commands.append(f'L{end.x:.4f} {end.y:.4f}')
    elif item[0] == 'c':
        a, b, end = item[2:]
        commands.append(f'C{a.x:.4f} {a.y:.4f} {b.x:.4f} {b.y:.4f} {end.x:.4f} {end.y:.4f}')
    else:
        raise ValueError(f'Unsupported mark segment: {item[0]}')
    last = end
commands.append('Z')
rect = drawing['rect']
viewbox = f'{rect.x0:.4f} {rect.y0:.4f} {rect.width:.4f} {rect.height:.4f}'
path = ' '.join(commands)
(root / 'packages/ui/src/brand-mark.tsx').write_text(
    '// Vector silhouette extracted from the user-supplied charte graphique.pdf.\n'
    'export function BrandMark() {\n'
    f'  return <svg className="brand-mark" viewBox="{viewbox}" aria-hidden="true" focusable="false"><path d={json.dumps(path)} fill="currentColor" /></svg>;\n'
    '}\n', encoding='utf-8')
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"><path d="{path}" fill="#009b7b"/></svg>'
for app in ['web', 'platform']:
    public = root / f'apps/{app}/public'
    public.mkdir(exist_ok=True)
    (public / 'saqr-mark.svg').write_text(svg, encoding='utf-8')
print('Extracted vector mark, Jumbox subset and self-hosted Montserrat.')
