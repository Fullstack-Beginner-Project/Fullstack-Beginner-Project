import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatedInvestmentsPath = path.join(__dirname, 'seed-data', 'investments.json');

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
    id: 'a4w7pz',
    name: '두나무',
    description:
      '업비트를 운영하는 블록체인·핀테크 기업으로 디지털 자산 거래소, 증권 정보 서비스, 투자 플랫폼 영역에서 사업을 확장해 왔다. 2025년에도 국내 디지털 자산 거래소 운영사로서 금융과 기술을 연결하는 플랫폼 경쟁력을 유지하고 있다.',
    category: '핀테크',
    actualInvestmentAmount: 736500000000n,
    revenue: 1557800000000n,
    employeeCount: 715,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'v3n8ka',
    name: '에이블리코퍼레이션',
    description:
      '에이블리를 운영하는 스타일 커머스 기업으로 여성 패션 플랫폼에서 출발해 남성 패션 앱 4910, 일본 시장 아무드, 뷰티와 라이프 카테고리까지 확장하고 있다. 2025년에는 매출과 거래액이 역대 최대 규모를 기록하며 플랫폼 수익성과 신사업 성장을 함께 보여줬다.',
    category: '패션커머스',
    actualInvestmentAmount: 323000000000n,
    revenue: 369700000000n,
    employeeCount: 385,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 't5u9ve',
    name: '뱅크샐러드',
    description:
      '개인 금융 데이터를 기반으로 자산 관리, 소비 분석, 금융 상품 비교 서비스를 제공하는 마이데이터 기반 핀테크 기업이다. 2025년에는 매출이 전년 대비 크게 성장했고, IPO 준비 흐름과 함께 데이터 기반 금융 플랫폼으로서의 사업 확장을 이어가고 있다.',
    category: '핀테크',
    actualInvestmentAmount: 198900000000n,
    revenue: 25993520000n,
    employeeCount: 152,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'u9s2dg',
    name: '업스테이지',
    description:
      '자체 개발 거대언어모델 솔라와 문서 처리 AI 기술을 기반으로 기업용 AI 솔루션을 제공하는 AI 스타트업이다. 2025년에는 매출 성장을 이어가며 국내외 기업 고객을 대상으로 산업 특화 AI 모델과 문서 자동화 솔루션을 확장했다.',
    category: 'AI',
    actualInvestmentAmount: 400000000000n,
    revenue: 24801000000n,
    employeeCount: 188,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'w6r8tn',
    name: '뤼튼테크놀로지스',
    description:
      'AI 검색, AI 글쓰기, 이미지 생성 등 일상형 AI 서비스를 제공하는 AI 플랫폼 기업이다. 2025년에는 매출이 크게 성장하며 무료 AI 서비스 중심의 사용자 기반에서 수익화 모델로 확장하는 흐름을 보였다.',
    category: 'AI',
    actualInvestmentAmount: 130000000000n,
    revenue: 47100000000n,
    employeeCount: 174,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'd7b3ai',
    name: '딥브레인에이아이',
    description:
      'AI 휴먼과 영상 합성 기술을 기반으로 대화형 AI Human, AI 스튜디오, 영상 생성 솔루션을 제공하는 생성형 AI 기업이다. 2025년에도 AI 영상 합성 기술과 기업용 AI 휴먼 솔루션을 중심으로 사업을 이어가고 있다.',
    category: 'AI',
    actualInvestmentAmount: 60000000000n,
    revenue: 4813750000n,
    employeeCount: 50,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'm5k8st',
    name: '메이크스타',
    description:
      'K-POP과 글로벌 팬덤을 연결하는 엔터테크 플랫폼 기업으로 앨범, 굿즈, 팬 이벤트, 크라우드펀딩형 프로젝트를 운영한다. 2025년에는 글로벌 한류 팬덤 수요를 바탕으로 높은 매출 규모를 기록하며 팬덤 커머스 플랫폼으로 성장했다.',
    category: '엔터테크',
    actualInvestmentAmount: 25600000000n,
    revenue: 129759980000n,
    employeeCount: 128,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'x2d9xp',
    name: '딥엑스',
    description:
      '온디바이스 AI 반도체를 설계하는 팹리스 스타트업으로 저전력 AI 추론 칩과 임베디드 인공지능 프로세서를 개발한다. 2025년에는 양산과 글로벌 PoC를 기반으로 상업 매출을 만들기 시작하며 AI 반도체 시장에서 존재감을 키웠다.',
    category: 'AI반도체',
    actualInvestmentAmount: 135700000000n,
    revenue: 3324230000n,
    employeeCount: 112,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'r4b7ll',
    name: '리벨리온',
    description:
      'AI 추론 연산에 특화된 NPU를 설계하는 AI 반도체 스타트업이다. 사피온코리아와의 합병 이후 2025년 상용화 매출을 확대했고, 대규모 투자 유치와 함께 국내 대표 AI 반도체 기업으로 성장하고 있다.',
    category: 'AI반도체',
    actualInvestmentAmount: 640000000000n,
    revenue: 32021690000n,
    employeeCount: 106,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'l6f2ex',
    name: '라이프엑스',
    description:
      '마미톡과 레어노트를 운영하는 디지털 헬스케어 기업으로 임신·육아 데이터와 희귀질환 환자 데이터를 기반으로 헬스케어 서비스를 제공한다. 2025년까지 누적 투자 유치를 이어가며 미국과 동남아시아 등 글로벌 시장 확장을 추진하고 있다.',
    category: '헬스케어테크',
    actualInvestmentAmount: 80000000000n,
    revenue: 7830740000n,
    employeeCount: 87,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'asdekf',
    name: '코드잇',
    description:
      '자체 제작한 교육 콘텐츠와 학습 플랫폼을 기반으로 성장한 에듀테크 기업이다. AI 기술과 교육 데이터를 활용해 개인에게는 맞춤형 학습 경험을, 기업에게는 채용과 인재 성장 솔루션을 제공하며 교육부터 채용까지 연결하는 인재 인프라 플랫폼으로 확장하고 있다.',
    category: '에듀테크',
    actualInvestmentAmount: 21800000000n,
    revenue: 30746590000n,
    employeeCount: 153,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'wd301j',
    name: '와드',
    description:
      '캐치테이블을 운영하는 외식테크 기업으로 레스토랑 예약, 대기, 결제와 매장 관리 솔루션을 제공한다. 소비자의 미식 경험과 매장의 운영 효율을 연결하는 플랫폼으로 성장하고 있다.',
    category: '외식테크',
    actualInvestmentAmount: 72400000000n,
    revenue: 30118240000n,
    employeeCount: 246,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'hf202h',
    name: '해빗팩토리',
    description:
      '시그널플래너를 운영하는 인슈어테크 기업으로 보험 분석, 금융 데이터 관리와 미국 주택담보대출 서비스를 제공한다. AI 기반 금융 플랫폼으로 국내외 사업을 확장하고 있다.',
    category: '인슈어테크',
    actualInvestmentAmount: 69400000000n,
    revenue: 39200000000n,
    employeeCount: 72,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'pl088x',
    name: '포트로직스',
    description:
      '수출입 포워딩 물류 시장의 디지털 전환을 만드는 물류테크 스타트업이다. 자사 솔루션 TOMS를 통해 수출입 오더 관리, 문서 관리, 정산, 실시간 진행 상황 확인 등 복잡한 물류 업무를 하나의 플랫폼에서 처리하도록 지원한다.',
    category: '물류테크',
    actualInvestmentAmount: 8800000000n,
    revenue: 40600000000n,
    employeeCount: 48,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'go119g',
    name: '고이장례연구소',
    description:
      '장례 서비스 플랫폼 고이를 운영하는 장례테크 스타트업이다. 장례 준비부터 사후 행정 절차까지 원스톱으로 제공하며, 투명한 가격과 표준화된 운영 시스템으로 장례 시장의 정보 비대칭을 줄이고 있다.',
    category: '장례테크',
    actualInvestmentAmount: 11900000000n,
    revenue: 6700140000n,
    employeeCount: 33,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'ap187b',
    name: '아파트멘터리',
    description:
      '프리먼트 아파트 인테리어 서비스 플랫폼을 운영하는 리빙테크 기업이다. 아파트 리모델링과 인테리어 과정을 표준화하고 고객이 주거 공간 개선을 더 쉽게 진행하도록 돕는다.',
    category: '리빙테크',
    actualInvestmentAmount: 46000000000n,
    revenue: 18700000000n,
    employeeCount: 90,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'nb203e',
    name: '뉴빌리티',
    description:
      '자율주행 배달 로봇과 로봇 운영 플랫폼을 개발하는 로보틱스 기업이다. 도심 주행 데이터를 기반으로 배달, 순찰 등 다양한 실외 로봇 서비스를 상용화하고 있다.',
    category: '로보틱스',
    actualInvestmentAmount: 55000000000n,
    revenue: 2037750000n,
    employeeCount: 74,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'fw195z',
    name: '프리윌린',
    description:
      '수학 문제은행 매쓰플랫을 운영하는 에듀테크 기업이다. 학원과 학교가 문제 출제, 학습 관리, 채점과 분석을 데이터 기반으로 처리할 수 있도록 지원한다.',
    category: '에듀테크',
    actualInvestmentAmount: 12000000000n,
    revenue: 19559230000n,
    employeeCount: 122,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'fp686d',
    name: '핏펫',
    description:
      '반려동물 건강검사, 커머스, 병원 탐색 서비스를 제공하는 펫 헬스케어 기업이다. 반려동물 건강 데이터를 기반으로 검사, 상품 추천과 의료 서비스를 연결한다.',
    category: '펫테크',
    actualInvestmentAmount: 90000000000n,
    revenue: 68600000000n,
    employeeCount: 57,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'tb094e',
    name: '트렌비',
    description:
      '명품 쇼핑 플랫폼을 운영하며 국내외 명품 상품 검색, 구매, 검수와 배송 경험을 제공하는 커머스 기업이다. 글로벌 명품 유통 데이터를 기반으로 상품 탐색과 거래 편의성을 높인다.',
    category: '명품커머스',
    actualInvestmentAmount: 88000000000n,
    revenue: 9400000000n,
    employeeCount: 68,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'sr682f',
    name: '설로인',
    description:
      'AI 비전 기반 육류 품질 평가와 B2B·B2C 육류 유통 서비스를 제공하는 푸드테크 기업이다. 한우 브랜드 설로인과 육류 B2B 플랫폼 본대로를 통해 고품질 육류 시장을 확장하고 있다.',
    category: '푸드테크',
    actualInvestmentAmount: 46000000000n,
    revenue: 68200000000n,
    employeeCount: 160,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'ob877g',
    name: '아워박스',
    description:
      '냉장·냉동 스마트 풀필먼트와 물류 운영 시스템을 제공하는 물류테크 기업이다. 이커머스 판매자를 위한 보관, 포장, 배송과 운영 관리 솔루션을 통합 제공한다.',
    category: '물류테크',
    actualInvestmentAmount: 30000000000n,
    revenue: 87724230000n,
    employeeCount: 119,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'ld074h',
    name: '엘디카본',
    description:
      '폐타이어에서 친환경 카본블랙 원료를 생산하는 자원순환 테크 기업이다. 열분해와 소재 재활용 기술을 기반으로 자동차와 소재 산업의 탄소 저감 솔루션을 제공한다.',
    category: '클린테크',
    actualInvestmentAmount: 93000000000n,
    revenue: 7421740000n,
    employeeCount: 109,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'bs179x',
    name: '비트센싱',
    description:
      '이미징 레이더를 개발하는 모빌리티 센서 기업이다. 자율주행, 스마트시티, 헬스케어에 적용할 수 있는 레이더 하드웨어와 인지 소프트웨어를 결합한 솔루션을 제공한다.',
    category: '모빌리티테크',
    actualInvestmentAmount: 63000000000n,
    revenue: 17956650000n,
    employeeCount: 79,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'cl029y',
    name: '클라썸',
    description:
      '질문과 답변 중심의 교육 소통 플랫폼을 운영하는 에듀테크 기업이다. 학교와 기업 조직의 학습 데이터를 연결해 지식 공유와 학습 참여를 높이는 서비스를 제공한다.',
    category: '에듀테크',
    actualInvestmentAmount: 22500000000n,
    revenue: 2956010000n,
    employeeCount: 43,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'ss116s',
    name: '셀렉트스타',
    description:
      'AI 학습용 데이터 구축과 모델 평가 서비스를 제공하는 AI 데이터 기업이다. 크라우드소싱과 전문 검수 체계를 통해 기업의 AI 개발과 신뢰성 검증을 지원한다.',
    category: 'AI데이터',
    actualInvestmentAmount: 43400000000n,
    revenue: 11615580000n,
    employeeCount: 169,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'sw854t',
    name: '더스윙',
    description:
      '공유 모빌리티 서비스 SWING을 운영하는 모빌리티 기업이다. 전동킥보드, 전기자전거, 통학버스와 택시 호출 등 다양한 이동 서비스를 결합해 도시 이동 경험을 확장하고 있다.',
    category: '모빌리티',
    actualInvestmentAmount: 45000000000n,
    revenue: 85495880000n,
    employeeCount: 110,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'rc280u',
    name: '리코',
    description:
      '사업장 폐기물 관리 서비스 업박스를 운영하는 환경 스타트업이다. 폐기물 수거와 행정 처리, 데이터 관리를 SaaS 기반으로 제공해 사업장의 자원순환 업무를 효율화한다.',
    category: '환경테크',
    actualInvestmentAmount: 88500000000n,
    revenue: 28000000000n,
    employeeCount: 80,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'dd027m',
    name: '두들린',
    description:
      '채용 관리 플랫폼 그리팅을 운영하는 HR테크 기업이다. 기업의 채용 공고 게시, 지원자 관리, 면접 협업과 채용 데이터 분석을 하나의 SaaS에서 처리하도록 지원한다.',
    category: 'HR테크',
    actualInvestmentAmount: 15900000000n,
    revenue: 2761880000n,
    employeeCount: 44,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'hc007m',
    name: '홈코',
    description:
      '공간 유지보수 서비스 홈코를 운영하는 홈서비스 스타트업이다. 주거와 상업 공간의 수리 요청, 유지보수, 현장 운영을 디지털로 연결해 전통적인 공간 관리 시장의 비효율과 정보 비대칭을 줄이고 있다.',
    category: '홈서비스',
    actualInvestmentAmount: 700000000n,
    revenue: 250000000n,
    employeeCount: 19,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'mg071x',
    name: '망고부스트코리아',
    description:
      '데이터 처리 가속기 DPU 원천기술을 개발하는 시스템 반도체 기업이다. AI 데이터센터의 네트워크, 스토리지, 가상화 작업을 효율화하는 하드웨어와 소프트웨어 솔루션을 제공한다.',
    category: '시스템반도체',
    actualInvestmentAmount: 93000000000n,
    revenue: 7141730000n,
    employeeCount: 127,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'hw060e',
    name: '혜움',
    description:
      'AI 기반 세무·재무 에이전트 서비스를 개발하는 스타트업이다. 세무법인 운영 경험과 기술을 결합해 사업자와 스타트업의 세무, 재무, 경영 관리 업무를 자동화하고 지원한다.',
    category: '세무테크',
    actualInvestmentAmount: 12000000000n,
    revenue: 6000000000n,
    employeeCount: 63,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'lv425d',
    name: '올웨이즈',
    description:
      '레브잇이 운영하는 모바일 팀구매 커머스 플랫폼이다. 공동구매, 발견형 쇼핑, AI 쇼핑 에이전트를 결합해 사용자에게 새로운 모바일 커머스 경험을 제공한다.',
    category: '커머스',
    actualInvestmentAmount: 86900000000n,
    revenue: 42500000000n,
    employeeCount: 90,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'wc147z',
    name: '화이트큐브',
    description:
      '챌린저스를 운영하는 뷰티·커머스 스타트업이다. 습관 형성 서비스에서 출발해 뷰티 득템과 브랜드 성과형 마케팅으로 확장하며 글로벌 시장 진출을 추진하고 있다.',
    category: '뷰티커머스',
    actualInvestmentAmount: 6000000000n,
    revenue: 14700000000n,
    employeeCount: 45,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'ma050y',
    name: '몬드리안에이아이',
    description:
      'AI 클라우드와 MLOps 플랫폼을 제공하는 인공지능 기업이다. 제조 산업 특화 AI, 생성형 AI 운영 플랫폼, AI 워크스테이션 등 기업의 AI 전환을 위한 솔루션을 개발한다.',
    category: 'AI클라우드',
    actualInvestmentAmount: 4500000000n,
    revenue: 5000000000n,
    employeeCount: 45,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'gb013x',
    name: '그룹바이에이치알',
    description:
      '스타트업 전문 채용 플랫폼 그룹바이를 운영하는 HR테크 기업이다. 스타트업과 IT 인재 사이의 채용 정보 비대칭을 줄이고 AI 기반 채용 업무 자동화를 추진하고 있다.',
    category: 'HR테크',
    actualInvestmentAmount: 1000000000n,
    revenue: 1300000000n,
    employeeCount: 24,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'ps014q',
    name: '패러다임시프트',
    description:
      '4060 여성 대상 소셜 커머스 플랫폼 히로인스를 운영하는 커머스 스타트업이다. 일상 공유, 응원, 리뷰 기반 커머스를 결합해 중년 여성 소비자의 문제를 해결한다.',
    category: '소셜커머스',
    actualInvestmentAmount: 2000000000n,
    revenue: 1400000000n,
    employeeCount: 14,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 're053v',
    name: '렌트리',
    description:
      '가전 렌탈과 인터넷 상품 견적 비교·신청 플랫폼을 운영하는 렌탈테크 기업이다. 사용자가 여러 렌탈 상품과 통신 상품을 비교하고 안전하게 신청할 수 있도록 돕는다.',
    category: '렌탈테크',
    actualInvestmentAmount: 6700000000n,
    revenue: 5300000000n,
    employeeCount: 54,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'pc050u',
    name: '피에로컴퍼니',
    description:
      '리퍼비시 전자기기 종합 플랫폼 폰고를 운영하는 순환경제 스타트업이다. 전자기기 렌탈, 판매, 수리와 기업 유휴 IT 기기 매입 서비스를 통해 지속가능한 IT 기기 생태계를 구축한다.',
    category: '순환경제',
    actualInvestmentAmount: 2000000000n,
    revenue: 5000000000n,
    employeeCount: 12,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'ts733a',
    name: '팀스파르타',
    description:
      '스파르타코딩클럽과 내일배움캠프를 운영하는 IT·AI 교육 스타트업이다. 직무 전환 교육, 기업 AX 교육, 취업 연계 프로그램을 통해 기술 인재 양성과 AI 교육 시장을 확장하고 있다.',
    category: '에듀테크',
    actualInvestmentAmount: 13000000000n,
    revenue: 73386110000n,
    employeeCount: 293,
    myCompanySelectCount: 0,
    compareCompanySelectCount: 0,
  },
  {
    id: 'ag015b',
    name: '알고케어',
    description:
      'AI와 IoT 기반 맞춤형 영양관리 솔루션을 개발하는 헬스케어 스타트업이다. 기업용 건강관리 서비스와 가정용 제품을 통해 개인화된 영양 설계와 섭취 경험을 제공한다.',
    category: '헬스케어테크',
    actualInvestmentAmount: 15000000000n,
    revenue: 1589700000n,
    employeeCount: 38,
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
  {
    id: 'y72sev',
    companyId: 'a4w7pz',
    investorName: '김정숙',
    amount: 5000000000n,
    comment: '사용자 반응이 좋아 제품의 미래가 기대되는 회사입니다.',
    plainPassword: process.env.SEED_PASSWORD_A4W7PZ,
  },
  {
    id: '3rbobg',
    companyId: 'v3n8ka',
    investorName: '김보람',
    amount: 470000000n,
    comment: '수익 구조가 단순하고 예측 가능해서 성장의 초입에 있는 회사라고 판단했습니다.',
    plainPassword: process.env.SEED_PASSWORD_V3N8KA,
  },
  {
    id: '1pkei2',
    companyId: 't5u9ve',
    investorName: '고은비',
    amount: 59000000n,
    comment: '진입 장벽이 높고 방어력이 있어서 시간이 지날수록 가치가 더 커질 것이라고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_T5U9VE,
  },
  {
    id: 'd0twak',
    companyId: 'u9s2dg',
    investorName: '방준혁',
    amount: 22000000n,
    comment: '고객 획득 비용이 꾸준히 낮아지고 있어 앞으로의 성장 잠재력이 충분하다고 판단했습니다.',
    plainPassword: process.env.SEED_PASSWORD_U9S2DG,
  },
  {
    id: '2puayo',
    companyId: 'w6r8tn',
    investorName: '홍승기',
    amount: 2700000000n,
    comment: null,
    plainPassword: process.env.SEED_PASSWORD_W6R8TN,
  },
  {
    id: '9vb9gk',
    companyId: 'd7b3ai',
    investorName: '박정호',
    amount: 14000000n,
    comment: '팀의 실행력이 검증되어 있고 결과적으로 좋은 선택이 될 것이라고 판단했습니다.',
    plainPassword: process.env.SEED_PASSWORD_D7B3AI,
  },
  {
    id: 'a3qixx',
    companyId: 'm5k8st',
    investorName: '정해성',
    amount: 1100000000n,
    comment: '초기 고객의 만족도가 높게 유지되고 있어 조심스럽지만 긍정적으로 전망하고 있습니다.',
    plainPassword: process.env.SEED_PASSWORD_M5K8ST,
  },
  {
    id: '1y4621',
    companyId: 'x2d9xp',
    investorName: '하도현',
    amount: 7300000n,
    comment: '핵심 지표가 꾸준히 우상향하고 있어 지켜볼 가치가 충분한 회사라고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_X2D9XP,
  },
  {
    id: 'inr6co',
    companyId: 'r4b7ll',
    investorName: '조현아',
    amount: 84000000n,
    comment: '파트너십이 안정적으로 확대되고 있어 좋은 기업으로 성장해 나갈 것이라고 믿습니다.',
    plainPassword: process.env.SEED_PASSWORD_R4B7LL,
  },
  {
    id: 'i1matw',
    companyId: 'l6f2ex',
    investorName: '서지원',
    amount: 36000000n,
    comment: '시장 흐름과 제품 방향이 잘 맞물려 있고 시장에서 의미 있는 위치를 차지할 것으로 기대합니다.',
    plainPassword: process.env.SEED_PASSWORD_L6F2EX,
  },
  {
    id: 'arvxll',
    companyId: 'asdekf',
    investorName: '박태호',
    amount: 4100000000n,
    comment: '시장의 크기와 팀의 역량을 함께 보고 투자를 결정했습니다.',
    plainPassword: process.env.SEED_PASSWORD_ASDEKF,
  },
  {
    id: 'gc35sd',
    companyId: 'wd301j',
    investorName: '김우진',
    amount: 230000000n,
    comment: '팀이 어려운 문제에 정면으로 부딪히고 있어 기대 이상의 성과가 나올 가능성이 높다고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_WD301J,
  },
  {
    id: 'pt2pnp',
    companyId: 'hf202h',
    investorName: '이민석',
    amount: 520000000n,
    comment: '창업자의 문제 이해도가 깊고 장기 투자에 적합한 회사라고 판단했습니다.',
    plainPassword: process.env.SEED_PASSWORD_HF202H,
  },
  {
    id: 'q5m0bv',
    companyId: 'pl088x',
    investorName: '김명자',
    amount: 9700000000n,
    comment: '데이터 지표가 가설을 잘 뒷받침하고 있어 잠재력에 비해 아직 저평가되어 있다고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_PL088X,
  },
  {
    id: '4kxvj1',
    companyId: 'go119g',
    investorName: '김재원',
    amount: 18000000n,
    comment: '시장의 크기와 팀의 역량을 함께 보고 투자를 결정했습니다.',
    plainPassword: process.env.SEED_PASSWORD_GO119G,
  },
  {
    id: 'y4xyml',
    companyId: 'ap187b',
    investorName: '김소율',
    amount: 45000000n,
    comment: '시장 진입 시점이 적절해 보이고 시장을 선도할 잠재력이 있다고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_AP187B,
  },
  {
    id: 'zs0bkk',
    companyId: 'nb203e',
    investorName: '안소희',
    amount: 9600000000n,
    comment: '브랜드 신뢰도가 꾸준히 쌓이고 있어 잠재력에 비해 아직 저평가되어 있다고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_NB203E,
  },
  {
    id: '1ateo5',
    companyId: 'fw195z',
    investorName: '이성민',
    amount: 4400000000n,
    comment: '앞으로의 성장 여정을 함께하고 싶어 투자를 결정했습니다.',
    plainPassword: process.env.SEED_PASSWORD_FW195Z,
  },
  {
    id: 'oy1xsj',
    companyId: 'fp686d',
    investorName: '허준호',
    amount: 57000000n,
    comment: '매출처가 다변화되어 있어 리스크가 분산되고 장기적으로 든든한 파트너가 될 것 같습니다.',
    plainPassword: process.env.SEED_PASSWORD_FP686D,
  },
  {
    id: 'hqw99r',
    companyId: 'tb094e',
    investorName: '장원준',
    amount: 21000000n,
    comment: '브랜드 신뢰도가 꾸준히 쌓이고 있어 투자를 결심하는 데 큰 힘이 되었습니다.',
    plainPassword: process.env.SEED_PASSWORD_TB094E,
  },
  {
    id: '3vlm62',
    companyId: 'sr682f',
    investorName: '정우진',
    amount: 98000000n,
    comment: '확장 가능성이 여러 방향으로 열려 있어서 앞으로의 행보를 응원하며 투자하기로 했습니다.',
    plainPassword: process.env.SEED_PASSWORD_SR682F,
  },
  {
    id: 'vtr5tc',
    companyId: 'ob877g',
    investorName: '강예서',
    amount: 23000000n,
    comment: '조직이 빠르게 성장하면서도 문화가 안정적이라서 향후 몇 년간 꾸준히 성장할 것으로 전망합니다.',
    plainPassword: process.env.SEED_PASSWORD_OB877G,
  },
  {
    id: 'uc16uw',
    companyId: 'ld074h',
    investorName: '이서윤',
    amount: 680000000n,
    comment: '고객 추천을 통한 유입이 늘고 있어 성장의 방향성이 분명하다고 판단했습니다.',
    plainPassword: process.env.SEED_PASSWORD_LD074H,
  },
  {
    id: '8f1wlr',
    companyId: 'bs179x',
    investorName: '남기훈',
    amount: 740000000n,
    comment: '시장의 미충족 수요가 크고 다음 단계로의 도약이 기대됩니다.',
    plainPassword: process.env.SEED_PASSWORD_BS179X,
  },
  {
    id: '33ajen',
    companyId: 'cl029y',
    investorName: '임수아',
    amount: 960000000n,
    comment: '작지만 단단하게 성장하는 모습이 인상적이었습니다.',
    plainPassword: process.env.SEED_PASSWORD_CL029Y,
  },
  {
    id: 'oh3est',
    companyId: 'ss116s',
    investorName: '김예진',
    amount: 31000000n,
    comment: '견고한 리텐션이 이 사업의 지속 가능성을 뒷받침합니다.',
    plainPassword: process.env.SEED_PASSWORD_SS116S,
  },
  {
    id: 'o62vcz',
    companyId: 'sw854t',
    investorName: '조민기',
    amount: 3300000000n,
    comment: '제품 완성도가 높고 사용자 반응이 좋아서 장기적으로 든든한 파트너가 될 것 같습니다.',
    plainPassword: process.env.SEED_PASSWORD_SW854T,
  },
  {
    id: 'kv024b',
    companyId: 'rc280u',
    investorName: '박상현',
    amount: 26000000n,
    comment: '브랜드 신뢰도가 꾸준히 쌓이고 있어 기대 이상의 성과가 나올 가능성이 높다고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_RC280U,
  },
  {
    id: 'hqnqu9',
    companyId: 'dd027m',
    investorName: '박민호',
    amount: 3500000n,
    comment: null,
    plainPassword: process.env.SEED_PASSWORD_DD027M,
  },
  {
    id: '5peqgm',
    companyId: 'hc007m',
    investorName: '전유정',
    amount: 7800000n,
    comment: '초기 트랙션만으로도 충분한 가능성을 확인했습니다.',
    plainPassword: process.env.SEED_PASSWORD_HC007M,
  },
  {
    id: 's2k2di',
    companyId: 'mg071x',
    investorName: '윤서희',
    amount: 5000000n,
    comment: '아직 초기지만 수익성 개선의 신호가 뚜렷하게 보입니다.',
    plainPassword: process.env.SEED_PASSWORD_MG071X,
  },
  {
    id: '1uw276',
    companyId: 'hw060e',
    investorName: '오승우',
    amount: 77000000n,
    comment: '시장 규모가 크고 성장 속도가 빨라서 기대를 걸어볼 만한 회사라고 생각합니다.',
    plainPassword: process.env.SEED_PASSWORD_HW060E,
  },
  {
    id: 'zunm6f',
    companyId: 'lv425d',
    investorName: '이도윤',
    amount: 980000000n,
    comment: '반복 구매가 자연스럽게 일어나고 있어 흔들림 없이 성장해 나갈 것으로 기대합니다.',
    plainPassword: process.env.SEED_PASSWORD_LV425D,
  },
  {
    id: 'mpablb',
    companyId: 'wc147z',
    investorName: '나윤호',
    amount: 9200000000n,
    comment: '서비스 확장에 필요한 기반이 잘 갖춰져 있어서 지금 합류하기에 좋은 시점이라고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_WC147Z,
  },
  {
    id: 'mu62wm',
    companyId: 'ma050y',
    investorName: '문서희',
    amount: 970000000n,
    comment: null,
    plainPassword: process.env.SEED_PASSWORD_MA050Y,
  },
  {
    id: '1vwo2n',
    companyId: 'gb013x',
    investorName: '서지원',
    amount: 2900000000n,
    comment: '수익 구조가 단순하고 예측 가능해서 꾸준한 성장이 이어질 것으로 전망합니다.',
    plainPassword: process.env.SEED_PASSWORD_GB013X,
  },
  {
    id: 'acbfyd',
    companyId: 'ps014q',
    investorName: '이재훈',
    amount: 22000000n,
    comment: '오랜 검토 끝에 함께 성장하고 싶다는 확신이 들었습니다.',
    plainPassword: process.env.SEED_PASSWORD_PS014Q,
  },
  {
    id: 'p18e6q',
    companyId: 're053v',
    investorName: '김명자',
    amount: 7700000000n,
    comment: null,
    plainPassword: process.env.SEED_PASSWORD_RE053V,
  },
  {
    id: 'gzkcuz',
    companyId: 'pc050u',
    investorName: '강예서',
    amount: 1700000000n,
    comment: '시장의 미충족 수요를 정확히 겨냥한 점이 매력적입니다.',
    plainPassword: process.env.SEED_PASSWORD_PC050U,
  },
  {
    id: '0g65bp',
    companyId: 'ts733a',
    investorName: '박현준',
    amount: 620000000n,
    comment: '실행 속도와 학습 속도가 모두 빨라서 성장의 여지가 아직 많이 남아 있다고 봅니다.',
    plainPassword: process.env.SEED_PASSWORD_TS733A,
  },
  {
    id: 'fv5o1j',
    companyId: 'ag015b',
    investorName: '장예나',
    amount: 810000000n,
    comment: '고객 추천을 통한 유입이 늘고 있어 지속적인 관심을 가지고 지켜보려 합니다.',
    plainPassword: process.env.SEED_PASSWORD_AG015B,
  },
];

