# 자비스 — 나의 일상·패션 비서

쇼핑몰 주문메일에서 구매한 옷을 가져오고, 날씨와 일정에 맞춰 오늘의 코디를 추천하는 모바일 앱의 1차 프로토타입입니다.

## 구현한 범위

- 온보딩과 옷 가져오기 방법 선택
- Gmail 연결 전 개인정보 안내
- 샘플 주문메일 검색 및 6개 상품 선택 가져오기
- 주문내역 캡처 인식 데모
- 샘플 날씨와 상황별 안내, 옷장 조합 미리보기, 다른 코디 보기
- 이름·색상 검색과 카테고리 필터가 있는 내 옷장
- 상품명·카테고리·색상을 입력하는 직접 등록
- 연결 상태와 제출 범위를 보여주는 마이 화면
- Supabase 초기 DB 스키마, RLS 보안 정책, 앱 데이터 연결 계층
- 이메일·비밀번호 회원가입, 로그인, 로그아웃 화면

현재 Gmail, 캡처 인식, 날씨, 코디 추천은 실제 외부 서비스/AI 대신 샘플 데이터와 단순 조합으로 동작합니다. 상황 선택은 안내 문구만 바꾸며 의류 적합도를 분석하지 않습니다. Supabase 환경 변수가 없거나 로그인하지 않은 상태에서는 직접 등록 데이터도 메모리에서만 유지됩니다. 샘플 옷과 코디 선택은 로그인 여부와 관계없이 새로고침하면 사라집니다. 로그인한 뒤 직접 등록한 옷만 계정 저장 경로를 사용합니다.

## 디자인

따뜻한 흰색, 스톤 뉴트럴, 작은 라벤더·블러시 강조와 그래파이트 버튼으로 정리했습니다. 모바일은 2열 옷장, 넓은 화면은 3열 옷장과 2단 코디 화면을 제공합니다.

- [공식 레퍼런스·색상·디자인 제작 브리프](docs/DESIGN_DIRECTION.md)
- [검증 범위와 남은 작업](docs/QA_DESIGN_REFRESH.md)

의류 사진은 이번 시연용 AI 생성 이미지입니다. 알려진 샘플 상품에만 표시하고, 직접 등록한 옷에는 ‘사진 미등록’을 표시합니다.

## 실행하기

Node.js가 설치된 PC에서 아래 명령을 실행합니다.

```powershell
cd "C:\Users\jeong\Desktop\ai 활용\wardrobe-app"
npm install
npm start
```

- 휴대폰: Expo Go 앱으로 터미널의 QR 코드를 스캔합니다.
- 브라우저: 실행 중 터미널에서 `w`를 누릅니다.

이 작업 환경에서 파일 감시가 `UNKNOWN: scandir` 오류로 시작되지 않을 때는 아래 임시 방법으로 웹 미리보기를 확인할 수 있습니다. 파일 감시가 꺼지므로 소스를 바꾸면 서버를 재시작해야 합니다. 손상된 의존성 폴더 자체를 복구하는 방법은 아닙니다.

```powershell
$env:CI = '1'
npx expo start --web --port 8081
```

일반 개발 모드로 돌아갈 때는 서버를 종료하고 `Remove-Item Env:CI`로 현재 터미널의 설정을 지웁니다.

## Supabase 연결하기

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/migrations/20260827000100_initial_schema.sql`을 실행합니다.
3. 프로젝트의 `.env.example`을 복사해 `.env`를 만듭니다.
4. Supabase Connect 화면의 Project URL과 Publishable key를 `.env`에 입력합니다.
5. 개발 서버를 다시 실행합니다.

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

`service_role` 키는 앱에 절대 넣지 않습니다. 사용자별 데이터는 로그인과 RLS 정책으로 보호합니다.

## 1분 시연 순서

1. `샘플 옷장 둘러보기`로 6벌이 있는 오늘 화면을 엽니다.
2. 상황을 바꾸어 안내를 보고, `다른 코디 보기`로 예시 조합을 바꿉니다.
3. `오늘 이렇게 입기`로 이번 미리보기의 코디를 선택합니다.
4. `내 옷장`에서 이름·색상을 검색하고 카테고리를 필터링합니다.
5. `+`로 새 옷을 직접 등록합니다. 로그인 전에는 임시 데이터입니다.
6. `옷 가져오기` → `주문메일에서 가져오기` → `샘플 주문메일 살펴보기`로 상품 선택 흐름을 봅니다.
7. `마이`에서 로그인 화면과 실제/샘플 기능 안내를 확인합니다.

## 다음 개발 순서

1. Supabase 프로젝트 생성과 환경 변수 입력
2. 회원가입·로그인·직접 등록의 실제 DB 동작 확인
3. 이미지 저장소와 상품 수정·삭제
4. Google OAuth와 Gmail API 연결
5. 주문메일 파서, AI 추출, 중복·취소 처리
6. 실제 날씨 API와 추천 규칙 고도화

## 주요 파일

- `src/components/wardrobe-prototype.tsx`: 가져오기·마이·직접 등록과 앱 상태
- `src/components/jarvis-screens.tsx`: 시작·오늘·옷장 화면
- `src/components/jarvis-visuals.tsx`: 공통 아이콘·브랜드·샘플 의류 이미지
- `src/constants/jarvis-theme.ts`: 공통 색상 토큰
- `src/components/auth-modal.tsx`: 회원가입·로그인 화면
- `src/data/wardrobe.ts`: 샘플 옷 데이터와 분류 정보
- `src/lib/supabase.ts`: Supabase 클라이언트와 로그인 세션 저장
- `src/services/clothing-items.ts`: 옷 저장·조회 데이터 계층
- `supabase/migrations/20260827000100_initial_schema.sql`: DB와 보안 정책
- `src/app/index.tsx`: 앱 시작 화면
