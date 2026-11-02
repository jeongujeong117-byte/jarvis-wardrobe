# 진행 상태 — jarvis UI 개편

최종 갱신: 2026-11-03 KST · 브랜치 `ui/redesign` · PR #3

## 현재 방향: v3 모더니즘 × 만년필

**판단 기준 문서: `docs/ui/06-modernist-analysis.md`** (요소 분석 → 시안 3개 → 평가 → 채택)

- 구조는 기계가, 의미는 손이: 그리드·산세리프·평평한 색면이 기능을, 필기체·만년필 드로잉이 기억할 순간을 맡는다
- 색: 종이 `#FBFBF9` · 블루블랙 잉크 `#1F2A44` · 주홍 낙관(워드마크·위험 동작) — 그 외 색은 옷뿐
- 서명 요소: **평평한 색면 + 어긋나게 겹친 만년필 윤곽**. 색면과 겹치는 선은 자동 반전
- 선택 = 펜 동그라미, 현재 탭 = 펜 밑줄, 완료 = 펜 체크
- 필기체(Mrs Saint Delafield)는 워드마크와 요일 서명에만
- 테마: 종이·밤 2종, 시스템 설정을 따름

## 이력

| 버전 | 내용 | 상태 |
|---|---|---|
| v1 | 원래 프로토타입 (보라–핑크 그라디언트) | 감사 `00-audit.md` |
| v2 | 몬드리안 격자 + Clutter 요소 차용, 테마 4종 | **폐기** — 사용자 정정: 참조 차용이 아니라 모더니즘 감각 + 손의 선 |
| v3 | 모더니즘 × 만년필 | ✅ 구현·검증 (`05-verification.md`) |

v2에서 유지한 것: unistyles 3.8, 토큰 구조, `onColor()` 대비 계산, Pretendard, 화면 분해(11개 파일), 기능 로직 불변.

## 다음

`docs/ui/04-tickets.md` — **T1부터**.

## 재개 방법 (새 세션용)

1. 이 파일과 `06-modernist-analysis.md`, `DESIGNER.md`(역할)를 읽는다. 방향 충돌 시 **06이 우선**
2. `04-tickets.md`에서 `대기`인 첫 티켓 하나만 한다
3. 검증: `npx tsc --noEmit` · `npm run lint` · `python3 -I tools/design/theme_check.py` · `npx tsx tools/design/oncolor-check.ts` · `npx expo export --platform web` 후 화면 확인
4. 펜 드로잉을 바꾸려면 `tools/design/pen.py`를 고치고 `python3 -I tools/design/pen.py src/design/pen-drawings.ts`
5. `ui/redesign`에 커밋·푸시, 이 파일과 티켓 갱신

## 참고한 스킬

`.claude/skills/`: `react-native-unistyles-v3`, `expo-design-system` (설치됨).
평가에 쓴 외부 스킬 규칙(읽기만, 실행 안 함): `frontend-design`(세션 내장), impeccable(`critique` Nielsen 채점, `craft-floor` 금지 목록, `operate`·`typeset`), ui-ux-pro-max(스타일·서체 데이터).
