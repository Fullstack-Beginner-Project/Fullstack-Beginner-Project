import React from "react";

import Table from "../components/Table";
import Button from "../components/Button"; 
import Pagination from "../components/Pagination";
import "../assets/css/CompanyDetail.css";

import { mockCompanies } from "../mock/companies";

function CompanyDetail({
}) {
  return (
    <div className="content_wrap">
      <div className="company_detail_wrap">

        {/* 회사 정보 */}
        <div className="company_detail_info">
          <div className="company_detail_top">
            <img 
              src="src/assets/images/img_bi_codeit.webp" 
              alt="코드잇"
            />

            <div className="company_detail_info">
              <h2>코드잇</h2>
              <p>에듀테크</p>
            </div>
          </div>

          <div className="company_summary">
            <div className="summary_box">
              <span>누적 투자 금액</span>
              <strong>140억원</strong>
            </div>

            <div className="summary_box">
              <span>매출액</span>
              <strong>44.3억원</strong>
            </div>

            <div className="summary_box">
              <span>고용 인원</span>
              <strong>99명</strong>
            </div>
          </div>

          <div className="company_description">
            <h4>기업소개</h4>

            <p>
              기업 소개 내용이 들어갑니다. API에서 받아온 소개글을
              출력하는 영역입니다.
            </p>
          </div>
        </div>

        {/* 투자내역 */}
        <div className="invest_details_wrap">
          <div className="invest_details">
            <h3>View My Startup에서 받은 투자</h3>

            <Button
              size="middle"
              variant="primary"
            >
              기업등록하기
            </Button>
          </div>
          <p>총 200억 원</p>
        </div>


        <Table />

        <Pagination />

      </div>
    </div>
  );
}

export default CompanyDetail;