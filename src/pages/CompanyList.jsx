import React from "react";
import { useEffect, useState } from "react";
import "../assets/css/companylist.css"
import Table from "../components/Table";
import Section from "../components/Section";
import Search from "../components/Search";
import Dropdown from "../components/Dropdown";
import GlobalNav from "../components/GlobalNav";
import Pagination from "../components/Pagination.jsx";
import axios from "axios";

const response = await axios.get('https://codeit-sprint-for-api-test-1.geonwoo.dev/api/companies/f8q2mz/investments');
const data = response.data.list


function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("revenueDesc");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
 
  // keyword 받기
  const handleSearch = (keyword) => {
    setKeyword(keyword);
    setCurrentPage(1);
  }
  // 드롭다운에서 선택한 옵션을 API 파라미터에 맞게 변환
  const handleSortChange = (selected) => {
    switch (selected) {
      case "누적 투자금액 높은순":
        setSortOption("investmentDesc");
        break;
      case "누적 투자금액 낮은순":
        setSortOption("investmentAsc");
        break;
      case "매출액 높은순":
        setSortOption("revenueDesc");
        break;
      case "매출액 낮은순":
        setSortOption("revenueAsc");
        break;
      case "고용 인원 많은순":
        setSortOption("employeeDesc");
        break;
      case "고용 인원 적은순":
        setSortOption("employeeAsc");
        break;
      default:
        setSortOption("investmentDesc");
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true); // 호출 시작 시 로딩 켜기
      try {
        const response = await axios.get(
          `https://fullstack-beginner-api-test.ggeonwoo.workers.dev/api/companies?page=${currentPage}&pageSize=${rowsPerPage}&sort=${sortOption}&keyword=${keyword}`
        );
        setCompanies(response.data.list);
        setTotalPages(Math.ceil(response.data.totalCount / rowsPerPage));
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      } finally {
        setLoading(false); // 호출 끝나면 로딩 끄기
      }
    };
    fetchCompanies();
  }, [currentPage, sortOption, keyword]);

  // 추후 전체 작성해서 옮긴 후 해당 페이지별로 필요한 타이틀만 불러오기
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
      key: "actualInvestmentAmount",
      label: "누적투자금액",
      colClassName: "etc",
    },
    {
      key: "revenue",
      label: "매출액",
      colClassName: "etc",
    },
    {
      key: "employeeCount",
      label: "고용인원",
      colClassName: "etc",
    },
  ];

  const options = [
    "누적 투자금액 높은순",
    "누적 투자금액 낮은순",
    "매출액 높은순",
    "매출액 낮은순",
    "고용 인원 많은순",
    "고용 인원 적은순",
  ]

  const columnDefs_invest = [
    {
      key: "investorName",
      label: "투자자 이름",
      colClassName: "etc_2",
    },
    {
      key: "rank",
      label: "순위",
      colClassName: "short",
    },
    {
      key: "amount",
      label: "투자금액",
      colClassName: "etc",
    },
    {
      key: "comment",
      label: "투자 코멘트",
      colClassName: "content",
    },
  ];

  const sectionRight = (
    <div className="search_wrap_parent flex">
      <Search onSubmit={handleSearch}></Search>
      <Dropdown size={'small'} options={options} onChange={handleSortChange}></Dropdown>
    </div>
  );

  return (
    <>
      <div className="content_wrap companylist_page">
        <Section title={'전체 스타트업 목록'} sh_right={sectionRight}>
          {/* section */}
          {loading ? (
            <p className="in_loading">로딩 중...</p>
          ) : companies.length === 0 ? (
            <p className="no_data">아직 등록된 기업이 없어요</p>
          ) : (
            <>
              <Table
                columnDefs={columnDefs}
                rows={companies}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </Section>

        {/* 혹시 몰라 남겨둡니다. */}
        {/* <Section title={'전체 스타트업 ddd목록'} sh_right={sectionRight}>

          <Table columnDefs={columnDefs_invest} rows={data}></Table>

          <Pagination currentPage={1} totalPages={10} />
        </Section> */}
      </div>
      {/* pagnation 위치는 content_wrap안이 좋을지 밖이 좋을지 고려 */}
    </>
  );
}

export default CompanyList;