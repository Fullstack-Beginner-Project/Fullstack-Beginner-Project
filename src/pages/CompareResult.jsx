import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Section from "../components/Section";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import DefaultLogo from "../assets/images/logo_default.png";
import "../assets/css/compareResult.css";

import Table from "../components/Table";

const API_BASE_URL = "https://fullstack-beginner-api-test.ggeonwoo.workers.dev";

const SORT_OPTIONS = [
  "누적 투자금액 높은순",
  "누적 투자금액 낮은순",
  "매출액 높은순",
  "매출액 낮은순",
  "고용 인원 많은순",
  "고용 인원 적은순",
];

const SORT_OPTION_TO_API_VALUE = {
  "누적 투자금액 높은순": "investmentDesc",
  "누적 투자금액 낮은순": "investmentAsc",
  "매출액 높은순": "revenueDesc",
  "매출액 낮은순": "revenueAsc",
  "고용 인원 많은순": "employeeDesc",
  "고용 인원 적은순": "employeeAsc",
};

// 비교결과 확인하기
const columnDefs = [
  {
    key: "name",
    label: "기업명",
    colClassName: "title",
  },
  {
    key: "description",
    label: "기업소개",
    colClassName: "content",
  },
  {
    key: "category",
    label: "카테고리",
    colClassName: "etc",
  },
  {
    key: "actualInvestmentAmount",
    label: "누적투자금액",
    colClassName: "etc",
  },
  {
    key: "revenue",
    label: "매출액",
    colClassName: "etc",
  },
  {
    key: "employeeCount",
    label: "고용인원",
    colClassName: "etc",
  },
];

// 기업 순위 확인하기
const rankingColumnDefs = [
  {
    key: "own_rank",
    label: "순위",
    colClassName: "short",
  },
  {
    key: "name",
    label: "기업명",
    colClassName: "title",
  },
  {
    key: "description",
    label: "기업소개",
    colClassName: "content",
  },
  {
    key: "category",
    label: "카테고리",
    colClassName: "etc",
  },
  {
    key: "actualInvestmentAmount",
    label: "누적투자금액",
    colClassName: "etc",
  },
  {
    key: "revenue",
    label: "매출액",
    colClassName: "etc",
  },
  {
    key: "employeeCount",
    label: "고용인원",
    colClassName: "etc",
  },
];

const formatAmount = (value) => {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return "-";
  return `${Math.round(numberValue / 100000000).toLocaleString()}억 원`;
};

function CompareResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { myCompany, targetCompanies } = location.state ?? {};
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
  const [rankedCompanies, setRankedCompanies] = useState([]);

  // API 연결
  useEffect(() => {
    if (!myCompany || !targetCompanies || targetCompanies.length === 0) return;

    const fetchRankedCompanies = async () => {
      try {
        // 1. 전체 기업 리스트 가져오기
        const response = await axios.get(`${API_BASE_URL}/api/companies`, {
          params: {
            page: 1,
            pageSize: 9999, // 전체 긁어오기
            sort: SORT_OPTION_TO_API_VALUE[sortOption], // 정렬 옵션 반영
          },
        });

        const allCompanies = response.data.list;

        // 2. 순위 매기기
        const sortedCompanies = allCompanies.map((company, index) => ({
          ...company,
          rank: index + 1,
        }));

        // 3. 내 기업 + 타겟 기업만 필터링
        const selectedIds = [myCompany.id, ...targetCompanies.map(c => c.id)];
        const rankedCompanies = sortedCompanies.filter(c =>
          selectedIds.includes(c.id)
        );
        setRankedCompanies(rankedCompanies);
      } catch (error) {
        console.error("기업 랭킹 조회 실패:", error);
      } finally {
        console.log(rankedCompanies);
      }
    };

    fetchRankedCompanies();
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
        {/* 이 부분은 특정 기업을 상단으로 올리는 기능은 없어서 비워놨습니다 */}
        {/* 현재 테이블 컴포넌트 사용 시 순서가 지정된 목업 데이터가 필요합니다  */}
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
        {/* columnDefs: 테이블 헤더, 테이블 열 스타일 지정 */}
        {/* rows: 데이터 */}
        {/* myCompany: 내가 선택한 기업 아이디 <<< 해당 row 하이라이트 */}
        <Table
          columnDefs={rankingColumnDefs}
          rows={rankedCompanies}
          myCompany={myCompany.id}
          currentPage={1}
          rowsPerPage={rankedCompanies.length}
        />
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
