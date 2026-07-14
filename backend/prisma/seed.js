import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma.js';

const companies = [
  {
    id: 'f8q2mz',
    name: '비바리퍼블리카',
    description:
      '토스를 운영하는 핀테크 기업으로 간편송금, 결제, 대출 비교, 증권, 은행 등 다양한 금융 서비스를 모바일 앱 안에서 연결한다. 금융을 복잡한 절차가 아니라 일상적인 사용자 경험으로 바꾸는 것을 목표로 성장해 왔다.',
    category: '핀테크',
    actualInvestmentAmount: 1600000000000n,
    revenue: 667170760000n,
    employeeCount: 1788,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'k3p9av',
    name: '당근마켓',
    description:
      '지역 기반 중고거래 서비스에서 시작해 동네생활, 지역 광고, 로컬 커뮤니티 기능으로 확장한 하이퍼로컬 플랫폼 기업이다. 사용자가 사는 동네를 중심으로 사람과 정보를 연결하는 서비스 구조가 핵심이다.',
    category: '지역커뮤니티',
    actualInvestmentAmount: 227000000000n,
    revenue: 189100000000n,
    employeeCount: 623,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'r7x1tq',
    name: '버킷플레이스',
    description:
      '오늘의집을 운영하며 인테리어 콘텐츠, 상품 구매, 시공 연결을 하나의 흐름으로 제공하는 라이프스타일 플랫폼 기업이다. 사용자가 집을 꾸미는 과정에서 탐색부터 구매와 시공까지 이어지도록 서비스를 확장해 왔다.',
    category: '라이프스타일',
    actualInvestmentAmount: 323000000000n,
    revenue: 321567780000n,
    employeeCount: 723,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'b6n4yc',
    name: '야놀자',
    description:
      '숙박 예약 플랫폼에서 출발해 여행, 레저, 글로벌 호스피탈리티 솔루션 영역으로 확장한 트래블테크 기업이다. 예약 서비스뿐 아니라 여행 관련 데이터와 운영 솔루션을 연결해 글로벌 시장까지 사업을 넓히고 있다.',
    category: '트래블테크',
    actualInvestmentAmount: 2371000000000n,
    revenue: 1029200000000n,
    employeeCount: 1000,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'z2h8kd',
    name: '무신사',
    description:
      '온라인 패션 플랫폼을 중심으로 브랜드 입점, 자체 브랜드, 오프라인 스토어, 패션 콘텐츠 사업을 함께 운영하는 패션 커머스 기업이다. 국내 패션 브랜드와 소비자를 연결하는 대표적인 버티컬 커머스 플랫폼으로 성장했다.',
    category: '패션커머스',
    actualInvestmentAmount: 430000000000n,
    revenue: 1352929940000n,
    employeeCount: 2127,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'm9v5jx',
    name: '컬리',
    description:
      '마켓컬리와 뷰티컬리를 운영하며 식품, 생활용품, 뷰티 상품을 빠르게 배송하는 리테일테크 기업이다. 새벽배송 운영 노하우와 상품 큐레이션을 기반으로 프리미엄 장보기 경험을 제공하는 것이 핵심 경쟁력이다.',
    category: '리테일테크',
    actualInvestmentAmount: 883200000000n,
    revenue: 2359500000000n,
    employeeCount: 2853,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'p4c7wu',
    name: '직방',
    description:
      '부동산 정보 플랫폼으로 시작해 아파트, 원룸, 오피스텔 정보와 스마트홈 사업까지 확장한 프롭테크 기업이다. 부동산 탐색 과정의 정보 비대칭을 줄이고 주거 관련 기술 서비스를 연결하는 방향으로 성장해 왔다.',
    category: '프롭테크',
    actualInvestmentAmount: 320000000000n,
    revenue: 92200000000n,
    employeeCount: 248,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'x1g6ra',
    name: '리디',
    description:
      '전자책, 웹툰, 웹소설 등 디지털 콘텐츠 서비스를 운영하는 콘텐츠 플랫폼 기업이다. 국내 전자책 서비스에서 출발해 웹툰과 글로벌 콘텐츠 플랫폼으로 확장하며 IP 기반 사업 경쟁력을 키우고 있다.',
    category: '콘텐츠',
    actualInvestmentAmount: 380000000000n,
    revenue: 249495200000n,
    employeeCount: 429,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'd5t9pq',
    name: '모두싸인',
    description:
      '전자서명과 전자계약 서비스를 제공하는 B2B SaaS 기업이다. 계약서 작성, 서명 요청, 체결, 보관 과정을 온라인으로 처리할 수 있게 만들어 기업의 계약 업무를 빠르고 간단하게 바꾸는 데 집중하고 있다.',
    category: 'SaaS',
    actualInvestmentAmount: 32100000000n,
    revenue: 9310000000n,
    employeeCount: 92,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'h8s2bn',
    name: '채널코퍼레이션',
    description:
      '채널톡을 운영하며 고객 상담, CRM, 마케팅, AI 상담 자동화 기능을 제공하는 B2B SaaS 기업이다. 기업이 고객과 대화하고 관계를 관리하는 과정을 하나의 비즈니스 메신저 안에서 처리할 수 있도록 돕는다.',
    category: 'B2B SaaS',
    actualInvestmentAmount: 53300000000n,
    revenue: 35002530000n,
    employeeCount: 219,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'asdekf',
    name: '코드잇',
    description:
      '테스트용으로 작성된 내용입니다.',
    category: 'B2B SaaS',
    actualInvestmentAmount: 53890000000n,
    revenue: 35000000n,
    employeeCount: 220,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
];

const investments = [
  {
    id: 'q7m2xa',
    companyId: 'f8q2mz',
    investorName: '김민준',
    amount: 800000000n,
    comment: '금융 앱 안에서 여러 서비스를 연결하는 확장성이 크다고 판단했습니다.',
    plainPassword: process.env.SEED_PASSWORD_F8Q2MZ,
  },
  {
    id: 'n4z8kp',
    companyId: 'k3p9av',
    investorName: '이서연',
    amount: 3000000n,
    comment: '지역 기반 커뮤니티 서비스라 사용자 충성도가 높아 보입니다.',
    plainPassword: process.env.SEED_PASSWORD_K3P9AV,
  },
  {
    id: 'v1c6tr',
    companyId: 'r7x1tq',
    investorName: '김민준',
    amount: 120000000n,
    comment: '콘텐츠와 커머스가 자연스럽게 이어지는 구조가 좋아 보입니다.',
    plainPassword: process.env.SEED_PASSWORD_R7X1TQ,
  },
  {
    id: 'y9b3ld',
    companyId: 'b6n4yc',
    investorName: '최유진',
    amount: 400000000n,
    comment: '여행 플랫폼을 넘어 글로벌 솔루션 기업으로 확장하는 점이 인상적입니다.',
    plainPassword: process.env.SEED_PASSWORD_B6N4YC,
  },
  {
    id: 's5w7hq',
    companyId: 'z2h8kd',
    investorName: '정도윤',
    amount: 250000000n,
    comment: '패션 커머스 시장에서 브랜드 파워가 강하다고 생각합니다.',
    plainPassword: process.env.SEED_PASSWORD_Z2H8KD,
  },
  {
    id: 'a8r2pn',
    companyId: 'm9v5jx',
    investorName: '한지아',
    amount: 85000000n,
    comment: null,
    plainPassword: process.env.SEED_PASSWORD_M9V5JX,
  },
  {
    id: 'e3x9vm',
    companyId: 'p4c7wu',
    investorName: '오현우',
    amount: 15000000n,
    comment: '부동산 정보와 스마트홈 기술을 연결하는 방향성이 흥미롭습니다.',
    plainPassword: process.env.SEED_PASSWORD_P4C7WU,
  },
  {
    id: 'k6j1zc',
    companyId: 'x1g6ra',
    investorName: '이서연',
    amount: 30000000n,
    comment: '콘텐츠 IP를 기반으로 글로벌 확장이 가능하다고 봤습니다.',
    plainPassword: process.env.SEED_PASSWORD_X1G6RA,
  },
  {
    id: 'u2f5gy',
    companyId: 'd5t9pq',
    investorName: '윤태민',
    amount: 8000000n,
    comment: '전자계약은 기업 업무에서 반복적으로 쓰이는 서비스라 안정성이 있어 보입니다.',
    plainPassword: process.env.SEED_PASSWORD_D5T9PQ,
  },
  {
    id: 'l9d4sb',
    companyId: 'h8s2bn',
    investorName: '서하린',
    amount: 50000000n,
    comment: 'AI 상담 자동화와 CRM이 함께 있는 SaaS 구조가 매력적입니다.',
    plainPassword: process.env.SEED_PASSWORD_H8S2BN,
  },
];

async function main() {
  for (const company of companies) {
    await prisma.company.upsert({
      where: { id: company.id },
      update: company,
      create: company,
    });
  }

  for (const investment of investments) {
    const { plainPassword, ...investmentData } = investment;
    investmentData.password = await bcrypt.hash(plainPassword, 10);

    await prisma.investment.upsert({
      where: { id: investment.id },
      update: investmentData,
      create: investmentData,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
