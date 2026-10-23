# /// script
# requires-python = ">=3.11"
# dependencies = ["cairosvg"]
# ///
"""Render the home carousel's slide art as transparent PNGs into static/images/slides/.

    uv run scripts/slide_art.py

Neutral parts are semi-transparent grey so the art sits on both the light and dark page;
the colours are the ROS-Manager ramp and the site's orange.
"""
from pathlib import Path

import cairosvg

OUT = Path(__file__).resolve().parent.parent / "static" / "images" / "slides"
ORANGE = "#ff8a1f"
NEUTRAL = "rgba(128,128,128,0.22)"
NEUTRAL_STRONG = "rgba(128,128,128,0.55)"
RAMP = ["#dc322f", "#e55229", "#ef7222", "#f48f1f", "#f2a823", "#f1c027", "#cac834", "#92c847", "#5ac85a"]


PAD = 30  # breathing room around each shape; the PNG is cropped tight so the carousel shows it large


def svg(title: str, body: str, box: tuple[int, int, int, int]) -> str:
    """Wrap the shapes, cropped to box = (x0, y0, x1, y1) of the drawing plus PAD."""
    x0, y0, x1, y1 = box[0] - PAD, box[1] - PAD, box[2] + PAD, box[3] + PAD
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{x1 - x0}" height="{y1 - y0}" '
            f'viewBox="{x0} {y0} {x1 - x0} {y1 - y0}"><title>{title}</title>{body}</svg>')


def octagon(cx: float, cy: float, r: float, fill: str) -> str:
    k = r * 0.414
    pts = [(cx - k, cy - r), (cx + k, cy - r), (cx + r, cy - k), (cx + r, cy + k),
           (cx + k, cy + r), (cx - k, cy + r), (cx - r, cy + k), (cx - r, cy - k)]
    return f'<polygon fill="{fill}" points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}"/>'


def this_month() -> str:
    """An activity calendar, 7 x 6, a few days lit up along the ramp."""
    lit = {(1, 1): 0, (3, 1): 2, (2, 2): 3, (5, 2): 4, (0, 3): 5, (4, 3): 6, (6, 4): 7, (2, 5): 8, (3, 5): 8}
    cells = []
    for row in range(6):
        for col in range(7):
            x, y = 135 + col * 95, 330 + row * 95
            fill = RAMP[lit[(col, row)]] if (col, row) in lit else NEUTRAL
            cells.append(f'<rect x="{x}" y="{y}" width="75" height="75" rx="14" fill="{fill}"/>')
    return svg("This month at a glance", "".join(cells), (135, 330, 780, 880))


def request_a_guide() -> str:
    """A question mark, with an octagon for the dot."""
    mark = (f'<path d="M330 430 A120 120 0 1 1 542 507 Q450 560 450 640 V690" fill="none" stroke="{ORANGE}" '
            'stroke-width="70" stroke-linecap="round" stroke-linejoin="round"/>')
    return svg("Request a guide", mark + octagon(450, 810, 48, ORANGE), (295, 275, 605, 858))


def parts_i_trust() -> str:
    """A chip with pins (body 315..585 x 465..735; pins stop at its edge, since the body is see-through)."""
    pins = []
    for i in range(6):
        o = 335 + i * 42
        pins += [f'<rect x="{o}" y="395" width="22" height="62" rx="6"/>',
                 f'<rect x="{o}" y="743" width="22" height="62" rx="6"/>',
                 f'<rect x="245" y="{o + 150}" width="62" height="22" rx="6"/>',
                 f'<rect x="593" y="{o + 150}" width="62" height="22" rx="6"/>']
    chip = (f'<g fill="{NEUTRAL_STRONG}">{"".join(pins)}</g>'
            f'<rect x="315" y="465" width="270" height="270" rx="28" fill="{NEUTRAL}" stroke="{ORANGE}" stroke-width="16"/>'
            f'<circle cx="362" cy="512" r="16" fill="{ORANGE}"/>')
    return svg("Parts I trust", chip, (245, 395, 655, 805))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, art in {"this-month": this_month, "request-a-guide": request_a_guide,
                      "parts-i-trust": parts_i_trust}.items():
        target = OUT / f"{name}.png"
        # 1200px on the long side keeps it sharp on high-DPI screens
        cairosvg.svg2png(bytestring=art().encode(), write_to=str(target), scale=2)
        print(f"wrote {target.relative_to(OUT.parent.parent.parent)}")