function assertSeedPassword(investmentId, plainPassword) {
  const isDefaultValue =
    !plainPassword || plainPassword === 'changetopassword' || /^change_?me/i.test(plainPassword);

  if (isDefaultValue) {
    throw new Error(
      `시드 투자(${investmentId})의 비밀번호가 비어 있거나 기본값입니다. .env의 SEED_PASSWORD_* 값을 고유한 값으로 변경해주세요.`
    );
  }
}

async function seedGeneratedInvestments() {
  if (!fs.existsSync(generatedInvestmentsPath)) {
    return;
  }

  const generated = JSON.parse(fs.readFileSync(generatedInvestmentsPath, 'utf8'));
  const existing = await prisma.investment.findMany({ select: { id: true } });
  const existingIds = new Set(existing.map((row) => row.id));
  const companyIds = new Set(companies.map((company) => company.id));

  const toCreate = generated
    .filter((investment) => !existingIds.has(investment.id))
    .filter((investment) => companyIds.has(investment.companyId))
    .map((investment) => ({
      id: investment.id,
      companyId: investment.companyId,
      investorName: investment.investorName,
      amount: BigInt(investment.amount),
      comment: investment.comment ?? null,
      password: investment.password,
    }));

  const BATCH_SIZE = 500;
  for (let start = 0; start < toCreate.length; start += BATCH_SIZE) {
    const batch = toCreate.slice(start, start + BATCH_SIZE);
    await prisma.investment.createMany({ data: batch, skipDuplicates: true });
  }

  console.log(`샘플 투자 시드 완료: 신규 ${toCreate.length}건 (파일 총 ${generated.length}건)`);
}

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
    assertSeedPassword(investment.id, plainPassword);
    investmentData.password = await bcrypt.hash(plainPassword, 10);

    await prisma.investment.upsert({
      where: { id: investment.id },
      update: investmentData,
      create: investmentData,
    });
  }

  await seedGeneratedInvestments();
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
