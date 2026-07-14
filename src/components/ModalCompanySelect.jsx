import { useState } from "react";

import Modal from "../components/Modal";
import Search from "./Search";
import CompanyLists from "../components/CompanyLists";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import "../assets/css/ModalCompanySelect.css";

import { mockCompanies } from "../mock/companies";

const PAGE_SIZE = 5;

function ModalCompanySelect({
  onClose,
  onSelectCompany,
  onSelectCompanies,
  multiple = false,
  selectedCompanies = [],
  maxSelectable,
}) {
  const companies = mockCompanies;
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState(
    () => new Set(selectedCompanies.map((company) => company.id))
  );

  const recentCompanies = companies.filter(
    (company) => company.isRecent
  );

  const searchCompanies = companies.filter(
    (company) =>
      company.name.includes(keyword) ||
      company.category.includes(keyword)
  );

  const totalPages = Math.max(
    1,
    Math.ceil(searchCompanies.length / PAGE_SIZE)
  );

  const paginatedCompanies = searchCompanies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const isCheckLimitReached =
    typeof maxSelectable === 'number' && checkedIds.size >= maxSelectable;

  const withSelectedFlag = (list) =>
    list.map((company) => ({
      ...company,
      selected: checkedIds.has(company.id),
    }));

  const handleSelect = (id) => {
    if (!multiple) {
      const company = companies.find((company) => company.id === id);
      onSelectCompany(company);
      onClose();
      return;
    }

    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (isCheckLimitReached) return prev;
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = companies.filter((company) => checkedIds.has(company.id));
    onSelectCompanies(selected);
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
        value={keyword}
        onChange={handleKeywordChange}
      />
      <div className='company_select_list_wrap'>
        <CompanyLists
          title="최근 비교한 기업"
          companies={multiple ? withSelectedFlag(recentCompanies) : recentCompanies}
          onSelect={handleSelect}
        />

        <CompanyLists
          title="검색 결과"
          companies={multiple ? withSelectedFlag(paginatedCompanies) : paginatedCompanies}
          onSelect={handleSelect}
          emptyMessage="검색 결과가 없습니다."
        />
      </div>
    </Modal>
  );
}

export default ModalCompanySelect;