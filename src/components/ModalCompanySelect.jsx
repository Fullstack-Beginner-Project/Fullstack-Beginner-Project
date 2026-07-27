import { useEffect, useState } from "react";
import axios from "../api/axios.js";

import Modal from "../components/Modal";
import Search from "./Search";
import CompanyLists from "../components/CompanyLists";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import "../assets/css/modalCompanySelect.css";
import {
  normalizeCompany,
  findCompanyById,
  withSelectedFlag,
  getFavoriteCompanyIds,
  readLastCompareSession,
} from "../utils/common";

const PAGE_SIZE = 5;

function ModalCompanySelect({
  onClose,
  onSelectCompany,
  onSelectCompanies,
  multiple = false,
  selectedCompanies = [],
  maxSelectable,
  excludedIds = [],
}) {
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState(
    () => new Set(selectedCompanies.map((company) => company.id))
  );

  const [selectedCompaniesState, setSelectedCompaniesState] = useState(selectedCompanies);
  // 찜한 기업 조회
  const [favoriteCompanies, setFavoriteCompanies] = useState([]);
  const [favoriteTotalCount, setFavoriteTotalCount] = useState(0);
  const [favoritePage, setFavoritePage] = useState(1);
  const [favoriteTotalPages, setFavoriteTotalPages] = useState(1);
  const [searchTotalCount, setSearchTotalCount] = useState(0);
  // 최근 비교한 기업 조회
  const [recentMyCompany, setRecentMyCompany] = useState(null);
  const [recentTargetCompanies, setRecentTargetCompanies] = useState([]);
  const [searchCompanies, setSearchCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // 로딩중 추가
  const [loading, setLoading] = useState(true);
  const [favoriteListLoading, setFavoriteListLoading] = useState(false);
  const [searchListLoading, setSearchListLoading] = useState(false);

  const excludedIdSet = new Set(excludedIds);

  const fetchFavoriteCompanies = async (page) => {
    setFavoriteListLoading(true);

    try {
      const favoriteCompanyIds = getFavoriteCompanyIds();

      const response = await axios.get("/api/companies/favorites", {
        params: {
          page,
          pageSize: PAGE_SIZE,
          sort: "favoriteDesc",
          favoriteCompanyIds: favoriteCompanyIds.join(",") || undefined,
        },
      });

      setFavoriteCompanies(
        response.data.companies.map(normalizeCompany)
      );
      setFavoriteTotalCount(response.data.total);
      setFavoriteTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("찜한 기업 목록 불러오기 실패", error);
    } finally {
      setFavoriteListLoading(false);
    }
  };

  const fetchSearchCompanies = async (page, searchKeyword) => {
  setSearchListLoading(true);

  try {
    if (multiple) {
      const response = await axios.get("/api/compare/companies", {
        params: {
          page,
          pageSize: PAGE_SIZE,
          keyword: searchKeyword,
        },
      });

      setSearchCompanies(
        response.data.companies.map(normalizeCompany)
      );
      setSearchTotalCount(response.data.total);
      setTotalPages(response.data.totalPages);
      return;
    }

    const response = await axios.get("/api/companies/my-company", {
      params: {
        page,
        pageSize: PAGE_SIZE,
        keyword: searchKeyword,
      },
    });

    setSearchCompanies(
      response.data.companies.map(normalizeCompany)
    );
    setSearchTotalCount(response.data.totalCount);
    setTotalPages(
      Math.ceil(response.data.totalCount / PAGE_SIZE)
    );
  } catch (error) {
    console.error("검색 결과 불러오기 실패:", error);
  } finally {
    setSearchListLoading(false);
  }
};

  const fetchRecentCompanies = async () => {
  try {
    const { myCompanyId, compareCompanyIds } =
      readLastCompareSession();

    const [myCompanyResponse, compareResponse] = await Promise.all([
      myCompanyId
        ? axios
            .get(`/api/companies/${myCompanyId}`)
            .catch(() => null)
        : Promise.resolve(null),

      axios.get("/api/compare/companies", {
        params: {
          page: 1,
          pageSize: PAGE_SIZE,
          compareCompanyIds:
            compareCompanyIds.join(",") || undefined,
        },
      }),
    ]);

    setRecentMyCompany(
      myCompanyResponse?.data?.company ?? null
    );
    setRecentTargetCompanies(
      compareResponse.data.selectedCompanies.map(normalizeCompany)
    );
  } catch (error) {
    console.error("최근 비교 기업 불러오기 실패:", error);
  }
};

  // 모달을 처음 열 때 필요한 두 목록을 함께 조회
  useEffect(() => {
    const fetchInitialCompanies = async () => {
      setLoading(true);

      try {
        if (multiple) {
          await Promise.all([
            fetchRecentCompanies(),
            fetchSearchCompanies(1,""),
          ]);
        } else {
          await Promise.all([
            fetchFavoriteCompanies(1),
            fetchSearchCompanies(1,""),
          ]);
        } 
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCompanies();
  }, [multiple]);

  const isCheckLimitReached =
  typeof maxSelectable === 'number' && checkedIds.size >= maxSelectable;

  const myCompanyList = recentMyCompany ? [recentMyCompany] : [];

  const handleSelect = (id) => {
    if (excludedIdSet.has(id)) return;  

  if (!multiple) {
    const company = findCompanyById(
      id,
      selectedCompaniesState,
      favoriteCompanies,
      searchCompanies
    );

    onSelectCompany(company);
    onClose();
    return;
  }

    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setSelectedCompaniesState((prevList) => prevList.filter(c => c.id !== id));
      } else {
        if (isCheckLimitReached) return prev;
        next.add(id);
        const company = findCompanyById(
          id,
          myCompanyList,
          recentTargetCompanies,
          searchCompanies
        );
        if (company) {
          setSelectedCompaniesState((prevList) => [...prevList, company]);
        }
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onSelectCompanies(selectedCompaniesState);
    onClose();
  };

  const handleFavoritePageChange = (page) => {
    setFavoritePage(page);
    fetchFavoriteCompanies(page);
  }

  const handleSearchPageChange = (page) => {
    setCurrentPage(page);
    fetchSearchCompanies(page, keyword);
  }

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
    fetchSearchCompanies(1, value);
  };

  const topCompanies = multiple
  ? [
      ...(recentMyCompany
        ? [{ ...recentMyCompany, isMyCompany: true }]
        : []),
      ...recentTargetCompanies,
    ]
  : favoriteCompanies;

  // 모달 타이틀 정의
  const topListTitle = multiple ? "최근 비교한 기업" : "찜한 기업";
  const topEmptyMessage = multiple
    ? "최근 비교한 기업이 없습니다."
    : "찜한 기업이 없습니다.";

  return (
    <Modal
      title={multiple ? "비교할 기업 선택하기" : "나의 기업 선택하기"}
      onClose={onClose}
      footer={
        multiple && (
          <div className="modal_footer_btns">
            <Button size="large" variant="primary" selected onClick={handleConfirm}>
              확인
            </Button>
          </div>
        )
      }
    >
      <Search
        size="medium"
        onSubmit={handleKeywordChange}
      />
      <div className='company_select_list_wrap'>
        {loading ? (
          <div className="in_loading">
            로딩 중...
          </div>
        ) : (
          <>
            <CompanyLists
              loading={!multiple && favoriteListLoading}
              title={topListTitle}
              totalCount={multiple ? topCompanies.length : favoriteTotalCount}
              companies={withSelectedFlag(
                topCompanies,
                checkedIds,
                excludedIdSet
              )}
              onSelect={handleSelect}
              emptyMessage={topEmptyMessage}
            />

            {!multiple && favoriteTotalPages > 1 && (
              <Pagination
                currentPage={favoritePage}
                totalPages={favoriteTotalPages}
                onPageChange={handleFavoritePageChange}
              />
            )}

            <CompanyLists
              loading={searchListLoading}
              title="검색 결과"
              totalCount={searchTotalCount}
              companies={withSelectedFlag(
                searchCompanies,
                checkedIds,
                excludedIdSet
              )}
              onSelect={handleSelect}
              emptyMessage="검색 결과가 없습니다."
            />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handleSearchPageChange}
              />
          </>
        )}
      </div>
    </Modal>
  );
}



export default ModalCompanySelect;
