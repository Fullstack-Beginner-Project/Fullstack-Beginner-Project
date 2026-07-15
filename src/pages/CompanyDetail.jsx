import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Table from "../components/Table";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import "../assets/css/CompanyDetail.css";
import DefaultLogo from "../assets/images/logo_default.png";
import axios from "axios";

const PAGE_SIZE = 5;
// const MENU_WIDTH = 154;
// const MENU_HEIGHT = 90;
// const GAP = 8;

function CompanyDetail() {
  // const [commentMenu, setCommentMenu] = useState({
  //   row: null,
  //   top: 0,
  //   left: 0,
  // });

  // const handleOpenCommentMenu = (event, row) => {
  //   event.stopPropagation();

  //   const rect = event.currentTarget.getBoundingClientRect();

  //   const left = Math.min(
  //     Math.max(GAP, rect.right - MENU_WIDTH),
  //     window.innerWidth - MENU_WIDTH - GAP
  //   );

  //   const top =
  //     rect.bottom + MENU_HEIGHT + GAP <= window.innerHeight
  //       ? rect.bottom + GAP
  //       : rect.top - MENU_HEIGHT - GAP;

  //   setCommentMenu((prev) => {
  //     // 같은 행의 버튼을 다시 누르면 닫기
  //     if (prev.row?.id === row.id) {
  //       return {
  //         row: null,
  //         top: 0,
  //         left: 0,
  //       };
  //     }

  //     return {
  //       row,
  //       top,
  //       left,
  //     };
  //   });
  // };
  const {companyId} = useParams();
  const [company, setCompany] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // API 연결
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 기업 상세
        const companyResponse = await axios.get(
          `https://fullstack-beginner-api-test.ggeonwoo.workers.dev/api/companies/${companyId}`
        );
        setCompany(companyResponse.data.company);

        // 투자 목록
        const investmentResponse = await axios.get(
          `https://fullstack-beginner-api-test.ggeonwoo.workers.dev/api/companies/${companyId}/investments?page=${currentPage}&pageSize=${PAGE_SIZE}`
        );
        setInvestments(investmentResponse.data.list);
        setTotalPages(Math.ceil(investmentResponse.data.totalCount / PAGE_SIZE)
      );
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, [companyId, currentPage]);

  const columnDefs = [
    {
      key: "investorName",
      label: "투자자 이름",
      colClassName: "etc_2",
    },
    {
      key: "rank",
      label: "순위",
      colClassName: "short",
    },
    {
      key: "amount",
      label: "투자금액",
      colClassName: "etc",
    },
    {
      key: "comment",
      label: "투자 코멘트",
      colClassName: "content",
    },
  ];

  if (!company) {
    return <div>Loading...</div>
  }
  return (
    <div className="content_wrap">
      <div className="company_detail_wrap">

        {/* 회사 정보 */}
        <div className="company_detail_info">
          <div className="company_detail_top">
            <img
              src={company.logo ?? DefaultLogo}
              alt={company.name}
            />

            <div className="company_detail_info">
              <h2>{company.name}</h2>
              <p>{company.category}</p>
            </div>
          </div>

          <div className="company_summary">
            <div className="summary_box">
              <span>누적 투자 금액</span>
              <strong>{Number(company.actualInvestmentAmount / 100000000).toLocaleString()}억 원</strong>
            </div>

            <div className="summary_box">
              <span>매출액</span>
              <strong>{Number(company.revenue / 100000000).toLocaleString()}억 원</strong>
            </div>

            <div className="summary_box">
              <span>고용 인원</span>
              <strong>{company.employeeCount}명</strong>
            </div>
          </div>

          <div className="company_description">
            <h4>기업소개</h4>

            <p>{company.description}</p>
          </div>
        </div>

        {/* 투자내역 */}
        <div className="invest_details_wrap">
          <div className="invest_details">
            <h3>View My Startup에서 받은 투자</h3>

            <Button
              size="medium"
              variant="primary"
            >
              기업투자하기
            </Button>
          </div>
          <p>총 {Number(company.actualInvestmentAmount / 100000000).toLocaleString()}억 원</p>
        </div>

        <Table 
          columnDefs={columnDefs} 
          rows={investments}>
        </Table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} />

      </div>
    </div>
  );
}

export default CompanyDetail;