# Fullstack_Beginner_Project
### View My Startup

## 📌 소개
이 프로젝트는 Codeit Fullstack Course 14기 3팀의 View My Startup 웹 페이지입니다.<br>
프론트엔드와 백엔드의 기본적인 통합 과정을 주축으로 설계되었습니다.

## 🚀 기능
- 스타트업의 누적 투자금액, 투자 단계, 기업 정보를 한눈에 조회할 수 있는 웹 플랫폼
- 흩어진 스타트업 투자 정보를 통합하여 누구나 쉽게 탐색할 수 있는 서비스
- 고객 친화형 반응형 UI

## 🛠️ 설치 방법
```bash
git clone https://github.com/username/Fullstack_Beginner_Project.git
cd Fullstack_Beginner_Project
npm install
```

## ⚙️ 환경 변수 설정
이 프로젝트는 환경 변수를 사용합니다.<br>
레포지토리에는 `.env.example` 파일이 포함되어 있으며, 이를 기반으로 실제 `.env` 파일을 만들어야 합니다.

```bash
cp .env.example .env
```

## 📖 실행 방법
현재 프로젝트는 monorepo 구조를 사용하고 있으며,<br>
백엔드(BE)는 이미 웹에 호스팅되어 있습니다.<br>
따라서 로컬 개발 환경에서는 프론트엔드(Vite)만 실행하면 됩니다.
```bash
npm run dev
```

### 🔧 백엔드를 로컬에서 실행하고 싶을 경우
1. 백엔드는 `backend` 디렉토리 안에 있으며, 별도의 의존성 설치가 필요합니다.

```bash
cd backend
npm install
```

2. `backend`디렉토리 내부에도 `.env.example` 파일이 포함되어 있으며, 이를 기반으로 실제 `.env` 파일을 만들어야 합니다.
```bash
cp .env.example .env
```

3. PostgreSQL에 데이터베이스를 생성해야 합니다.
```sql
   CREATE DATABASE mydb;
```

4. 로컬이나 개인 DB를 이용하기 위해 `.env`의 `Database_URL`을 수정해야합니다.<br>
또한 각 기업 ID 별로 seeding을 진행하기 위해 `changetopassword`를 DB password로 변경해야 합니다.
```env
DATABASE_URL="postgresql://postgres:비밀번호@localhost:5432/데이터베이스명"
SEED_PASSWORD_기업ID="(DB비밀번호)"
```

5. 그 후 개발 모드로 실행해 주세요.
```bash
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```