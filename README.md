# 식당 예약 시스템 (백엔드)

## 1. 프로젝트 개요

본 프로젝트는 NestJS 기반 식당 예약 시스템 API 서버입니다.

## 2. 주요 기능

### 🍽️ 식당 (Restaurant)

- **로그인:** 사전에 등록된 계정으로 로그인하여 JWT 인증 토큰을 발급받습니다.
- **메뉴 관리 (CRD):**
  - **C (생성):** 새로운 메뉴(이름, 가격, 카테고리, 설명)를 등록합니다.
  - **R (조회):** 자신의 가게에 등록된 모든 메뉴를 조회하며, 이름(부분 일치), 최소/최대 가격으로 필터링할 수 있습니다.
  - **D (삭제):** 등록된 메뉴를 삭제합니다.
- **예약 관리:**
  - 자신의 가게에 접수된 모든 예약을 조회하며, 고객 전화번호, 예약 날짜, 최소 인원수, 포함된 메뉴 이름으로 필터링할 수 있습니다.

### 👤 고객 (Customer)

- **로그인:** 사전에 등록된 계정으로 로그인하여 JWT 인증 토큰을 발급받습니다.
- **예약 관리 (CRUD):**
  - **C (생성):** 특정 식당을 지정하여 원하는 날짜와 시각에 예약을 생성합니다. (과거 시간 및 중복 시간 예약 불가)
  - **R (조회):** 자신이 생성한 모든 예약 내역을 조회합니다.
  - **U (수정):** 예약의 인원수와 메뉴 구성을 수정합니다.
  - **D (삭제):** 생성한 예약을 취소(삭제)합니다.

## 3. 적용 기술 스택

- **Language & Framework:** NestJS, TypeScript
- **Database:** MySQL
- **ORM:** TypeORM
- **Authentication:** JWT, Passport.js
- **API Documentation:** Swagger
- **Testing:** Jest, Supertest (E2E Test)

## 4. 시작하기

### 4.1. 사전 요구사항

- Node.js (v18 이상 권장)
- npm (v10 이상 권장)
- MySQL

### 4.2. 설치

1.  **프로젝트 클론**

    ```bash
    git clone https://github.com/heizence/Restaurant-reservation-system.git
    cd Restaurant-reservation-system
    ```

2.  **의존성 패키지 설치**

    ```bash
    npm install
    ```

3.  **환경 변수 설정**
    - 프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 채워넣습니다.
    ```env
    # .env.example
    DB_HOST=host_name
    DB_PORT=port_number
    DB_USERNAME=username
    DB_PASSWORD=your_db_password
    DB_DATABASE=your_db_database
    JWT_SECRET_KEY=your_local_secret_key
    SERVER_PORT=8000
    ```

### 4.3. 애플리케이션 실행

- **개발 모드로 실행 (파일 변경 시 자동 재시작)**

  ```bash
  npm run start:dev
  ```

- **Nest 명령어로 실행(자동 재시작 없음)**
  ```bash
  nest start
  ```

### 4.4 서버 확인

http://localhost:8000 으로 접속하여 "Restaurant Reservation API is running!" 이라는 메시지가 잘 출력되는지 확인합니다.

Swagger API 문서 : http://localhost:8000/api 

## 5. 테스트

- 프로젝트에 포함된 모든 E2E 테스트를 실행합니다.
- 테스트 실행 전, 테스트용 데이터베이스가 준비되어 있어야 합니다.

```bash
npm run test:e2e
```
