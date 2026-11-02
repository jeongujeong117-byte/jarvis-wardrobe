"""
Fountain-pen stroke generator.

A real nib draws thick when moving across its edge and thin when moving along it,
and the ink thins where the pen lands and lifts. Uniform SVG strokes can't do that,
so each drawing here is authored as centerlines (points on a 100×100 board) and
rendered into filled outlines with:
  width(θ) = hair + swell · |sin(θ − nib_angle)|      (broad-ish fine nib)
  × taper(t)                                          (landing / lift-off)
  × (1 + tiny wobble)                                 (hand, deterministic)

Run: python3 -I tools/design/pen.py <out.ts> [preview.svg]
Writes a TS module of path strings for react-native-svg <Path fill>.
"""
import json, math, sys

NIB_ANGLE = math.radians(35)

def catmull(pts, samples=9):
    """Centripetal Catmull-Rom through pts → dense polyline."""
    if len(pts) < 2:
        return pts
    P = [pts[0]] + pts + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i-1], P[i], P[i+1], P[i+2]
        def tj(ti, a, b):
            return ti + max(math.dist(a, b), 1e-6) ** 0.5
        t0 = 0; t1 = tj(t0, p0, p1); t2 = tj(t1, p1, p2); t3 = tj(t2, p2, p3)
        for k in range(samples):
            t = t1 + (t2 - t1) * k / samples
            def lerp(a, b, ta, tb):
                if tb - ta < 1e-9: return a
                return tuple(((tb - t) * a[j] + (t - ta) * b[j]) / (tb - ta) for j in range(2))
            A1 = lerp(p0, p1, t0, t1); A2 = lerp(p1, p2, t1, t2); A3 = lerp(p2, p3, t2, t3)
            B1 = lerp(A1, A2, t0, t2); B2 = lerp(A2, A3, t1, t3)
            out.append(lerp(B1, B2, t1, t2))
    out.append(pts[-1])
    return out

def stroke(pts, hair=0.55, swell=1.9, weight=1.0, seed=1, land=0.10, lift=0.18):
    line = catmull([tuple(p) for p in pts])
    n = len(line)
    if n < 2:
        return ''
    # cumulative length for taper
    L = [0.0]
    for i in range(1, n):
        L.append(L[-1] + math.dist(line[i-1], line[i]))
    total = L[-1] or 1
    left, right = [], []
    for i in range(n):
        a = line[max(i-1, 0)]; b = line[min(i+1, n-1)]
        th = math.atan2(b[1]-a[1], b[0]-a[0])
        t = L[i] / total
        taper = min(1.0, t / land if land else 1) ** 0.6 * min(1.0, (1 - t) / lift if lift else 1) ** 0.9
        taper = 0.25 + 0.75 * taper
        wob = 1 + 0.06 * math.sin(seed * 1.7 + L[i] * 0.35) + 0.04 * math.sin(seed * 0.3 + L[i] * 1.1)
        w = (hair + swell * abs(math.sin(th - NIB_ANGLE))) * taper * wob * weight / 2
        nx, ny = -math.sin(th), math.cos(th)
        x, y = line[i]
        left.append((x + nx * w, y + ny * w)); right.append((x - nx * w, y - ny * w))
    ring = left + right[::-1]
    d = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in ring) + ' Z'
    return d

def dot(x, y, r=1.05):
    k = 0.5523 * r
    return (f'M{x-r:.2f} {y:.2f} C{x-r:.2f} {y-k:.2f} {x-k:.2f} {y-r:.2f} {x:.2f} {y-r:.2f} '
            f'C{x+k:.2f} {y-r:.2f} {x+r:.2f} {y-k:.2f} {x+r:.2f} {y:.2f} '
            f'C{x+r:.2f} {y+k:.2f} {x+k:.2f} {y+r:.2f} {x:.2f} {y+r:.2f} '
            f'C{x-k:.2f} {y+r:.2f} {x-r:.2f} {y+k:.2f} {x-r:.2f} {y:.2f} Z')

def ellipse_loop(cx, cy, rx, ry, start=200, sweep=400, tilt=-6):
    pts = []
    for k in range(0, 41):
        a = math.radians(start + sweep * k / 40)
        r = 1 + 0.012 * math.sin(k * 0.9)
        x, y = rx * math.cos(a) * r, ry * math.sin(a) * r
        tr = math.radians(tilt)
        pts.append((cx + x * math.cos(tr) - y * math.sin(tr), cy + x * math.sin(tr) + y * math.cos(tr)))
    return pts

