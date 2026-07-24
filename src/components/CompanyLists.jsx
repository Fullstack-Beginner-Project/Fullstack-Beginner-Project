import Button from "../components/Button.jsx";
import LogoImg from "../components/LogoImg.jsx"

import "../assets/css/companyLists.css";

function CompanyLists({ 
  title,
  totalCount,
  companies, 
  onSelect,
  emptyMessage,
}) {
  const resolveEmpthMesssage =
    title === "검색결과" 
    ? "검색 결과가 없습니다."
    : emptyMessage;

  return (
    <div className="company_list_wrap">
      <h4>
        {title} ({totalCount ?? companies.length})
      </h4>
      {/* 리스트 검색 결과가 있는 경우와 없는 경우 고려 */}
      {companies.length === 0 ? (
        <p className="empty_message">{resolveEmpthMesssage}</p>
      ) : (
        <ul className="company_list">
          {companies.map((company) => (
            <li
              key={company.id}
              className={company.isMyCompany ? "is_my_company" : undefined}
            >
              <div>
                <LogoImg cId={company.id} cNm={company.name} />
                <p>{company.name}</p>
                <span>{company.category}</span>
              </div>
  
              <Button
                size="small"
                variant="primary"
                selected={company.selected}
                disabled={company.disabled}
                onClick={() => onSelect(company.id)}
              >
                {company.disabled
                  ? '선택불가'
                  : company.selected
                  ? '선택해제'
                  : '선택하기'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
    
  )
}

export default CompanyLists;
