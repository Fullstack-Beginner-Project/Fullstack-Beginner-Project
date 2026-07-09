import Modal from '../components/Modal';
import Search from './Search';
import CompanyLists from '../components/CompanyLists';
import Pagination from '../components/Pagination';

function ModalCompanyCompare({
  companies,
  handleSelect,
  }) {
  const [keyword, setKeyword] = useState('');

  const searchCompanies = companies.filter((company) =>
  company.name.includes(keyword)
  );

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

  return (
    <Modal
      title='비교할 기업 선택하기'
      footer={<Pagination />}
    >
      <Search 
        value={keyword}
        onChange={setKeyword}/>

      <CompanyLists
        title='선택한 기업'
        companies={selectedCompanies}
        onSelect={handleSelect}
      />

      <CompanyLists
        title='검색 결과'
        companies={searchCompanies}
        onSelect={handleSelect}
      />

      <p className='caution_message'>
        *비교할 기업은 최대 5개까지 선택 가능합니다.
      </p>
    </Modal>
  );
}

export default ModalCompanyCompare;