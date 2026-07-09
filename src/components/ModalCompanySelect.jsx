import { useState } from 'react';

import Modal from '../components/Modal';
import Search from './Search';
import CompanyLists from '../components/CompanyLists';
import Pagination from '../components/Pagination';

// API 내려오기 전 목업 데이터 사용
import { mockCompanies } from '../mocks/companies';

function ModalCompanySelect() {
    // API 내려온 후 useEffect 추가
  const [companies, setCompanies] = useState(mockCompanies);
  const [keyword, setKeyword] = useState('');
  
  const recentCompanies = companies.filter(
  (company) => company.isRecent // isRecent은 API에서 최근 비교한 기업 여부를 내려줄 때 값 변경
);

  const searchCompanies = companies.filter(
  (company) =>
    company.name.includes(keyword) ||
    company.category.includes(keyword)
  );

  const handleSelect = (id) => {
    setRecentCompanies((prev) =>
      prev.map((company) =>
        company.id === id
          ? { ...company, selected: !company.selected }
          : company
      )
    );
  };

  return (
    <Modal
      title='나의 기업 선택하기'
      footer={<Pagination />}
    >
      <Search 
        value={keyword}
        onChange={setKeyword}/>

      <CompanyLists
        title='최근 비교한 기업'
        companies={recentCompanies}
        onSelect={handleSelect}
      />

      <CompanyLists
        title='검색 결과'
        companies={searchCompanies}
        onSelect={handleSelect}
        emptyMessage='검색 결과가 없습니다.'
      />
    </Modal>
  );
}

export default ModalCompanySelect;