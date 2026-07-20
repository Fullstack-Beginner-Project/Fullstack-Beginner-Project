import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

import Section from "../components/Section";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import DefaultLogo from "../assets/images/logo_default.png";
import "../assets/css/compareResult.css";

import Table from "../components/Table";
import ModalInvest from "../components/ModalInvest";

<<<<<<< HEAD
=======


>>>>>>> ad8b9006924564b2082150b2a128e4847e1fbff6
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

const SORT_COMPARATORS = {
  "누적 투자금액 높은순": (a, b) => Number(b.actualInvestmentAmount) - Number(a.actualInvestmentAmount),
  "누적 투자금액 낮은순": (a, b) => Number(a.actualInvestmentAmount) - Number(b.actualInvestmentAmount),
  "매출액 높은순": (a, b) => Number(b.revenue) - Number(a.revenue),
  "매출액 낮은순": (a, b) => Number(a.revenue) - Number(b.revenue),
  "고용 인원 많은순": (a, b) => (b.employeeCount ?? 0) - (a.employeeCount ?? 0),
  "고용 인원 적은순": (a, b) => (a.employeeCount ?? 0) - (b.employeeCount ?? 0),
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

function CompareResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSlot, setOpenSlot] = useState(null);
  const { myCompany, targetCompanies } = location.state ?? {};
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
  const [compareResultSortOption, setCompareResultSortOption] = useState(SORT_OPTIONS[0]);
  const [rankedCompanies, setRankedCompanies] = useState([]);

  const handleOpenModal = () => {
    setOpenSlot(true);
  };

  const handleCloseModal = () => {
    setOpenSlot(false);
  };

  const handleInvest = async (form) => {
    // 서버 스펙에 맞게 변환
    const payload = {
      companyId: myCompany.id,
      investorName: form.investor,
      amount: Number(form.amount),
      comment: form.comment,
      password: form.password,
      passwordConfirmation: form.passwordConfirm,
    };

    // 콘솔로 확인
    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(`/api/investments`, payload);
      console.log("투자 성공:", response.data);
      alert("투자가 완료되었습니다!");
      handleCloseModal();
    } catch (error) {
      console.error("투자 실패:", error.response?.data || error.message);
    }
  };


  // API 연결
  useEffect(() => {
    if (!myCompany || !targetCompanies || targetCompanies.length === 0) return;

    const fetchRankedCompanies = async () => {
      try {
        // 1. 전체 기업 리스트 가져오기
        const response = await axios.get(`/api/companies`, {
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
          <img
            src={"/src/assets/images/company-logo-" + myCompany.id + ".webp"}
            alt={myCompany.name}
            onError={(e) => { e.currentTarget.src = DefaultLogo }}
          />
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
            onChange={setCompareResultSortOption}
          />
        }
      >
        {/* 나의 기업을 맨 위로 고정하고, 나머지 기업은 이 표에서만 독립적으로 정렬 */}
        <Table
          columnDefs={columnDefs}
          rows={[
            ...rankedCompanies.filter((company) => company.id === myCompany.id),
            ...rankedCompanies
              .filter((company) => company.id !== myCompany.id)
              .sort(SORT_COMPARATORS[compareResultSortOption]),
          ]}
          myCompany={myCompany.id}
          currentPage={1}
          rowsPerPage={rankedCompanies.length}
        />
      </Section>

      <Section
        title="기업 순위 확인하기"
        sh_right={
          <Dropdown
            size="medium"
            options={SORT_OPTIONS}
            onChange={setSortOption}
          />
        }
      >
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
          onClick={() => handleOpenModal()}
        >
          나의 기업(을) 투자하기
        </Button>
      </div>

      {openSlot && (
        <ModalInvest
          company={myCompany}
          onClose={handleCloseModal}
          onInvest={handleInvest}   // form을 인자로 받음
        />
      )}

    </div>
  );
}



export default CompareResult;
