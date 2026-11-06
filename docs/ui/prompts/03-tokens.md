# Phase 3 — 디자인 토큰 레이어

> 전제: 사용자가 Phase 2에서 1안을 선택했다.

## 지시

선택된 안을 **단일 진실 공급원(single source of truth)** 으로 코드화한다.
`app/src/design/` 아래에 만든다.

```
app/src/design/
├── tokens.ts      원시 토큰 (색 값, 크기 숫자) — 화면에서 직접 쓰지 않는다
├── semantic.ts    의미 토큰 (surface.base, text.primary, border.structural …)
├── typography.ts  타입 스케일: size + lineHeight + weight + letterSpacing 묶음
├── theme.ts       light / dark 테마 조립
└── index.ts       공개 API
```

## 반드시 지킬 것

1. **의미 기반 이름만 쓴다.** `green`, `orange` 같은 색 이름 금지.
   `surface.raised`, `text.secondary`, `border.structural`, `accent.selected` 형태.
   현재 `palette`의 거짓 이름(green=보라)이 이 규칙이 필요한 이유다.
2. **원시 토큰과 의미 토큰을 분리한다.** 화면 코드는 의미 토큰만 import한다.
3. **타입 안전하게.** `as const` + 파생 타입으로, 없는 토큰을 쓰면 TS 에러가 나야 한다.
4. **라이트/다크 둘 다 정의한다.** 다크를 "나중에"로 미루지 않는다. 지금 구조에 넣는다.
5. **죽은 `app/src/constants/theme.ts` 처리를 결정한다.** 흡수할지 삭제할지 명시하고 실행한다.
6. 토큰 파일에 **각 값의 근거를 주석으로** 남긴다. 특히 대비비 계산 결과.

## 산출물에 포함할 것

- 토큰 파일 일습
- `docs/ui/03-token-map.md`: 기존 하드코딩 값 → 새 토큰 매핑표
  (fontSize 27종이 몇 종으로, borderRadius 19종이 몇 종으로 줄었는지 수치로)
- 대비비 검증 결과: 모든 text/surface 조합의 계산값 표

## 금지

- 이 Phase에서 화면 레이아웃을 바꾸지 않는다. 토큰만 만든다.
- 토큰을 만들면서 동시에 컴포넌트를 리팩터링하지 않는다. (원칙 3: 한 번에 한 레이어)
