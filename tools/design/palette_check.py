def lin(c):
    c/=255
    return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
def L(h):
    h=h.lstrip('#'); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
def cr(a,b):
    la,lb=L(a),L(b); hi,lo=max(la,lb),min(la,lb)
    return (hi+0.05)/(lo+0.05)

print("### 1. 옷 색면 위 라벨 — 자동 대비 선택 검증\n")
garments=[("화이트 셔츠","#EDECE8"),("네이비 티","#34425C"),("블루 데님","#7188A8"),
          ("베이지 팬츠","#BCA98B"),("그레이 재킷","#8F9390"),("화이트 스니커즈","#E8E5DE"),
          ("올리브 카디건","#7B8061")]
print(f"{'옷':16}{'색':10}{'흰글씨':>8}{'검은글씨':>9}  선택     판정")
print("-"*62)
INK="#111111"
for n,h in garments:
    w,k=cr("#FFFFFF",h),cr(INK,h)
    pick="흰 글씨" if w>k else "검은 글씨"
    best=max(w,k)
    print(f"{n:16}{h:10}{w:7.2f}{k:8.2f}  {pick:8} {best:.2f}:1 {'통과' if best>=4.5 else '실패'}")

print("\n### 2. 무채색 토큰 — 라이트 테마\n")
LIGHT=dict(base="#FFFFFF", sunken="#F4F4F4", raised="#FFFFFF",
           hairline="#E0E0E0", structural="#111111",
           primary="#111111", secondary="#595959", tertiary="#767676")
pairs=[("text.primary / surface.base",LIGHT['primary'],LIGHT['base'],4.5),
       ("text.primary / surface.sunken",LIGHT['primary'],LIGHT['sunken'],4.5),
       ("text.secondary / surface.base",LIGHT['secondary'],LIGHT['base'],4.5),
       ("text.secondary / surface.sunken",LIGHT['secondary'],LIGHT['sunken'],4.5),
       ("text.tertiary / surface.base",LIGHT['tertiary'],LIGHT['base'],4.5),
       ("border.hairline / surface.base",LIGHT['hairline'],LIGHT['base'],3.0),
       ("border.structural / surface.base",LIGHT['structural'],LIGHT['base'],3.0)]
for n,a,b,need in pairs:
    r=cr(a,b); print(f"{n:38}{r:6.2f}:1  need {need}  {'통과' if r>=need else '✗ 실패'}")

print("\n### 3. 무채색 토큰 — 다크 테마\n")
DARK=dict(base="#0C0C0C", sunken="#000000", raised="#1A1A1A",
          hairline="#333333", structural="#FFFFFF",
          primary="#FAFAFA", secondary="#A8A8A8", tertiary="#8C8C8C")
pairs=[("text.primary / surface.base",DARK['primary'],DARK['base'],4.5),
       ("text.primary / surface.raised",DARK['primary'],DARK['raised'],4.5),
       ("text.secondary / surface.base",DARK['secondary'],DARK['base'],4.5),
       ("text.secondary / surface.raised",DARK['secondary'],DARK['raised'],4.5),
       ("text.tertiary / surface.base",DARK['tertiary'],DARK['base'],4.5),
       ("border.hairline / surface.base",DARK['hairline'],DARK['base'],3.0)]
for n,a,b,need in pairs:
    r=cr(a,b); print(f"{n:38}{r:6.2f}:1  need {need}  {'통과' if r>=need else '✗ 실패'}")

print("\n### 4. 강조색 후보 (De Stijl 원색) — 흰 글씨 올릴 수 있는가\n")
cands=[("몬드리안 레드 원색","#DE0000"),("레드 조정 A","#CE1126"),("레드 조정 B","#C20017"),
       ("레드 조정 C","#B00020"),("블루 원색","#0B5FA5"),("블루 조정","#0A4D8C"),
       ("옐로 원색","#F2C200")]
print(f"{'후보':22}{'색':10}{'흰글씨':>8}{'검은글씨':>9}{'흰배경위':>10}")
print("-"*62)
for n,h in cands:
    print(f"{n:22}{h:10}{cr('#FFFFFF',h):7.2f}{cr(INK,h):8.2f}{cr(h,'#FFFFFF'):9.2f}")
