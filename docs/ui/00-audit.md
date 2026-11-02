# 00 — 현상 감사

대상: `app/src/` (jeongujeong117-byte/jarvis-wardrobe @ 969eee0)
수행: 2026-11-03 KST · 방법: 정적 코드 분석 + WCAG 대비비 계산
미확인: 실행 중 스크린샷 (Expo 웹 구동 전)

---

## 요약 — 출시를 막는 문제 10개 (영향도 순)

| # | 문제 | 수치 근거 | 영향도 |
|---|---|---|---|
| 1 | 디자인 토큰 부재 | `fontSize` **30종**, `borderRadius` **20종**, 색 리터럴 **77종** | 치명 |
| 2 | 접근성 대비 미달 | 검사한 18개 텍스트 조합 중 **9개 실패** | 치명 |
| 3 | 토큰 파일이 죽어 있음 | `constants/theme.ts`를 메인 화면이 import하지 않음 | 치명 |
| 4 | 색 이름이 실제 색과 불일치 | `green`=#7658C7(보라), `orange`=#D96D9F(핑크), `olive`=#B496C7(연보라) | 높음 |
| 5 | UI 크롬이 옷 색을 압도 | 보라–핑크 그라디언트 4곳, 옷은 색면으로만 표현됨 | 높음 |
| 6 | 1357줄 단일 파일 | 7화면+3탭+2모달이 한 파일, `StyleSheet` 키 300여 개 | 높음 |
| 7 | 위계 없는 굵기 | `fontWeight` 600/700/800/900이 73회 중 대부분 | 높음 |
| 8 | 다크모드 미동작 | `_layout.tsx` `StatusBar style="dark"` 고정, 메인 화면 `useTheme` 미사용 | 높음 |
| 9 | 아이콘이 텍스트 글리프 | `◫ ‹ › ↻ ✦ ＋ ☀` — 플랫폼별 렌더 불일치, 스크린리더가 읽음 | 중간 |
| 10 | 플랫폼 미지원 속성 | `experimental_backgroundImage` 사용 — 네이티브 동작 불확실 | 중간 |

---

## 수치 인벤토리

| 속성 | 서로 다른 값 | 총 사용 | 값 |
|---|---:|---:|---|
| `fontSize` | **30** | 124 | 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,27,28,29,30,31,32,36,44,46,48,54,55 |
| `borderRadius` | **20** | 74 | 4,5,8,9,10,11,12,13,14,15,16,17,18,19,20,22,24,28,35,40 |
| `lineHeight` | **15** | 27 | 16,17,18,19,20,22,23,24,27,30,38,40,44,52,58 |
| `fontWeight` | 6 | 73 | 300,400,600,700,800,900 |
| `marginTop` | **20** | 53 | 1,3,4,5,6,8,9,12,14,15,16,17,18,20,22,24,26,28,32,34 |
| `paddingHorizontal` | **14** | 31 | 7,8,9,10,12,13,14,15,16,18,20,22,24,38 |
| `gap` | 11 | 26 | 2,3,5,7,8,9,10,11,12,14,17 |
| `padding` | 8 | 15 | 11,13,14,15,16,17,18,22 |
| `paddingVertical` | 9 | 12 | 3,5,6,7,8,9,10,13,40 |
| 색 리터럴 `#RRGGBB` | **77** | 121 | — |

**해석.** 간격 값이 1,3,5,7,9,11,13,14,17처럼 홀수·비배수로 흩어져 있다.
어떤 기준 단위(4pt/8pt)에도 맞지 않으므로 리듬이 성립하지 않는다.
`fontSize` 30종은 스케일이 아니라 눈대중의 결과다.

색 리터럴 77종 중 `palette` 객체에 정의된 건 11개뿐이다.
나머지 **66종이 스타일 안에 직접 박힌 떠돌이 색**이다.

---

## 대비비 검증 (WCAG 2.1 AA)

기준: 본문 4.5:1 / 18pt 이상 또는 비텍스트 3:1

| 조합 | 대비비 | 기준 | 판정 |
|---|---:|---:|---|
| ink #261E2C / canvas #FBF9FE | 15.40:1 | 4.5 | 통과 |
| ink / surface #FFFFFF | 16.10:1 | 4.5 | 통과 |
| muted #776F7D / canvas | 4.61:1 | 4.5 | 통과 (여유 없음) |
| muted / surface | 4.82:1 | 4.5 | 통과 |
| muted / soft #F7EFFB | 4.29:1 | 4.5 | **실패** |
| eyebrow orange #D96D9F / canvas (13pt) | 3.03:1 | 4.5 | **실패** |
| stepLabel orange / canvas (11pt) | 3.03:1 | 4.5 | **실패** |
| green #7658C7 / greenSoft #F0EBFF (10pt) | 4.52:1 | 4.5 | 통과 (경계) |
| green / surface | 5.26:1 | 4.5 | 통과 |
| green / soft | 4.68:1 | 4.5 | 통과 |
| danger #B45174 / #FCEAF2 (10pt) | 4.16:1 | 4.5 | **실패** |
| 흰 글씨 / green 버튼 | 5.26:1 | 4.5 | 통과 |
| **흰 글씨 / 버튼 그라디언트 핑크 끝 #D96D9F** | **3.16:1** | 4.5 | **실패** |
| optionArrow #9A9C96 / surface | 2.77:1 | 3.0 | **실패** |
| line #E9E1EF / surface (구분선) | 1.27:1 | 3.0 | **실패** |
| olive #B496C7 / surface | 2.58:1 | 4.5 | **실패** |
| demoNoticeTitle orange / #FFF0F7 (11pt) | 2.87:1 | 4.5 | **실패** |
| prototypeBadge green / greenSoft (9pt) | 4.52:1 | 4.5 | 통과 (경계) |

