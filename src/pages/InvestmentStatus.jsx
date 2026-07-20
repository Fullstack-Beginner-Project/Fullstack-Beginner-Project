import { useState, useEffect } from "react";
import "../assets/css/investmentstatus.css";
import Dropdown from "../components/Dropdown.jsx";
import Section from "../components/Section";
import Table from "../components/Table.jsx";
import Pagination from "../components/Pagination.jsx";
import axios from "../api/axios.js";

const columnDefs = [
  { key: "rank", label: "순위", colClassName: "short" },
  { key: "name", label: "기업명", colClassName: "title" },
  { key: "description", label: "기업소개", colClassName: "content" },
  { key: "category", label: "카테고리", colClassName: "etc" },
  { key: "actualInvestmentAmount", label: "View My Startup 투자 금액", colClassName: "etc_3" },
  { key: "userInvestmentAmount", label: "실제 누적 투자 금액", colClassName: "etc_3" },
];

function InvestmentStatus() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [orderBy, setOrderBy] = useState("userInvestmentAmount");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/companies/investmentStatus?page=${currentPage}&pageSize=${rowsPerPage}&orderBy=${orderBy}&order=${order}`
        );
        setCompanies(response.data.list);
        setTotalPages(Math.ceil(response.data.totalCount / rowsPerPage));
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, orderBy, order]);

  const options = [
    "View My Startup 투자 금액 높은순",
    "View My Startup 투자 금액 낮은순",
    "실제 누적 투자 금액 높은순",
    "실제 누적 투자 금액 낮은순",
  ];

  const handleSortChange = (selected) => {
    switch (selected) {
      case "View My Startup 투자 금액 높은순":
        setOrderBy("userInvestmentAmount");
        setOrder("desc");
        break;
      case "View My Startup 투자 금액 낮은순":
        setOrderBy("userInvestmentAmount");
        setOrder("asc");
        break;
      case "실제 누적 투자 금액 높은순":
        setOrderBy("actualInvestmentAmount");
        setOrder("desc");
        break;
      case "실제 누적 투자 금액 낮은순":
        setOrderBy("actualInvestmentAmount");
        setOrder("asc");
        break;
      default:
        setOrderBy("userInvestmentAmount");
        setOrder("desc");
    }
  };

  const sectionRight = (
    <div className="search_wrap_parent flex">
      <Dropdown size="medium" options={options} onChange={handleSortChange} />
    </div>
  );

  return (
    <div className="content_wrap investment_page">
      <Section title={"투자 현황"} sh_right={sectionRight}>
        {loading ? (
          <p className="in_loading">로딩 중...</p>
        ) : companies.length === 0 ? (
          <p className="no_data">아직 투자 현황이 없어요</p>
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
    </div>
  );
}

export default InvestmentStatus