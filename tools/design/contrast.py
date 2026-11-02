def lin(c):
    c = c/255
    return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
def L(h):
    h = h.lstrip('#')
    r,g,b = (int(h[i:i+2],16) for i in (0,2,4))
    return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
def ratio(a,b):
    la,lb = L(a),L(b)
    hi,lo = max(la,lb),min(la,lb)
    return (hi+0.05)/(lo+0.05)

P = dict(ink='#261E2C', muted='#776F7D', canvas='#FBF9FE', surface='#FFFFFF',
         line='#E9E1EF', soft='#F7EFFB', green='#7658C7', greenSoft='#F0EBFF',
         olive='#B496C7', orange='#D96D9F', danger='#B45174')

pairs = [
 ("본문 ink / canvas", P['ink'], P['canvas'], 4.5),
 ("본문 ink / surface", P['ink'], P['surface'], 4.5),
 ("보조 muted / canvas", P['muted'], P['canvas'], 4.5),
 ("보조 muted / surface", P['muted'], P['surface'], 4.5),
 ("muted / soft", P['muted'], P['soft'], 4.5),
 ("eyebrow orange / canvas (13pt)", P['orange'], P['canvas'], 4.5),
 ("stepLabel orange / canvas (11pt)", P['orange'], P['canvas'], 4.5),
 ("green / greenSoft (10pt 배지)", P['green'], P['greenSoft'], 4.5),
 ("green / surface", P['green'], P['surface'], 4.5),
 ("green / soft", P['green'], P['soft'], 4.5),
 ("danger / #FCEAF2 (10pt 배지)", P['danger'], '#FCEAF2', 4.5),
 ("흰 글씨 / green 버튼", '#FFFFFF', P['green'], 4.5),
 ("흰 글씨 / 버튼 그라디언트 핑크끝 D96D9F", '#FFFFFF', P['orange'], 4.5),
 ("optionArrow #9A9C96 / surface", '#9A9C96', P['surface'], 3.0),
 ("line #E9E1EF / surface (구분선)", P['line'], P['surface'], 3.0),
 ("olive / surface", P['olive'], P['surface'], 4.5),
 ("demoNoticeTitle orange / #FFF0F7 (11pt)", P['orange'], '#FFF0F7', 4.5),
 ("prototypeBadge green / greenSoft (9pt)", P['green'], P['greenSoft'], 4.5),
]
print(f"{'조합':48} {'대비비':>7}  {'기준':>5}  판정")
print("-"*80)
fails=0
for name,a,b,need in pairs:
    r = ratio(a,b)
    ok = r >= need
    if not ok: fails += 1
    print(f"{name:48} {r:6.2f}:1  {need:5}  {'통과' if ok else '✗ 실패'}")
print("-"*80)
print(f"실패 {fails} / {len(pairs)}")