DRAWINGS = {
    # Garments — contour sketches, the way a stylist draws in a notebook.
    'top': [
        stroke([(39,13),(30,16),(20,22),(12,32),(19,39),(27,34),(28,60),(28,88),(50,89),(72,88),(72,60),(73,34),(81,39),(88,32),(80,22),(70,16),(61,13)], seed=1),
        stroke([(38,12),(43,21),(50,26)], seed=2), stroke([(62,12),(57,21),(50,26)], seed=3),
        stroke([(50,26),(50.6,52),(49.6,87)], weight=0.75, seed=4),
        stroke([(56,41),(65,40.5),(65.4,49),(56.4,49.5)], weight=0.7, seed=5),
        dot(47.2,38), dot(47.4,55), dot(47.3,72),
    ],
    'bottom': [
        stroke([(29,10),(50,11),(71,10)], seed=6),
        stroke([(29,10),(27,40),(24,70),(22,91),(41,92),(46,60),(50,33),(54,60),(59,92),(78,91),(76,70),(73,40),(71,10)], seed=7),
        stroke([(35,24),(34,56),(32,86)], weight=0.55, seed=8),
        stroke([(65,24),(66,56),(68,86)], weight=0.55, seed=9),
        stroke([(50,11),(50.4,29)], weight=0.7, seed=10),
    ],
    'outer': [
        stroke([(40,8),(30,12),(20,20),(16,45),(14,72),(19,73),(24,48),(26,92),(50,93),(74,92),(76,48),(81,73),(86,72),(84,45),(80,20),(70,12),(60,8)], seed=11),
        stroke([(40,8),(42,22),(36,34),(50,52)], seed=12), stroke([(60,8),(58,22),(64,34),(50,52)], seed=13),
        stroke([(50,52),(51,92)], weight=0.75, seed=14),
        dot(55.5,62), dot(55.8,75),
    ],
    'shoes': [
        stroke([(9,70),(10,58),(22,55),(34,46),(44,40),(51,44),(55,52),(70,57),(87,61),(92,69),(90,76),(48,77),(10,76),(9,70)], seed=15),
        stroke([(10,70),(50,70.6),(91,69.5)], weight=0.7, seed=16),
        stroke([(37,48),(41,55)], weight=0.7, seed=17), stroke([(43,44),(47,51)], weight=0.7, seed=18),
        stroke([(11,59),(13,67)], weight=0.6, seed=19),
    ],
    # A hanger — the app's mark in the hand voice.
    'hanger': [
        stroke([(46,15),(48,10),(53,9),(56,13),(54,18),(50,21),(50,30)], seed=20),
        stroke([(50,30),(30,42),(13,52),(15,56),(50,56),(85,56),(87,52),(70,42),(50,30)], seed=21),
    ],
    # Gestures: an underline swash and a loose circle, used to mark a choice.
    'swash': [stroke([(3,8),(22,4),(48,6),(74,3),(97,5)], hair=0.4, swell=2.4, seed=22, land=0.05, lift=0.4)],
    'circle': [stroke(ellipse_loop(50, 50, 46, 40), hair=0.45, swell=2.0, seed=23, land=0.06, lift=0.25)],
    # A quick tick, the way you mark something done in a notebook.
    'tick': [stroke([(14,54),(24,62),(38,78),(58,48),(88,16)], hair=0.6, swell=6.5, seed=24, land=0.08, lift=0.35)],
}

def main():
    out_ts = sys.argv[1]
    lines = ['// Generated by tools/design/pen.py — fountain-pen outlines on a 100×100 board.',
             '// Do not edit by hand; change the centerlines in pen.py and regenerate.', '',
             'export const penDrawings = {']
    for k, v in DRAWINGS.items():
        lines.append(f'  {k}: {json.dumps([p for p in v if p])},')
    lines += ['} as const;', '', 'export type PenDrawingName = keyof typeof penDrawings;', '']
    open(out_ts, 'w').write('\n'.join(lines))
    if len(sys.argv) > 2:
        cells = []
        for i, (k, v) in enumerate(DRAWINGS.items()):
            x = (i % 4) * 110; y = (i // 4) * 110
            paths = ''.join(f'<path d="{p}" fill="#1E2A44"/>' for p in v if p)
            cells.append(f'<g transform="translate({x+5},{y+5})"><rect width="100" height="100" fill="none" stroke="#ddd"/>{paths}</g>')
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 220" width="1320" height="660" style="background:#fff">{"".join(cells)}</svg>'
        open(sys.argv[2], 'w').write(svg)

if __name__ == '__main__':
    main()
