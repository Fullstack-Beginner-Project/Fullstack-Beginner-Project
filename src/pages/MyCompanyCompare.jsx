import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

import Button from "../components/Button";
import ModalCompanySelect from "../components/ModalCompanySelect";
import DefaultLogo from "../assets/images/logo_default.png";
import "../assets/css/myCompanyCompare.css";

// ModalCompanySelect.jsx와 동일한 키를 사용해 최근 비교 세션을 공유
const LAST_COMPARE_SESSION_KEY = "lastCompareSession";


// 어떤 슬롯을 채우는 중인지 구분하기 위한 값
const SLOT = {
  MY: "my",
  TARGET: "target",
};

// 궁금한 기업은 최대 5개까지 선택 가능
const MAX_TARGET_COMPANIES = 5;

function MyCompanyCompare() {
  const navigate = useNavigate();
  const [myCompany, setMyCompany] = useState(null);
  const [targetCompanies, setTargetCompanies] = useState([]);
  const [openSlot, setOpenSlot] = useState(null);
  const [hasSelectedMyCompany, setHasSelectedMyCompany] = useState(false);

  const isTargetFull = targetCompanies.length >= MAX_TARGET_COMPANIES;
  const isCompareReady = Boolean(myCompany && targetCompanies.length > 0);

  const handleOpenModal = (slot) => {
    setOpenSlot(slot);
  };

  const handleCloseModal = () => {
    setOpenSlot(null);
  };

  const handleSelectCompany = (company) => {
    setMyCompany(company);
    setHasSelectedMyCompany(true);
  };

  const handleSelectTargetCompanies = (companies) => {
    setTargetCompanies((prev) => {
      const merged = [...prev];
      companies.forEach((company) => {
        if (!merged.some((item) => item.id === company.id)) {
          merged.push(company);
        }
      });
      return merged.slice(0, MAX_TARGET_COMPANIES);
    });
  };

  const handleCompare = async () => {
    if (!isCompareReady) return;

    try {
      await axios.post(`/api/compare`, {
        myCompanyIds: [myCompany.id], // 단일이라도 배열로 감싸야 함
        compareCompanyIds: targetCompanies.map((company) => company.id), // 배열 그대로 전달
      });

      localStorage.setItem(
        LAST_COMPARE_SESSION_KEY,
        JSON.stringify({
          myCompanyId: myCompany.id,
          compareCompanyIds: targetCompanies.map((company) => company.id),
        })
      );

      navigate("/compare-result", { state: { myCompany, targetCompanies } });
    } catch (error) {
      console.error("기업 비교 실행 실패:", error);
    }
  };


  const handleCancelMyCompany = (event) => {
    event.stopPropagation();
    setMyCompany(null);
  };

  const handleCancelTargetCompany = (event, id) => {
    event.stopPropagation();
    setTargetCompanies((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetAll = () => {
    setMyCompany(null);
    setTargetCompanies([]);
  };

  return (
    <>
      <div className="content_wrap my_company_compare_wrap">
        {/*수정 제안*/}
        {/*my_company_compare_title에서 모든 페이지에서 사용중인 section.css의 section_head 활용*/}
        <div className="section_head">
          {/*page_title > section_title*/}
          <h2 className="section_title">나의 기업을 선택해 주세요!</h2>
          {myCompany && (
            <Button
              size="small"
              variant="primary"
              selected
              showResetIcon
              onClick={handleResetAll}
            >
              전체 초기화
            </Button>
          )}
        </div>

        <div
          className="company_slot"
          onClick={() => handleOpenModal(SLOT.MY)}
        >
          {myCompany ? (
            <>
              <div className="company_slot_cancel">
                <Button
                  size="small"
                  variant="outline"
                  onClick={handleCancelMyCompany}
                >
                  선택 취소
                </Button>
              </div>
              <div className="company_slot_selected">
                <img
                  src={"/src/assets/images/company-logo-" + myCompany.id + ".webp"}
                  alt={myCompany.name}
                  onError={(e) => { e.currentTarget.src = DefaultLogo }}
                />
                <p>{myCompany.name}</p>
                <span>{myCompany.category}</span>
              </div>
            </>
          ) : (
            <div className="company_slot_empty">
              <span className="plus_icon">+</span>
              <p>기업 추가</p>
            </div>
          )}
        </div>

        {(myCompany || hasSelectedMyCompany) && (
          <>
            <div className="section_head">
              <h2 className="section_title">
                어떤 기업이 궁금하세요? <span>(최대 {MAX_TARGET_COMPANIES}개)</span>
              </h2>
              <Button
                size="small"
                variant="primary"
                selected
                disabled={isTargetFull}
                showResetIcon
                onClick={() => handleOpenModal(SLOT.TARGET)}
              >
                기업 추가하기
              </Button>
            </div>

            <div className="company_slot company_slot_multi">
              {targetCompanies.length > 0 ? (
                targetCompanies.map((company) => (
                  <div className="company_slot_selected" key={company.id}>
                    <button
                      type="button"
                      className="company_slot_remove"
                      onClick={(event) =>
                        handleCancelTargetCompany(event, company.id)
                      }
                      aria-label="선택 취소"
                    >
                      -
                    </button>
                    <img
                      src={"/src/assets/images/company-logo-" + company.id + ".webp"}
                      alt={company.name}
                      onError={(e) => { e.currentTarget.src = DefaultLogo }}
                    />
                    <p>{company.name}</p>
                    <span>{company.category}</span>
                  </div>
                ))
              ) : (
                <p
                  className="company_slot_placeholder"
                  onClick={() => handleOpenModal(SLOT.TARGET)}
                >
                  아직 추가한 기업이 없어요.
                  <br />
                  버튼을 눌러 기업을 추가해보세요
                </p>
              )}
            </div>
          </>
        )}

        <Button
          size="large"
          variant="primary"
          selected={isCompareReady}
          disabled={!isCompareReady}
          onClick={handleCompare}
        >
          기업 비교하기
        </Button>
      </div>

      {openSlot === SLOT.MY && (
        <ModalCompanySelect
          onClose={handleCloseModal}
          onSelectCompany={handleSelectCompany}
        />
      )}

      {openSlot === SLOT.TARGET && (
        <ModalCompanySelect
          multiple
          selectedCompanies={targetCompanies}
          maxSelectable={MAX_TARGET_COMPANIES}
          excludedIds={myCompany ? [myCompany.id] : []}
          onClose={handleCloseModal}
          onSelectCompanies={handleSelectTargetCompanies}
        />
      )}
    </>
  );
}



export default MyCompanyCompare;
