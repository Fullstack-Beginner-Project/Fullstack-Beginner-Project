import { useState } from "react";

import Table from "../components/Table";
import Button from "../components/Button"; 
import Pagination from "../components/Pagination";
import "../assets/css/CompanyDetail.css";

import { mockCompanies } from "../mock/companies";
// 투자 코멘트를 위한 mock 데이터 추가
import { mockInvestments } from "../mock/investments";

const PAGE_SIZE = 5;

function CompanyDetail() {
  const company = mockCompanies[0];

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(mockInvestments.length / PAGE_SIZE)
  );

  const paginatedInvestments = mockInvestments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );


  return (
    <div className="content_wrap">
      <div className="company_detail_wrap">

        {/* 회사 정보 */}
        <div className="company_detail_info">
          <div className="company_detail_top">
            <img 
              src={company.logo}
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
              <strong>{(company.actualInvestmentAmount / 100000000).toLocaleString()}억 원</strong>
            </div>

            <div className="summary_box">
              <span>매출액</span>
              <strong>{(company.revenue / 100000000).toLocaleString()}억 원</strong>
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
          <p>총 {(company.myStartupInvestmentAmount / 100000000).toLocaleString()}억 원</p>
        </div>

        <Table 
          data={paginatedInvestments}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} />

      </div>
    </div>
  );
}

export default CompanyDetail;