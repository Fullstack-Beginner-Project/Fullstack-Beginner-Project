import { useState } from "react";

import Button from "../components/Button";
import ModalCompanySelect from "../components/ModalCompanySelect";
import DefaultLogo from "../assets/images/logo_default.png";
import "../assets/css/myCompanyCompare.css";


// 어떤 슬롯을 채우는 중인지 구분하기 위한 값
const SLOT = {
  MY: "my",
  TARGET: "target",
};

function MyCompanyCompare() {
  const [myCompany, setMyCompany] = useState(null);
  const [targetCompany, setTargetCompany] = useState(null);
  const [openSlot, setOpenSlot] = useState(null);

  const isCompareReady = Boolean(myCompany && targetCompany);

  const handleOpenModal = (slot) => {
    setOpenSlot(slot);
  };

  const handleCloseModal = () => {
    setOpenSlot(null);
  };

  const handleSelectCompany = (company) => {
    if (openSlot === SLOT.MY) {
      setMyCompany(company);
    } else if (openSlot === SLOT.TARGET) {
      setTargetCompany(company);
    }
  };

  const handleCompare = () => {
    if (!isCompareReady) return;
    // TODO: 비교 현황 페이지로 이동 또는 비교 결과 반영
  };

  return (
    <>
      <div className="content_wrap my_company_compare_wrap">
        <h2 className="page_title">나의 기업을 선택해 주세요!</h2>

        <div
          className="company_slot"
          onClick={() => handleOpenModal(SLOT.MY)}
        >
          {myCompany ? (
            <div className="company_slot_selected">
              <img
                src={myCompany.logo ?? DefaultLogo}
                alt={myCompany.name}
              />
              <p>{myCompany.name}</p>
              <span>{myCompany.category}</span>
            </div>
          ) : (
            <div className="company_slot_empty">
              <span className="plus_icon">+</span>
              <p>기업 추가</p>
            </div>
          )}
        </div>

        <div className="company_slot_header">
          <h3>어떤 기업이 궁금하세요?</h3>
          <Button
            size="small"
            variant="primary"
            onClick={() => handleOpenModal(SLOT.TARGET)}
          >
            기업 추가하기
          </Button>
        </div>

        <div
          className="company_slot"
          onClick={() => handleOpenModal(SLOT.TARGET)}
        >
          {targetCompany ? (
            <div className="company_slot_selected">
              <img
                src={targetCompany.logo ?? DefaultLogo}
                alt={targetCompany.name}
              />
              <p>{targetCompany.name}</p>
              <span>{targetCompany.category}</span>
            </div>
          ) : (
            <p className="company_slot_placeholder">
              아직 추가한 기업이 없어요.
              <br />
              버튼을 눌러 기업을 추가해보세요
            </p>
          )}
        </div>

        <Button
          size="large"
          variant="primary"
          disabled={!isCompareReady}
          onClick={handleCompare}
        >
          기업 비교하기
        </Button>
      </div>

      {openSlot && (
        <ModalCompanySelect
          onClose={handleCloseModal}
          onSelectCompany={handleSelectCompany}
        />
      )}
    </>
  );
}



export default MyCompanyCompare;
