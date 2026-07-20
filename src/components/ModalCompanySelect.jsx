import { useEffect, useState } from "react";
import axios from "../api/axios.js";

import Modal from "../components/Modal";
import Search from "./Search";
import CompanyLists from "../components/CompanyLists";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import "../assets/css/ModalCompanySelect.css";

const PAGE_SIZE = 5;
// compareCompanyIds는 API 스펙상 요청 시 최대 5개까지만 허용됨
const MAX_COMPARE_COMPANY_IDS_PER_REQUEST = 5;
// MyCompanyCompare.jsx의 "기업 비교하기" 클릭 시 저장되는 마지막 비교 세션
const LAST_COMPARE_SESSION_KEY = "lastCompareSession";

// 마지막 비교 세션(나의 기업 1개 + 비교 기업 최대 5개)을 반환
const readLastCompareSession = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(LAST_COMPARE_SESSION_KEY));
    if (!stored || typeof stored.myCompanyId !== "string") {
      return { myCompanyId: null, compareCompanyIds: [] };
    }
    const compareCompanyIds = Array.isArray(stored.compareCompanyIds)
      ? stored.compareCompanyIds.slice(0, MAX_COMPARE_COMPANY_IDS_PER_REQUEST)
      : [];
    return { myCompanyId: stored.myCompanyId, compareCompanyIds };
  } catch {
    return { myCompanyId: null, compareCompanyIds: [] };
  }
};

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
  // "최근 비교한 기업"을 나의 기업 / 비교 기업으로 분리 표시 (단일·다중 모드 공통)
  const [recentMyCompany, setRecentMyCompany] = useState(null);
  const [recentTargetCompanies, setRecentTargetCompanies] = useState([]);
  const [searchCompanies, setSearchCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const excludedIdSet = new Set(excludedIds);

  // API 연결
  useEffect(() => {
    const fetchCompanies = async () => {
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
            compareResponse.data.selectedCompanies.map((company) => ({
              ...company,
              id: company.companyId,
            }))
          );
          setSearchCompanies(
            compareResponse.data.companies.map((company) => ({
              ...company,
              id: company.id ?? company.companyId,
            }))
          );
          setTotalPages(compareResponse.data.totalPages);
        } else {
          // 마지막 비교 세션(나의 기업 1개 + 비교 기업 최대 5개)을 "최근 비교한 기업"으로 표시
          const { myCompanyId, compareCompanyIds } = readLastCompareSession();

          const [myCompanyResponse, response] = await Promise.all([
            myCompanyId
              ? axios
                  .get(`/api/companies/${myCompanyId}`)
                  .catch(() => null)
              : Promise.resolve(null),
            axios.get(`/api/companies/my-company`, {
              params: {
                page: currentPage,
                pageSize: PAGE_SIZE,
                keyword,
                myRecentCompanyIds: compareCompanyIds.join(",") || undefined,
              },
            }),
          ]);

          setRecentMyCompany(myCompanyResponse?.data?.company ?? null);
          setRecentTargetCompanies(response.data.recentCompanies);
          setSearchCompanies(response.data.companies);
          setTotalPages(Math.ceil(response.data.totalCount / PAGE_SIZE));
        }
      } catch (error) {
        console.error("기업 목록 불러오기 실패:", error);
      }
    };

    fetchCompanies();
  }, [currentPage, keyword, multiple]);

  const isCheckLimitReached =
    typeof maxSelectable === 'number' && checkedIds.size >= maxSelectable;

  const withSelectedFlag = (list) =>
    list.map((company) => ({
      ...company,
      selected: checkedIds.has(company.id),
      disabled: excludedIdSet.has(company.id),
    }));

  const handleSelect = (id) => {
    if (excludedIdSet.has(id)) return;

    if (!multiple) {
      const knownCompanies = [
        ...(recentMyCompany ? [recentMyCompany] : []),
        ...recentTargetCompanies,
        ...searchCompanies,
      ];
      const company = knownCompanies.find((company) => company.id === id);
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
        const knownCompanies = [
          ...(recentMyCompany ? [recentMyCompany] : []),
          ...recentTargetCompanies,
          ...searchCompanies,
        ];
        const company = knownCompanies.find(c => c.id === id);
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
        <CompanyLists
          title="최근 비교한 기업"
          companies={withSelectedFlag([
            ...(recentMyCompany ? [{ ...recentMyCompany, isMyCompany: true }] : []),
            ...recentTargetCompanies,
          ])}
          onSelect={handleSelect}
        />

        <CompanyLists
          title="검색 결과"
          companies={withSelectedFlag(searchCompanies)}
          onSelect={handleSelect}
          emptyMessage="검색 결과가 없습니다."
        />
      </div>
    </Modal>
  );
}



export default ModalCompanySelect;
