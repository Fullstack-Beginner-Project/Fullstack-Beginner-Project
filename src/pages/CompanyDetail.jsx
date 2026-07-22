import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Table from "../components/Table";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import ModalInvest from "../components/ModalInvest";
import ModalConfirm from "../components/ModalConfirm";
import "../assets/css/CompanyDetail.css";
import FavoriteButton from "../components/FavoriteButton.jsx";

import axios from "../api/axios.js";
import LogoImg from "../components/LogoImg.jsx";
import ModalEditInvest from "../components/ModalEditInvest.jsx";
import ModalDelete from "../components/ModalDelete.jsx";

const PAGE_SIZE = 5;

function CompanyDetail() {

  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    message: "",
  });

  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const rowsPerPage = 5;

  // API 연결
  const fetchData = async () => {
    try {
      const companyResponse = await axios.get(
        `/api/companies/${companyId}`
      );

      setCompany(companyResponse.data.company);

      const investmentResponse = await axios.get(
        `/api/companies/${companyId}/investments?page=${currentPage}&pageSize=${PAGE_SIZE}`
      );

      setInvestments(investmentResponse.data.list);

      setTotalPages(
        Math.ceil(investmentResponse.data.totalCount / PAGE_SIZE)
      );
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    } finally {
      setLoading(false); // 호출 시작 시 로딩 켜기
    }
  };

  useEffect(() => {
    setLoading(true); // 호출 시작 시 로딩 켜기
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

  const handleInvest = async (form) => {
    try {
      await axios.post(`/api/investments`, {
        companyId: company.id,
        investorName: form.investor,
        amount: Number(form.amount),
        comment: form.comment,
        password: form.password,
        passwordConfirmation: form.passwordConfirm,
      });

      // 모달 닫기
      setIsInvestOpen(false);
      // 완료 모달 열기
      setConfirmModal({
        open: true,
        message: "투자가 완료되었어요!",
      });

      // 투자내역 새로고침
      fetchData();
    } catch (error) {
      console.error("투자 실패", error);
      setConfirmModal({
        open: true,
        message: "투자에 실패했습니다.",
      });
    }
  };


  // 수정하기
  const handleEditInvestment = async (form) => {
    if (!selectedInvestment) return;

    try {
      await axios.patch("/api/investments", {
        investmentsId: selectedInvestment.id,
        investorName: form.investorName,
        amount: Number(String(form.amount).replaceAll(",", "")),
        comment: form.comment,
        password: form.password,
      });

      setIsEditOpen(false);
      setSelectedInvestment(null);

      setConfirmModal({
        open: true,
        message: "투자 내역이 수정되었어요!",
      });

      await fetchData();
    } catch (error) {
      console.error("투자 수정 실패:", error);

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message ?? "";

      let message = "투자 내역 수정에 실패했습니다.";

      if (!error.response) {
        message = "서버에 연결할 수 없습니다.";
      } else if (status === 400) {
        message = serverMessage ?? "입력한 정보를 확인해 주세요.";
      } else if (status >= 500) {
        message = "서버 오류가 발생했습니다.";
      }

      // 수정 모달 닫기
      setIsEditOpen(false);
      setSelectedInvestment(null);

      setConfirmModal({
        open: true,
        message:
          message,
      });
    }
  };
  const handleOpenEditInvestment = (investment) => {
    setSelectedInvestment(investment);
    setIsEditOpen(true);
  };

  // 삭제하기
  const handleDeleteInvestment = async (password) => {
    if (!selectedInvestment) return;

    try {
      await axios.delete("/api/investments", {
        data: {
          investmentsId: selectedInvestment.id,
          password: password,
        },
      });

      setIsDeleteOpen(false);
      setSelectedInvestment(null);

      setConfirmModal({
        open: true,
        message: "투자 내역이 삭제되었어요!",
      });

      await fetchData();
    } catch (error) {
      console.error("투자 삭제 실패:", error);
      console.log("삭제 오류 응답:", error.response?.data);

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message ?? "";

      let message = "투자 내역 삭제에 실패했습니다.";


      if (!error.response) {
        message = "서버에 연결할 수 없습니다.";
      } else if (status === 400) {
        message = serverMessage || "입력한 정보를 확인해 주세요.";
      } else if (status >= 500) {
        message = "서버 오류가 발생했습니다.";
      } else if (serverMessage) {
        message = serverMessage;
      }

      setIsDeleteOpen(false);
      setSelectedInvestment(null);

      setConfirmModal({
        open: true,
        message:
          message,
      });
    }
  };
  const handleOpenDeleteInvestment = (investment) => {
    setSelectedInvestment(investment);
    setIsDeleteOpen(true);
  };



  return (
    <>
      <div className="content_wrap companydetail_page">
        {loading ? (
          <p className="in_loading">로딩 중...</p>
        ) : !company ? (
          <p className="no_data">기업 정보를 불러오지 못했습니다.</p>
        ) : (
          <div className="company_detail_wrap">
            {/* 회사 정보 */}
            <div className="company_detail_info">
              <div className="company_detail_top">
                <div className="company_detail_company">
                <LogoImg cId={company.id} cNm={company.name} />
                <div className="company_detail_info">
                  <h2>{company.name}</h2>
                  <p>{company.category}</p>
                </div>
              </div>
              
                <FavoriteButton companyId={company.id} />
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
                  onClick={() => setIsInvestOpen(true)}
                >
                  기업투자하기
                </Button>
              </div>
              <p>총 {Number(company.actualInvestmentAmount / 100000000).toLocaleString()}억 원</p>
            </div>

            <Table
              columnDefs={columnDefs}
              rows={investments}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              onEditInvestment={handleOpenEditInvestment}
              onDeleteInvestment={handleOpenDeleteInvestment}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

          </div>
        )}
      </div>
      {/* 모달창 불러오기 */}
      {isInvestOpen && (
        <ModalInvest
          company={company}
          onClose={() => setIsInvestOpen(false)}
          onInvest={handleInvest}
        />
      )}

      {confirmModal.open && (
        <ModalConfirm
          message={confirmModal.message}
          onClose={() =>
            setConfirmModal({
              open: false,
              message: "",
            })
          }
        />
      )}

      {/* 투자 수정 모달 */}
      {isEditOpen && selectedInvestment && (

        <ModalEditInvest
          company={company}
          initialData={selectedInvestment}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedInvestment(null);
          }}
          onInvest={handleEditInvestment}
        />
      )}

      {/* 투자 삭제 모달 */}
      {isDeleteOpen && selectedInvestment && (
        <ModalDelete
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedInvestment(null);
          }}
          onDelete={handleDeleteInvestment}
        />
      )}
    </>
  );
}

export default CompanyDetail;