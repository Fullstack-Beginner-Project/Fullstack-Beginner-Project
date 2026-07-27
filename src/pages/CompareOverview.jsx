import React, { useState, useEffect } from "react";
import "../assets/css/compareoverview.css";
import Dropdown from "../components/Dropdown.jsx";
import Section from "../components/Section";
import Table from "../components/Table.jsx";
import Pagination from "../components/Pagination.jsx";
import axios from "../api/axios.js";

function CompareOverview() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("selectCountDesc");

  useEffect(() => {
    const fetchCompanies = async () => {
      setListLoading(true); // 호출 시작 시 로딩 켜기
      try {
        const response = await axios.get(
          `/api/compare/status?page=${currentPage}&pageSize=${rowsPerPage}&sort=${sortOption}`
        );
        const list = response.data?.companies ?? [];
        setCompanies(list);
        setTotalPages(response.data?.totalPages ?? 1);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        setCompanies([]);
      } finally {
        setLoading(false); // 호출 끝나면 로딩 끄기
        setListLoading(false);
      }
    };
    fetchCompanies();
  }, [currentPage, sortOption]);

  const options = [
    "나의 기업 선택 횟수 높은순",
    "나의 기업 선택 횟수 낮은순",
    "비교 기업 선택 횟수 높은순",
    "비교 기업 선택 횟수 낮은순",
  ];

  const handleSortChange = (selected) => {
    switch (selected) {
      case "나의 기업 선택 횟수 높은순":
        setSortOption("selectCountDesc");
        break;
      case "나의 기업 선택 횟수 낮은순":
        setSortOption("selectCountAsc");
        break;
      case "비교 기업 선택 횟수 높은순":
        setSortOption("compareCountDesc");
        break;
      case "비교 기업 선택 횟수 낮은순":
        setSortOption("compareCountAsc");
        break;
      default:
        setSortOption("selectCountDesc");
    }
  };

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
        {loading ? (
          <p className="in_loading">로딩 중...</p>
        ) : companies.length === 0 ? (
          <p className="no_data">아직 투자 현황이 없어요</p>
        ) : (
          <>
            <Table loading={listLoading} columnDefs={columnDefs} rows={companies} currentPage={currentPage} rowsPerPage={rowsPerPage} />
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
}

export default CompareOverview;
