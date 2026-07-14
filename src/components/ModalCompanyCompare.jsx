import { useState } from "react";

import Modal from "../components/Modal";
import Search from "./Search";
import CompanyLists from "../components/CompanyLists";
import Pagination from "../components/Pagination";
import "../assets/css/ModalCompanySelect.css";
import "../assets/css/ModalCompanyCompare.css";

import { mockCompanies } from "../mock/companies";

const PAGE_SIZE = 5;

function ModalCompanyCompare() {
  const [companies, setCompanies] = useState(mockCompanies);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const searchCompanies = companies.filter((company) =>
  company.name.includes(keyword)
  );

  const selectedCompanies = companies.filter(
  (company) => company.selected
  );

  const totalPages = Math.max(
    1,
    Math.ceil(searchCompanies.length / PAGE_SIZE)
  );

  const paginatedCompanies = searchCompanies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 비교할 기업은 최대 5개까지 선택 가능
  const handleSelect = (id) => {
  setCompanies((prev) => {
    const selectedCount = prev.filter(c => c.selected).length;

    return prev.map((company) => {
      if (company.id !== id) return company;

      if (!company.selected && selectedCount >= 5) {
        return company;
      }

      return {
        ...company,
        selected: !company.selected,
      };
    });
  });
};

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };  

  return (
    <Modal
      title="비교할 기업 선택하기"
      footer={
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      }
    >
      <Search 
        value={keyword}
        onChange={handleKeywordChange}/>

      <div className="company_select_list_wrap">        
        <CompanyLists
          title="선택한 기업"
          companies={selectedCompanies}
          onSelect={handleSelect}
        />

        <CompanyLists
          title="검색 결과"
          companies={paginatedCompanies}
          onSelect={handleSelect}
        />
      </div>

      <p className="caution_message">
        *비교할 기업은 최대 5개까지 선택 가능합니다.
      </p>
    </Modal>
  );
}

export default ModalCompanyCompare;