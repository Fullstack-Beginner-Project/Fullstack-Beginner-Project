import React from "react";
import "../assets/css/compareoverview.css";
import Dropdown from "../components/Dropdown.jsx";
import Section from "../components/Section";
import Table from "../components/Table.jsx";
import Pagination from "../components/Pagination.jsx";

function CompareOverview() {
  const handleSearch = (keyword) => {
    console.log("검색어:", keyword);
  }


  
  const options = [
    "나의 기업 선택 횟수 높은순",
    "나의 기업 선택 횟수 낮은순",
    "실제 누적 투자 금액 높은순",
    "실제 누적 투자 금액 낮은순",
  ]

  const companies = [
    {
      id: 'f8q2mz',
      name: '비바리퍼블리카',
      description:
        '토스를 운영하는 핀테크 기업으로 간편송금, 결제, 대출 비교, 증권, 은행 등 다양한 금융 서비스를 모바일 앱 안에서 연결한다. 금융을 복잡한 절차가 아니라 일상적인 사용자 경험으로 바꾸는 것을 목표로 성장해 왔다.',
      category: '핀테크',
      myCompanySelectCount: 9804,
      compareCompanySelectCount: 8200,

      img: "src/assets/images/img_bi_toss.png",
    },
    {
      id: 'k3p9av',
      name: '당근마켓',
      description:
        '지역 기반 중고거래 서비스에서 시작해 동네생활, 지역 광고, 로컬 커뮤니티 기능으로 확장한 하이퍼로컬 플랫폼 기업이다. 사용자가 사는 동네를 중심으로 사람과 정보를 연결하는 서비스 구조가 핵심이다.',
      category: '지역커뮤니티',
      myCompanySelectCount: 8766,
      compareCompanySelectCount: 9700,
      img: "src/assets/images/img_bi_karrot.png",
    },
    {
      id: 'r7x1tq',
      name: '버킷플레이스',
      description:
        '오늘의집을 운영하며 인테리어 콘텐츠, 상품 구매, 시공 연결을 하나의 흐름으로 제공하는 라이프스타일 플랫폼 기업이다. 사용자가 집을 꾸미는 과정에서 탐색부터 구매와 시공까지 이어지도록 서비스를 확장해 왔다.',
      category: '라이프스타일',
      myCompanySelectCount: 8142,
      compareCompanySelectCount: 7506,
      img: "src/assets/images/img_bi_ohouse.png",
    },
    {
      id: 'b6n4yc',
      name: '야놀자',
      description:
        '숙박 예약 플랫폼에서 출발해 여행, 레저, 글로벌 호스피탈리티 솔루션 영역으로 확장한 트래블테크 기업이다. 예약 서비스뿐 아니라 여행 관련 데이터와 운영 솔루션을 연결해 글로벌 시장까지 사업을 넓히고 있다.',
      category: '트래블테크',
      myCompanySelectCount: 7204,
      compareCompanySelectCount: 9224,
      img: "src/assets/images/img_bi_nol.png",
    },
    {
      id: 'z2h8kd',
      name: '무신사',
      description:
        '온라인 패션 플랫폼을 중심으로 브랜드 입점, 자체 브랜드, 오프라인 스토어, 패션 콘텐츠 사업을 함께 운영하는 패션 커머스 기업이다. 국내 패션 브랜드와 소비자를 연결하는 대표적인 버티컬 커머스 플랫폼으로 성장했다.',
      category: '패션커머스',
      myCompanySelectCount: 5763,
      compareCompanySelectCount: 5763,
      img: "src/assets/images/img_bi_musinsa.png",
    },
    {
      id: 'm9v5jx',
      name: '컬리',
      description:
        '마켓컬리와 뷰티컬리를 운영하며 식품, 생활용품, 뷰티 상품을 빠르게 배송하는 리테일테크 기업이다. 새벽배송 운영 노하우와 상품 큐레이션을 기반으로 프리미엄 장보기 경험을 제공하는 것이 핵심 경쟁력이다.',
      category: '리테일테크',
      myCompanySelectCount: 4004,
      compareCompanySelectCount: 5883,
      img: "src/assets/images/img_bi_kurly.png",
    },
    {
      id: 'p4c7wu',
      name: '직방',
      description:
        '부동산 정보 플랫폼으로 시작해 아파트, 원룸, 오피스텔 정보와 스마트홈 사업까지 확장한 프롭테크 기업이다. 부동산 탐색 과정의 정보 비대칭을 줄이고 주거 관련 기술 서비스를 연결하는 방향으로 성장해 왔다.',
      category: '프롭테크',
      myCompanySelectCount: 3951,
      compareCompanySelectCount: 504,
      img: "src/assets/images/img_bi_zigbang.png",
    },
    {
      id: 'x1g6ra',
      name: '리디',
      description:
        '전자책, 웹툰, 웹소설 등 디지털 콘텐츠 서비스를 운영하는 콘텐츠 플랫폼 기업이다. 국내 전자책 서비스에서 출발해 웹툰과 글로벌 콘텐츠 플랫폼으로 확장하며 IP 기반 사업 경쟁력을 키우고 있다.',
      category: '콘텐츠',
      myCompanySelectCount: 1768,
      compareCompanySelectCount: 2975,
      img: "src/assets/images/img_bi_rdbooks.png",
    },
    {
      id: 'd5t9pq',
      name: '모두싸인',
      description:
        '전자서명과 전자계약 서비스를 제공하는 B2B SaaS 기업이다. 계약서 작성, 서명 요청, 체결, 보관 과정을 온라인으로 처리할 수 있게 만들어 기업의 계약 업무를 빠르고 간단하게 바꾸는 데 집중하고 있다.',
      category: 'SaaS',
      myCompanySelectCount: 1768,
      compareCompanySelectCount: 2975,
      img: "src/assets/images/img_bi_modusign.png",
    },
    {
      id: 'h8s2bn',
      name: '채널코퍼레이션',
      description:
        '채널톡을 운영하며 고객 상담, CRM, 마케팅, AI 상담 자동화 기능을 제공하는 B2B SaaS 기업이다. 기업이 고객과 대화하고 관계를 관리하는 과정을 하나의 비즈니스 메신저 안에서 처리할 수 있도록 돕는다.',
      category: 'B2B SaaS',
      myCompanySelectCount: 867,
      compareCompanySelectCount: 675,
      img: "src/assets/images/img_bi_chtalk.png",
    },
  ];

  const columnDefs = [
    {
      key: "rank",
      label: "순위",
      colClassName: "short",
    },
    {
      key: "name",
      label: "기업명",
      colClassName: "title",
    },
    {
      key: "description",
      label: "기업소개",
      colClassName: "content",
    },
    {
      key: "category",
      label: "카테고리",
      colClassName: "etc",
    },
    {
      key: "myCompanySelectCount",
      label: "나의 기업 선택 횟수",
      colClassName: "etc",
    },
    {
      key: "compareCompanySelectCount",
      label: "비교 기업 선택 횟수",
      colClassName: "etc",
    },
  ];

  const sectionRight = (
    <form className="search_wrap_parent flex">
      <Dropdown size={'medium'} options={options}></Dropdown>
    </form>
  );
  return (
    <>
      <div className="content_wrap companyoverview_page">
        <Section title={'비교 현황'} sh_right={sectionRight}>

          {/*Table은 추후 DB 연동 간 수신 데이터 확인 후 map을 통해 구성할 예정*/}

          {/* columnDefs: 테이블 헤더, 테이블 열 스타일 지정 */}
          {/* rows: 데이터 */}
          <Table columnDefs={columnDefs} rows={companies} />

          <Pagination currentPage={1} totalPages={5} />
        </Section>
      

      </div>
    </>
  );
}

export default CompareOverview;