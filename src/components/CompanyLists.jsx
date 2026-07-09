import Button from '../components/Button';
import DefaultLogo from '../assets/images/logo_default.png';

function CompanyLists({ companies }) {
  return (
    <ul className="companyList">
  {companies.map((company) => (
    <li key={company.id}>
      <img src={company.logo ?? DefaultLogo } alt={company.name} />

      <div>
        <p>{company.name}</p>
        <span>{company.category}</span>
      </div>

      <Button
        selected={company.selected}
        onClick={() => handleSelect(company.id)}
      >
        {company.selected ? '선택 해제' : '선택하기'}
      </Button>
    </li>
  ))}
</ul>
  )
}

export default CompanyLists;
