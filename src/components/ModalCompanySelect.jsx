import { useState } from 'react';

import Modal from '../components/Modal';
import Search from './Search';
import CompanyLists from '../components/CompanyLists';
import Pagination from '../components/Pagination';
import '../assets/css/ModalCompanySelect.css';

import { mockCompanies } from '../mock/companies';

const PAGE_SIZE = 5;

function ModalCompanySelect() {
  const [companies, setCompanies] = useState(mockCompanies);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleSelect = (id) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id
          ? {
              ...company,
              selected: !company.selected,
            }
          : company
      )
    );
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };  

  return (
    <Modal
      title="나의 기업 선택하기"
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
        onChange={handleKeywordChange}
      />
      <div className='company_select_list_wrap'>
        <CompanyLists
          title="최근 비교한 기업"
          companies={recentCompanies}
          onSelect={handleSelect}
        />

        <CompanyLists
          title="검색 결과"
          companies={paginatedCompanies}
          onSelect={handleSelect}
          emptyMessage="검색 결과가 없습니다."
        />
      </div>
    </Modal>
  );
}

export default ModalCompanySelect;