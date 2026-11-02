# 03 — 토큰 대응표 (감사 대비)

측정: `python3 -I tools/design/audit_inventory.py src` — 개편 전(master)과 동일 스크립트.

| 속성 | 개편 전 | 개편 후 | 위치 |
|---|---:|---:|---|
| `fontSize` 서로 다른 값 | **30** | **7** | 전부 `src/design/tokens.ts`의 `type` 스케일 |
| `lineHeight` | 15 | 7 | 위와 동일 (size와 한 묶음) |
| `fontWeight` | 6 | **0** | 굵기는 Pretendard 패밀리명으로만 지정 (Regular/Medium/Bold 3종) |
| `borderRadius` 숫자 리터럴 | **20** | **0** | 전부 `theme.radius.{none,sm,card,pill}` 4종 |
| `marginTop` / `paddingHorizontal` / `gap` 리터럴 | 20 / 14 / 11 | 0 / 0 / 1 | 전부 `theme.space` 8단계 (4pt 그리드) |
| UI 색 리터럴 (테마·옷 데이터 제외) | **66** 떠돌이 | **0** | 테마 4종은 `src/design/themes.ts`, 옷 색은 데이터 |
| 그라디언트·그림자 | 4 / 다수 | **0** | 납작한 면 원칙 |
| 이모지 아이콘 | 렌더링됨 | **0** | lucide + 자체 단선 카테고리 그림 |
| 화면 파일 | 1개 1,357줄 | 화면 11 + UI 키트 16 파일 | `src/features/`, `src/ui/` |

## 남은 리터럴 (의도적)

- `gap: 2` — 텍스트 2줄 사이 미세 간격 (4pt 그리드 미만, 시각 보정). 토큰화 후보.
- 옷 색(`colorHex`) — 데이터. 테마와 무관하게 옷 그대로 보여야 하므로 토큰이 아니다.
- `art.yellow` — 일러스트 전용, 텍스트·UI에 쓰지 않음.

## 죽은 코드 처리

`src/constants/theme.ts`, `src/hooks/use-theme.ts`, Expo 템플릿 컴포넌트 9개, `src/global.css`는
앱 화면에서 import되지 않던 코드라 **삭제**했다. 토큰은 `src/design/`이 유일한 출처다.
