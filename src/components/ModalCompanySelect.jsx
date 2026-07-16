import { useEffect, useState } from "react";
import axios from "axios";

import Modal from "../components/Modal";
import Search from "./Search";
import CompanyLists from "../components/CompanyLists";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import "../assets/css/ModalCompanySelect.css";

const API_BASE_URL = "https://fullstack-beginner-api-test.ggeonwoo.workers.dev";
const PAGE_SIZE = 5;
const RECENT_MY_COMPANY_KEY = "recentMyCompanyIds";
const RECENT_COMPARE_COMPANY_KEY = "recentCompareCompanyIds";
const MAX_RECENT_IDS = 10;

const readRecentIds = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const addRecentId = (key, id) => {
  const next = [id, ...readRecentIds(key).filter((existingId) => existingId !== id)].slice(
    0,
    MAX_RECENT_IDS
  );
  localStorage.setItem(key, JSON.stringify(next));
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
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [searchCompanies, setSearchCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const excludedIdSet = new Set(excludedIds);
  const recentKey = multiple ? RECENT_COMPARE_COMPANY_KEY : RECENT_MY_COMPANY_KEY;

  // API 연결
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const recentIds = readRecentIds(recentKey).join(",");

        if (multiple) {
          const response = await axios.get(`${API_BASE_URL}/api/compare/companies`, {
            params: {
              page: currentPage,
              pageSize: PAGE_SIZE,
              keyword,
              compareCompanyIds: recentIds || undefined,
            },
          });
          setRecentCompanies(
            response.data.selectedCompanies.map((company) => ({
              ...company,
              id: company.companyId,
            }))
          );
          setSearchCompanies(
            response.data.companies.map((company) => ({
              ...company,
              id: company.companyId,
            }))
          );
          setTotalPages(response.data.totalPages);
        } else {
          const response = await axios.get(`${API_BASE_URL}/api/companies/my-company`, {
            params: {
              page: currentPage,
              pageSize: PAGE_SIZE,
              keyword,
              myRecentCompanyIds: recentIds || undefined,
            },
          });
          setRecentCompanies(response.data.recentCompanies);
          setSearchCompanies(response.data.companies);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("기업 목록 불러오기 실패:", error);
      }
    };

    fetchCompanies();
  }, [currentPage, keyword, multiple, recentKey]);

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
      const company = [...recentCompanies, ...searchCompanies].find(
        (company) => company.id === id
      );
      addRecentId(recentKey, id);
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
        const company = [...recentCompanies, ...searchCompanies].find(c => c.id === id);
        if (company) {
          setSelectedCompaniesState((prevList) => [...prevList, company]);
        }
      }
      return next;
    });
  };

  const handleConfirm = () => {
    selectedCompaniesState.forEach((company) => addRecentId(recentKey, company.id));
    onSelectCompanies(selectedCompaniesState);
    onClose();
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  return (
    <Modal
      title="나의 기업 선택하기"
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
          companies={withSelectedFlag(recentCompanies)}
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