**18개 중 9개 실패 (50%).**

가장 심각한 건 **기본 버튼**이다. `buttonPrimary`는
`linear-gradient(100deg, #D96D9F, #7658C7)` 위에 흰 글씨를 올리는데,
핑크 쪽 끝에서 **3.16:1**로 떨어진다. 앱에서 가장 많이 눌리는 요소가 AA를 못 넘는다.

`orange`(#D96D9F)는 강조색인데 밝은 배경 위 **3.03:1**이다.
그런데 쓰이는 자리가 전부 11~13pt 작은 글씨라 AA 예외도 못 받는다.
**이 색은 텍스트 색으로 쓸 수 없다.**

---

## 화면별 감사

### welcome
| 축 | 문제 | 근거 |
|---|---|---|
| 위계 | `displayTitle` 31pt/800 + `eyebrow` 13pt/800 + `appName` 18pt/800 — 셋 다 800이라 크기로만 구분됨 | `styles.displayTitle`, `eyebrow`, `appName` |
| 리듬 | `paddingTop:8` → `marginTop:28` → `paddingTop:28` → `marginTop:14` 혼재 | `welcomeTop`, `wardrobeVisual`, `welcomeCopy`, `bodyCopy` |
| 대비 | `eyebrow` orange 3.03:1 실패 | 계산 결과 |
| 일관성 | 히어로 비주얼이 하드코딩 옷걸이 그림 — 다른 화면과 무관한 1회용 구조 | `wardrobeVisual`~`visualShoe` 9개 스타일 |

### import / privacy
| 축 | 문제 | 근거 |
|---|---|---|
| 위계 | `optionTitle` 16/800 vs `optionDescription` 12/400 — 점프가 커서 중간 단계 없음 | `OptionCard` |
| 리듬 | `optionCard` padding 16, `privacyList` padding 18, `infoStrip` padding 14 — 같은 역할의 카드가 셋 다 다름 | 각 스타일 |
| 대비 | `stepLabel` 3.03:1, `optionArrow` 2.77:1 실패 | 계산 결과 |
| 일관성 | 카드 radius: optionCard 20, privacyList 20, infoStrip 14, demoNotice 16 | 4종 |

### scanning / results / capture
| 축 | 문제 | 근거 |
|---|---|---|
| 위계 | `resultCount` 25pt와 `scanningTitle` 24pt가 거의 동일 — 서로 다른 중요도인데 구분 안 됨 | 각 스타일 |
| 리듬 | `scanProgress` marginTop 34, `scanSteps` 24, `resultList` 24, `resultGuide` 12 | 비배수 혼재 |
| 대비 | `resultBadgeText` danger 4.16:1 실패 (10pt) | 계산 결과 |
| 일관성 | 진행률 바가 `width:'78%'` **하드코딩** — 실제 진행과 무관한 가짜 UI | `scanProgressFill` |

### main-today
| 축 | 문제 | 근거 |
|---|---|---|
| 위계 | 추천 카드 안에 `outfitKicker`/`outfitTitle`/`matchBadge`/`reasonText`/버튼 2개 — 시선 진입점이 없음 | `TodayScreen` |
| 리듬 | 칩 `paddingVertical` 과 카드 간격이 서로 다른 단위 | `chip`, `outfitCard` |
| 대비 | 옷 색면 위 `outfitLabelText` — 옷 색이 데이터에 따라 바뀌므로 **대비 보장 불가** | `outfitLabel` |
| 일관성 | 액션 버튼이 `PrimaryButton`이 아닌 `rerollButton`/`wearButton` 별도 구현 | 2개 1회용 버튼 |

**치명적 지점.** `outfitItem` 배경이 `item.colorHex`(옷 색)인데 그 위에 라벨 텍스트를 올린다.
화이트 옷 `#EDECE8`이면 흰 라벨이 사라지고, 네이비 `#34425C`면 검은 라벨이 사라진다.
사진이 없어 색면이 곧 옷인 구조에서 **라벨 대비를 색에 따라 자동 계산하지 않는 건 출시 차단 사유**다.

### main-closet / main-my / add-item-modal / auth-modal
| 축 | 문제 | 근거 |
|---|---|---|
| 위계 | 섹션 제목과 본문이 전부 800/600 — 스캔 불가 | 전역 |
| 리듬 | 그리드 간격과 외부 여백이 다른 단위 | `ClosetScreen` |
| 대비 | 입력 필드 테두리 `line` 1.27:1 — **테두리가 사실상 안 보임** | `line` 계산 결과 |
| 일관성 | 탭바·헤더·모달 헤더가 각각 다른 높이·정렬 | `TabButton`, `backHeader` |

---

## 출시 차단 항목

이것들이 안 고쳐지면 출시 불가.

1. **기본 버튼 대비 3.16:1** — 가장 많이 쓰는 요소가 AA 미달
2. **옷 색면 위 라벨 대비 미보장** — 데이터에 따라 텍스트가 사라짐
3. **입력 필드 테두리 1.27:1** — 폼 경계가 보이지 않음
4. **대비 실패 9건 전체**
5. **다크모드 미동작** — 선언만 있고 연결 안 됨
6. **토큰 부재** — 위 문제들을 개별 수정해도 재발을 막을 구조가 없음

## 다음

Phase 1에서 위 항목들을 해결하는 **색·타이포·간격 전략**을 확정한다.
특히 "옷 색면 위 라벨" 문제는 토큰만으로 안 되고 **대비 자동 계산 유틸**이 필요하다.
