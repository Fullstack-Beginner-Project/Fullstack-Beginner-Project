import React, { useState, useEffect } from "react";
import "../assets/css/compareoverview.css";
import Dropdown from "../components/Dropdown.jsx";
import Section from "../components/Section";
import Table from "../components/Table.jsx";
import Pagination from "../components/Pagination.jsx";
import axios from "axios";

function CompareOverview() {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("selectCountDesc");

  const options = [
    "나의 기업 선택 횟수 높은순",
    "나의 기업 선택 횟수 낮은순",
    "실제 누적 투자 금액 높은순",
    "실제 누적 투자 금액 낮은순",
  ];

  const handleSortChange = (selected) => {
    switch (selected) {
      case "나의 기업 선택 횟수 높은순":
        setSortOption("selectCountDesc");
        break;
      case "나의 기업 선택 횟수 낮은순":
        setSortOption("selectCountAsc");
        break;
      case "실제 누적 투자 금액 높은순":
        setSortOption("investmentDesc");
        break;
      case "실제 누적 투자 금액 낮은순":
        setSortOption("investmentAsc");
        break;
      default:
        setSortOption("selectCountDesc");
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `https://fullstack-beginner-api-test.ggeonwoo.workers.dev/api/compare/status?page=${currentPage}&pageSize=${rowsPerPage}&sort=${sortOption}`
        );
        setCompanies(response.data.list);
        setTotalPages(Math.ceil(response.data.totalCount / rowsPerPage));
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchCompanies();
  }, [currentPage, sortOption]);

  const columnDefs = [
    { key: "rank", label: "순위", colClassName: "short" },
    { key: "name", label: "기업명", colClassName: "title" },
    { key: "description", label: "기업소개", colClassName: "content" },
    { key: "category", label: "카테고리", colClassName: "etc" },
    { key: "myCompanySelectCount", label: "나의 기업 선택 횟수", colClassName: "etc" },
    { key: "compareCompanySelectCount", label: "비교 기업 선택 횟수", colClassName: "etc" },
  ];

  const sectionRight = (
    <div className="search_wrap_parent flex">
      <Dropdown size="medium" options={options} onChange={handleSortChange}></Dropdown>
    </div>
  );

  return (
    <div className="content_wrap companyoverview_page">
      <Section title={"비교 현황"} sh_right={sectionRight}>
        <Table columnDefs={columnDefs} rows={companies} currentPage={currentPage} rowsPerPage={rowsPerPage} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Section>
    </div>
  );
}

export default CompareOverview;
