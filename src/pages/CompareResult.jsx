import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Section from "../components/Section";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import DefaultLogo from "../assets/images/logo_default.png";
import "../assets/css/compareResult.css";

const SORT_OPTIONS = [
  "누적 투자금액 높은순",
  "누적 투자금액 낮은순",
  "매출액 높은순",
  "매출액 낮은순",
  "고용 인원 많은순",
  "고용 인원 적은순",
];

const SORT_COMPARATORS = {
  "누적 투자금액 높은순": (a, b) =>
    (b.actualInvestmentAmount ?? 0) - (a.actualInvestmentAmount ?? 0),
  "누적 투자금액 낮은순": (a, b) =>
    (a.actualInvestmentAmount ?? 0) - (b.actualInvestmentAmount ?? 0),
  "매출액 높은순": (a, b) => (b.revenue ?? 0) - (a.revenue ?? 0),
  "매출액 낮은순": (a, b) => (a.revenue ?? 0) - (b.revenue ?? 0),
  "고용 인원 많은순": (a, b) => (b.employeeCount ?? 0) - (a.employeeCount ?? 0),
  "고용 인원 적은순": (a, b) => (a.employeeCount ?? 0) - (b.employeeCount ?? 0),
};

const formatAmount = (value) => {
  if (typeof value !== "number") return "-";
  return `${Math.round(value / 100000000).toLocaleString()}억 원`;
};

function CompareResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { myCompany, targetCompanies } = location.state ?? {};
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);

  const rankedCompanies = useMemo(() => {
    if (!myCompany || !targetCompanies) return [];
    return [myCompany, ...targetCompanies].sort(SORT_COMPARATORS[sortOption]);
  }, [myCompany, targetCompanies, sortOption]);

  if (!myCompany || !targetCompanies || targetCompanies.length === 0) {
    return (
      <div className="content_wrap compare_result_page">
        <p className="compare_result_empty">
          비교할 기업 정보가 없어요. 나의 기업 비교하기에서 먼저 기업을
          선택해 주세요.
        </p>
        <Button
          size="large"
          variant="primary"
          selected
          onClick={() => navigate("/my-company-compare")}
        >
          나의 기업 비교하기로 이동
        </Button>
      </div>
    );
  }

  return (
    <div className="content_wrap compare_result_page">
      <Section
        title="내가 선택한 기업"
        sh_right={
          <Button
            size="small"
            variant="primary"
            selected
            onClick={() => navigate("/my-company-compare")}
          >
            다른 기업 비교하기
          </Button>
        }
      >
        <div className="compare_result_my_company">
          <img src={myCompany.logo ?? DefaultLogo} alt={myCompany.name} />
          <p>{myCompany.name}</p>
          <span>{myCompany.category}</span>
        </div>
      </Section>

      <Section
        title="비교 결과 확인하기"
        sh_right={
          <Dropdown
            size="medium"
            options={SORT_OPTIONS}
            onChange={setSortOption}
          />
        }
      >
        <div className="compare_result_table_wrap">
          <table className="compare_result_table">
            <thead>
              <tr>
                <th>기업명</th>
                <th>기업 소개</th>
                <th>카테고리</th>
                <th>누적 투자 금액</th>
                <th>매출액</th>
              </tr>
            </thead>
            <tbody>
              <tr className="is-my-company">
                <td className="title">
                  <div className="td_inner">
                    <img src={myCompany.logo ?? DefaultLogo} alt={myCompany.name} />
                    <span>{myCompany.name}</span>
                  </div>
                </td>
                <td className="description">{myCompany.description ?? "-"}</td>
                <td>{myCompany.category}</td>
                <td>{formatAmount(myCompany.actualInvestmentAmount)}</td>
                <td>{formatAmount(myCompany.revenue)}</td>
              </tr>
              {targetCompanies.map((company) => (
                <tr key={company.id}>
                  <td className="title">
                    <div className="td_inner">
                      <img
                        src={company.logo ?? DefaultLogo}
                        alt={company.name}
                      />
                      <span>{company.name}</span>
                    </div>
                  </td>
                  <td className="description">{company.description ?? "-"}</td>
                  <td>{company.category}</td>
                  <td>{formatAmount(company.actualInvestmentAmount)}</td>
                  <td>{formatAmount(company.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="기업 순위 확인하기">
        <div className="compare_result_table_wrap">
          <table className="compare_result_table">
            <thead>
              <tr>
                <th>순위</th>
                <th>기업명</th>
                <th>기업 소개</th>
                <th>카테고리</th>
                <th>누적 투자 금액</th>
                <th>매출액</th>
                <th>고용 인원</th>
              </tr>
            </thead>
            <tbody>
              {rankedCompanies.map((company, index) => (
                <tr
                  key={company.id}
                  className={company.id === myCompany.id ? "is-my-company" : undefined}
                >
                  <td>{index + 1}위</td>
                  <td className="title">
                    <div className="td_inner">
                      <img
                        src={company.logo ?? DefaultLogo}
                        alt={company.name}
                      />
                      <span>{company.name}</span>
                    </div>
                  </td>
                  <td className="description">{company.description ?? "-"}</td>
                  <td>{company.category}</td>
                  <td>{formatAmount(company.actualInvestmentAmount)}</td>
                  <td>{formatAmount(company.revenue)}</td>
                  <td>
                    {typeof company.employeeCount === "number"
                      ? `${company.employeeCount}명`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="compare_result_footer">
        <Button
          size="large"
          variant="primary"
          selected
          // onClick={() => navigate("/my-company-compare")}
        >
          나의 기업(을) 투자하기
        </Button>
      </div>
    </div>
  );
}

export default CompareResult;
