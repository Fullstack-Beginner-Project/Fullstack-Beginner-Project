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

  const excludedIdSet = new Set(excludedIds);

  // API 연결
  useEffect(() => {
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      if (multiple) {
        const { myCompanyId, compareCompanyIds } = readLastCompareSession();

        const [myCompanyResponse, compareResponse] = await Promise.all([
          myCompanyId
            ? axios
                .get(`/api/companies/${myCompanyId}`)
                .catch(() => null)
            : Promise.resolve(null),

          axios.get(`/api/compare/companies`, {
            params: {
              page: currentPage,
              pageSize: PAGE_SIZE,
              keyword,
              compareCompanyIds: compareCompanyIds.join(",") || undefined,
            },
          }),
        ]);

        setRecentMyCompany(myCompanyResponse?.data?.company ?? null);
        setRecentTargetCompanies(
          compareResponse.data.selectedCompanies.map(normalizeCompany)
        );
        setSearchCompanies(
          compareResponse.data.companies.map(normalizeCompany)
        );
        setSearchTotalCount(compareResponse.data.total);
        setTotalPages(compareResponse.data.totalPages);
      } else {
        const favoriteCompanyIds = getFavoriteCompanyIds();

        const [favoriteResponse, response] = await Promise.all([
          axios.get(`/api/companies/favorites`, {
            params: {
              page: favoritePage,
              pageSize: PAGE_SIZE,
              sort: "favoriteDesc",
              favoriteCompanyIds: favoriteCompanyIds.join(",") || undefined,
            },
          }),

          axios.get(`/api/companies/my-company`, {
            params: {
              page: currentPage,
              pageSize: PAGE_SIZE,
              keyword,
            },
          }),
        ]);

        setFavoriteCompanies(
          favoriteResponse.data.companies.map(normalizeCompany)
        );
        setFavoriteTotalCount(favoriteResponse.data.total);
        setFavoriteTotalPages(favoriteResponse.data.totalPages);

        setSearchCompanies(
          response.data.companies.map(normalizeCompany)
        );
        setSearchTotalCount(response.data.totalCount);
        setTotalPages(Math.ceil(response.data.totalCount / PAGE_SIZE));
      }
    } catch (error) {
      console.error("기업 목록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCompanies();
}, [currentPage, favoritePage, keyword, multiple]);

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

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
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
        multiple ? (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="modal_footer_btns">
              <Button size="large" variant="primary" selected onClick={handleConfirm}>
                확인
              </Button>
            </div>
          </>
        ) : (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
                onPageChange={setFavoritePage}
              />
            )}

            <CompanyLists
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
          </>
        )}
      </div>
    </Modal>
  );
}



export default ModalCompanySelect;
