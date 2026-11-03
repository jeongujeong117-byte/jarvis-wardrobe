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
 "light": dict(base="#EFEBE5", sunken="#E2DCD3", raised="#FBFAF8",
   primary="#161514", secondary="#5C5852", tertiary="#6B665F",
   interactive="#8A847B", accent="#161514", onAccent="#F6F3EE", seal="#7A1E2B",
   inverse="#161514", onInverse="#F6F3EE"),
 "dark": dict(base="#12110F", sunken="#0A0A09", raised="#1C1B19",
   primary="#F3F1EC", secondary="#A9A59E", tertiary="#9A968F",
   interactive="#6E6A63", accent="#F3F1EC", onAccent="#12110F", seal="#E8998C",
   inverse="#F3F1EC", onInverse="#12110F"),
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
 ("seal text/base (destructive)","seal","base",4.5),
 ("primary/sunken (pressed row)","primary","sunken",4.5),
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
