import { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown.jsx";
import "../assets/css/companyFavorite.css";
import Section from "../components/Section";
import Table from "../components/Table.jsx";
import Pagination from "../components/Pagination.jsx";
import axios from "../api/axios.js";
import { getFavoriteCompanyIds } from "../utils/common"


const columnDefs = [
  { key: "rank", label: "순위", colClassName: "short" },
  { key: "name", label: "기업명", colClassName: "title" },
  { key: "description", label: "기업소개", colClassName: "content" },
  { key: "category", label: "카테고리", colClassName: "etc" },
  { key: "revenue", label: "매출액", colClassName: "etc_3" },
];

function WishList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("favoriteDesc");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const favoriteCompanyIds = getFavoriteCompanyIds();

        const response = await axios.get(
          `/api/companies/favorites?favoriteCompanyIds=${favoriteCompanyIds.join(",")}&page=${currentPage}&pageSize=${rowsPerPage}&sort=${sortOption}`
        );
        setCompanies(response.data?.companies ?? []);
        setTotalPages(response.data?.totalPages ?? 1);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage, sortOption]);

  const options = ["최근 찜한 순", "처음 찜한 순"];

  const handleSortChange = (selected) => {
    switch (selected) {
      case "최근 찜한 순":
        setSortOption("favoriteDesc");
        break;
      case "처음 찜한 순":
        setSortOption("favoriteAsc");
        break;
      default:
        setSortOption("favoriteDesc");
    }
  };

  const sectionRight = (
    <div className="search_wrap_parent flex">
      <Dropdown size="medium" options={options} onChange={handleSortChange} />
    </div>
  );

  return (
    <div className="content_wrap wishlist_page">
      <Section title={"찜한 목록"} sh_right={sectionRight}>
        {loading ? (
          <p className="in_loading">로딩 중...</p>
        ) : companies.length === 0 ? (
          <p className="no_data">아직 찜한 기업이 없어요</p>
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



export default WishList
