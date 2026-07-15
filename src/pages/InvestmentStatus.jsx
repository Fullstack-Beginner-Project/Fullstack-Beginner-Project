import { useState, useEffect, React } from "react";
import "../assets/css/investmentstatus.css";
import Dropdown from "../components/Dropdown.jsx";
import Section from "../components/Section";
import Table from "../components/Table.jsx";
import Pagination from "../components/Pagination.jsx";
import { mockCompanies } from "../mock/companies.js"; // 임시용 mock 데이터

// 임시 테이블 항목
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
    key: "amount",
    label: "View My Startup 투자 금액 ",
    colClassName: "etc_3",
  },
  {
    key: "revenue",
    label: "실제 누적 투자 금액",
    colClassName: "etc_3",
  },
];

function InvestmentStatus() {
  const [data, setData] = useState(mockCompanies);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 현재 페이지에 해당하는 데이터만 slice
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = mockCompanies.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(mockCompanies.length / rowsPerPage);

  useEffect(() => {
    fetch("") // api 주소
      .then((res) => res.json())
      .then((result) => {
        setData(result); // result가 배열이라고 가정
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const options = [
    "View My Startup 투자 금액 높은순",
    "View My Startup 투자 금액 낮은순",
    "실제 누적 투자 금액 높은순",
    "실제 누적 투자 금액 낮은순",
  ]



  const sectionRight = data.length > 0 && (
    <form className="search_wrap_parent flex">
      <Dropdown size={'medium'} options={options}></Dropdown>
    </form>
  );

  return (
    <div className="content_wrap investment_page">
      <Section title={'투자 현황'} sh_right={sectionRight}>
        {loading ? (
          <p>로딩 중...</p>
        ) : data.length === 0 ? (
          <p className="no_data">아직 투자 현황이 없어요</p>
        ) : (
          <>
            <Table columnDefs={columnDefs} rows={currentRows} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Section>
    </div>
  );

  // return (
  //   <>
  //     <div className="content_wrap">
  //       <Section title={'투자 현황'} sh_right={sectionRight}>

  //         {/*Table은 추후 DB 연동 간 수신 데이터 확인 후 map을 통해 구성할 예정*/}
  //         <Table></Table>

  //         <Pagination />
  //       </Section>

  //     </div>
  //     {/* pagnation 위치는 content_wrap안이 좋을지 밖이 좋을지 고려 */}
  //   </>
  // );
}

export default InvestmentStatus;