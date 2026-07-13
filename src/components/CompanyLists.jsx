import Button from '../components/Button';
import DefaultLogo from '../assets/images/logo_default.png';

import '../assets/css/CompanyLists.css';

function CompanyLists({ 
  title,
  companies, 
  onSelect,
  emptyMessage,
}) {
  return (
    <div className="company_list_wrap">
      <h4>
        {title} ({companies.length})
      </h4>
      {/* 리스트 검색 결과가 있는 경우와 없는 경우 고려 */}
      {companies.length === 0 ? (
        <p className="empty_message">검색 결과가 없습니다.</p>
      ) : (
        <ul className="company_list">
          {companies.map((company) => (
            <li key={company.id}>
              <div>
                <img src={company.logo ?? DefaultLogo} alt={company.name} />
                <p>{company.name}</p>
                <span>{company.category}</span>
              </div>
  
              <Button
                selected={company.selected}
                onClick={() => onSelect(company.id)}
              >
                {company.selected ? '선택 해제' : '선택하기'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
    
  )
}

export default CompanyLists;
