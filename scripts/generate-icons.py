import os
import base64
import io
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_AVATAR = os.path.join(ROOT, 'src/assets/mascot/avatar.png')
PUBLIC_DIR = os.path.join(ROOT, 'public')

GROUND = (250, 242, 232, 255) # #faf2e8 warm cream ground

def main():
    if not os.path.exists(SRC_AVATAR):
        raise FileNotFoundError(f"Source avatar not found at {SRC_AVATAR}")
    
    avatar = Image.open(SRC_AVATAR).convert('RGBA')
    
    # 1. Apple Icon: 180x180
    touch = Image.new('RGBA', (180, 180), GROUND)
    avatar_touch = avatar.resize((156, 156), Image.Resampling.LANCZOS)
    touch.paste(avatar_touch, (12, 12), avatar_touch)
    touch_path = os.path.join(PUBLIC_DIR, 'apple-icon.png')
    touch.save(touch_path, optimize=True)
    print(f"public/apple-icon.png ({os.path.getsize(touch_path):,} bytes)")

    # 2. Favicon ICO: 16x16, 32x32, 48x48
    ico_frames = []
    for sz in [16, 32, 48]:
        tile = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
        mask = Image.new('L', (sz, sz), 0)
        draw_mask = ImageDraw.Draw(mask)
        rad = max(2, sz // 4)
        draw_mask.rounded_rectangle([0, 0, sz - 1, sz - 1], radius=rad, fill=255)
        
        bg = Image.new('RGBA', (sz, sz), GROUND)
        tile.paste(bg, (0, 0), mask)
        
        inner_sz = int(sz * 0.88)
        inner_av = avatar.resize((inner_sz, inner_sz), Image.Resampling.LANCZOS)
        offset = (sz - inner_sz) // 2
        tile.paste(inner_av, (offset, offset), inner_av)
        ico_frames.append(tile)

    ico_path = os.path.join(PUBLIC_DIR, 'favicon.ico')
    ico_frames[0].save(
        ico_path,
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=ico_frames[1:]
    )
    print(f"public/favicon.ico ({os.path.getsize(ico_path):,} bytes)")

    # 3. Favicon SVG
    tile_svg = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
    mask_svg = Image.new('L', (128, 128), 0)
    draw_svg = ImageDraw.Draw(mask_svg)
    draw_svg.rounded_rectangle([0, 0, 127, 127], radius=28, fill=255)
    bg_svg = Image.new('RGBA', (128, 128), GROUND)
    tile_svg.paste(bg_svg, (0, 0), mask_svg)
    inner_av_svg = avatar.resize((110, 110), Image.Resampling.LANCZOS)
    tile_svg.paste(inner_av_svg, (9, 9), inner_av_svg)

    buf = io.BytesIO()
    tile_svg.save(buf, format='PNG', optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <title>Dứa Con</title>
  <image href="data:image/png;base64,{b64}" width="128" height="128" />
</svg>
'''
    svg_path = os.path.join(PUBLIC_DIR, 'favicon.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"public/favicon.svg ({os.path.getsize(svg_path):,} bytes)")

if __name__ == '__main__':
    main()
