# Phase 0 — 현상 감사

> 전제: 루트 `CLAUDE.md`를 읽었다고 가정한다. 코드는 한 줄도 고치지 않는다.

## 지시

`app/src/` 의 UI 코드를 읽고, 화면 단위로 현재 상태를 감사해
`docs/ui/00-audit.md` 를 작성한다.

대상 화면 (`wardrobe-prototype.tsx` 기준):
welcome / import / privacy / scanning / results / capture /
main-today / main-closet / main-my / add-item-modal / auth-modal

## 평가 4축

각 화면을 아래 4축으로만 평가한다. 축마다 **구체적인 코드 근거(파일:줄)** 를 단다.
"예쁘지 않다" 같은 서술은 금지한다. 측정 가능한 지적만 쓴다.

1. **위계(Hierarchy)** — 가장 중요한 요소가 가장 강하게 보이는가.
   fontSize·fontWeight·색·크기가 중요도 순서와 일치하는가.
2. **리듬(Rhythm)** — 간격이 일정한 규칙을 따르는가.
   padding/margin/gap 값이 몇 종류이고, 그중 규칙을 벗어난 값은 무엇인가.
3. **대비(Contrast)** — 텍스트와 배경의 대비비를 **실제로 계산**한다.
   WCAG AA 기준(본문 4.5:1, 18pt 이상 3:1) 미달 조합을 전부 나열한다.
4. **일관성(Consistency)** — 같은 역할의 요소가 화면마다 다르게 생겼는가.
   버튼·카드·칩·헤더의 변형 개수를 센다.

## 추가로 반드시 수치화할 것

- 사용된 `fontSize` 값 전체와 개수
- 사용된 `borderRadius` 값 전체와 개수
- 사용된 `fontWeight` 값 전체와 분포
- 사용된 색상 리터럴(`#RRGGBB`) 전체와 개수, 그중 `palette`에 없는 떠돌이 값
- 터치 가능 요소 중 44×44pt 미만인 것 전부
- 플랫폼 위험 속성(`experimental_backgroundImage` 등) 사용 위치 전부

## 출력 형식

```
# 00 — 현상 감사
## 요약 (문제 상위 10개, 영향도 순)
## 수치 인벤토리
## 화면별 감사
### welcome
| 축 | 문제 | 근거 | 영향도 |
...
## 출시 차단 항목 (이것들이 안 고쳐지면 출시 불가)
```

영향도는 `치명 / 높음 / 중간 / 낮음` 4단계로만 적는다.
