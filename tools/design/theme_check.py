"""Verify every theme's text/surface/accent pairs against WCAG 2.1 AA.
Run: python3 -I tools/design/theme_check.py  (exit 1 on any failure)"""
import sys
def lin(c):
    c/=255
    return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
def L(h):
    h=h.lstrip('#'); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
def cr(a,b):
    la,lb=L(a),L(b); hi,lo=max(la,lb),min(la,lb); return (hi+0.05)/(lo+0.05)

THEMES = {
 "light": dict(base="#FFFFFF", sunken="#F2F2F0", raised="#F2F2F0",
   primary="#111111", secondary="#555555", tertiary="#6B6B6B",
   interactive="#8A8A8A", accent="#D7141A", onAccent="#FFFFFF", accentText="#C8102E",
   inverse="#111111", onInverse="#FFFFFF"),
 "dark": dict(base="#0E0E0E", sunken="#000000", raised="#1C1C1C",
   primary="#F5F5F5", secondary="#ADADAD", tertiary="#949494",
   interactive="#6E6E6E", accent="#FF4D4F", onAccent="#111111", accentText="#FF6B6B",
   inverse="#F5F5F5", onInverse="#111111"),
 "cream": dict(base="#F5EEDC", sunken="#EBE1C9", raised="#EBE1C9",
   primary="#1C1814", secondary="#5A5145", tertiary="#6A6052",
   interactive="#857A69", accent="#C8102E", onAccent="#FFFFFF", accentText="#B00E28",
   inverse="#1C1814", onInverse="#F5EEDC"),
 "olive": dict(base="#4A4834", sunken="#3C3A29", raised="#5B5940",
   primary="#F6F1E1", secondary="#DCD6BF", tertiary="#DAD3BA",
   interactive="#B3AD93", accent="#A8DCCB", onAccent="#17241F", accentText="#B8E6D6",
   inverse="#F6F1E1", onInverse="#2E2C1F"),
}
checks = [
 ("primary/base","primary","base",4.5), ("primary/raised","primary","raised",4.5),
 ("primary/sunken","primary","sunken",4.5),
 ("secondary/base","secondary","base",4.5), ("secondary/raised","secondary","raised",4.5),
 ("tertiary/base","tertiary","base",4.5), ("tertiary/raised","tertiary","raised",4.5),
 ("interactive border/base","interactive","base",3.0),
 ("interactive border/raised","interactive","raised",3.0),
 ("onAccent/accent (button)","onAccent","accent",4.5),
 ("accent fill vs base (non-text)","accent","base",3.0),
 ("accentText/base","accentText","base",4.5),
 ("onInverse/inverse","onInverse","inverse",4.5),
]
fails=0
for name,t in THEMES.items():
    print(f"\n## {name}")
    for label,a,b,need in checks:
        r=cr(t[a],t[b]); ok=r>=need; fails+= not ok
        print(f"  {label:32}{r:6.2f}:1  ≥{need}  {'ok' if ok else 'FAIL'}")
print(f"\nfailures: {fails}")
sys.exit(1 if fails else 0)
