# 자비스 — 기능 검증용 패션 앱 프로토타입

쇼핑몰 주문메일에서 구매한 옷을 가져오고, 날씨와 일정에 맞춰 오늘의 코디를 추천하는 모바일 앱의 1차 프로토타입입니다.

## 오늘 구현한 범위

- 온보딩과 옷 가져오기 방법 선택
- Gmail 연결 전 개인정보 안내
- 샘플 주문메일 검색 및 6개 상품 선택 가져오기
- 주문내역 캡처 인식 데모
- 오늘 날씨·일정에 따른 코디 추천과 다른 코디 보기
- 카테고리 필터가 있는 내 옷장
- 상품명·카테고리·색상을 입력하는 직접 등록
- 연결 상태와 제출 범위를 보여주는 마이 화면
- Supabase 초기 DB 스키마, RLS 보안 정책, 앱 데이터 연결 계층
- 이메일·비밀번호 회원가입, 로그인, 로그아웃 화면

현재 Gmail, 캡처 인식, 날씨는 실제 외부 서비스 대신 샘플 데이터로 동작합니다. Supabase 환경 변수가 없거나 로그인하지 않은 상태에서는 직접 등록 데이터도 데모 모드로 동작합니다.

## 실행하기

Node.js가 설치된 PC에서 아래 명령을 실행합니다.

```powershell
cd "C:\Users\jeong\Desktop\ai 활용\wardrobe-app"
npm install
npm start
```

- 휴대폰: Expo Go 앱으로 터미널의 QR 코드를 스캔합니다.
- 브라우저: 실행 중 터미널에서 `w`를 누릅니다.

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

1. `내 옷장 시작하기`를 누릅니다.
2. `Gmail 연결하기`에서 개인정보 안내를 확인합니다.
3. `Gmail 연결 데모 시작`을 눌러 6개 상품을 가져옵니다.
4. 오늘 화면에서 일정과 `다른 코디`를 눌러 추천 변화를 보여줍니다.
5. 옷장 탭에서 카테고리를 필터링하고 `+`로 새 옷을 등록합니다.
6. 마이 탭에서 현재 구현 범위와 Gmail 데모 연결 상태를 보여줍니다.

## 다음 개발 순서

1. Supabase 프로젝트 생성과 환경 변수 입력
2. 회원가입·로그인·직접 등록의 실제 DB 동작 확인
3. 이미지 저장소와 상품 수정·삭제
4. Google OAuth와 Gmail API 연결
5. 주문메일 파서, AI 추출, 중복·취소 처리
6. 실제 날씨 API와 추천 규칙 고도화

## 주요 파일

- `src/components/wardrobe-prototype.tsx`: 전체 화면과 상호작용
- `src/components/auth-modal.tsx`: 회원가입·로그인 화면
- `src/data/wardrobe.ts`: 샘플 옷 데이터와 분류 정보
- `src/lib/supabase.ts`: Supabase 클라이언트와 로그인 세션 저장
- `src/services/clothing-items.ts`: 옷 저장·조회 데이터 계층
- `supabase/migrations/20260827000100_initial_schema.sql`: DB와 보안 정책
- `src/app/index.tsx`: 앱 시작 화면
