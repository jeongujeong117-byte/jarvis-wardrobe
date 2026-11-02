# 진행 상태 — jarvis UI 개편

최종 갱신: 2026-11-03 KST · 브랜치 `ui/redesign`

## 한눈에

| Phase | 상태 | 산출 |
|---|---|---|
| 0 현상 감사 | ✅ | `docs/ui/00-audit.md` |
| 1 방향 확정 (v2: Clutter·unistyles 반영) | ✅ | `docs/ui/01-brief.md` (10절 우선) |
| 2 시안 비교 | ⏭ 생략 | 사용자가 참조(몬드리안+Clutter)와 착수를 확정 → 단일안으로 직행 |
| 3 토큰·테마 | ✅ | `src/design/`, `docs/ui/03-token-map.md` |
| 4 화면 분해·적용 | ✅ | `src/ui/`, `src/features/` |
| 5 검증 | ✅ (기기 항목 미확인) | `docs/ui/05-verification.md` |
| 후속 | ⬜ | `docs/ui/04-tickets.md` — **다음은 T1** |

## 확정 결정

- 참조: 몬드리안(구조·색면·신호색 하나) + **Clutter**(굵은 2줄 헤드라인, 큰 숫자, 사용자 테마, 단선 일러스트, 세그먼트 탭). Taggy 제외.
- 실제 옷 사진: 범위 제외 → 옷 = 색면. UI는 무채색 액자.
- 스타일링: **unistyles 3.8.0** + nitro-modules 0.37.1. **Expo Go 불가 → 개발 빌드**.
- 폰트: Pretendard 400/500/700 번들.
- 테마 4종 (화이트·크림·올리브·블랙) + 자동(시스템). 52개 대비 조합 전부 AA.

## 재개 방법 (새 세션용)

1. `docs/ui/DESIGNER.md`(역할·원칙)와 이 파일을 읽는다
2. `docs/ui/04-tickets.md`에서 상태 `대기`인 **첫 티켓 하나**만 한다
3. 검증: `npx tsc --noEmit` · `npm run lint` · `python3 -I tools/design/theme_check.py` · `npx tsx tools/design/oncolor-check.ts` · `npx expo export --platform web` 후 화면 확인
4. `ui/redesign` 브랜치에 커밋·푸시, 티켓 상태와 이 파일 갱신

## 스킬 (`.claude/skills/`)

- `react-native-unistyles-v3` — unistyles 공식 에이전트 스킬 (MIT)
- `expo-design-system` — Expo 공식 디자인 시스템·native-slop 체크 스킬 (MIT)
