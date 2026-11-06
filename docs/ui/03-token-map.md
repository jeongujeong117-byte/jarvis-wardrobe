# 03 — 토큰 대응표 (감사 대비)

측정: `python3 -I tools/design/audit_inventory.py src` (개편 전 master와 같은 스크립트).
현재 방향: **v3 모더니즘 × 만년필** (`06-modernist-analysis.md`).

| 속성 | 개편 전 | v3 | 위치 |
|---|---:|---:|---|
| `fontSize` 종류 | **30** | 10 (토큰 7 + 아래 예외 3) | `src/design/tokens.ts` `type` |
| `fontWeight` 리터럴 | 6종 73회 | **0** | 굵기는 패밀리로: Pretendard Regular·Medium 2종 + 필기체 1종 |
| `borderRadius` 리터럴 | **20** | **0** | `radius.none`(모든 색면)·`sheet`·`pill`(주요 버튼) 3종 |
| 간격 리터럴 | 수십 종 | `gap: 2` 하나 | `theme.space` 8단계 |
| UI 색 리터럴 (옷 데이터 제외) | **66** | **0** | 테마 2종(종이·밤)은 `themes.ts`, 펜 일러스트 색도 테마 잉크 |
| 그라디언트·그림자 | 4 / 다수 | **0** | |
| 테마 | 1 (다크 미동작) | 2 (시스템 따라감) | v2의 4종 선택 기능은 제거 |

## 예외 리터럴 (의도적)

- `Wordmark` 38 / 72pt — 필기체 이름은 화면 크기별 두 크기만. 토큰화 후보
- `Field` 입력 글자 17pt — iOS에서 16pt 미만이면 입력 시 화면이 확대되는 것을 막는 값
- `gap: 2` — 두 줄 텍스트 사이 시각 보정

## 펜 드로잉

`src/design/pen-drawings.ts`는 **생성물**이다. 직접 고치지 말고 `tools/design/pen.py`의 중심선을 고친 뒤
`python3 -I tools/design/pen.py src/design/pen-drawings.ts`로 다시 만든다.
