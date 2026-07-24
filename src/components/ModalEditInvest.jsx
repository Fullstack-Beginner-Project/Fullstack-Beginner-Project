import { useRef, useState } from "react";

import Modal from "../components/Modal";
import Button from "../components/Button";
import Input from "../components/Input";
import "../assets/css/modalInput.css";
import "../assets/css/modalInvest.css";
import DefaultLogo from '../assets/images/logo_default.png';
import LogoImg from "./LogoImg";

function ModalEditInvest({
  company,
  initialData,
  onClose,
  onInvest,
}) {
  const submittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    id: initialData.id,
    companyId: initialData.companyId,
    investorName: initialData.investorName,
    amount: Number(initialData.amount),
    comment: initialData.comment,
    password: '',
  });

  const handleValueChange = (key) => (value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current) {
      return
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try{
      await onInvest(form);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="투자 수정하기"
      onClose={onClose}
      footer={
        <div className="modal_footer_btns">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>

          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "수정하기"}
          </Button>
        </div>
      }
    >
      {/* 투자 기업 정보 */}
      <form id="investment_edit_form" onSubmit={handleSubmit}>
        <div className="invest_company_info">
          <p>투자 기업 정보</p>

          <div className="invest_company">
            <div className="img_logo_wrap">
              <LogoImg cId={company.id} cNm={company.name} />
            </div>

            <div>
              <p>{company.name}</p>
              <span>{company.category}</span>
            </div>
          </div>
        </div>

        <div className="modal_input">
          <label>투자자 이름</label>
          <Input
            type="text"
            initialValue={form.investorName}
            placeholder="투자자 이름을 입력해 주세요"
            onValueChange={handleValueChange('investorName')}
          />
        </div>

        <div className="modal_input">
          <label>투자 금액</label>
          <Input
            type="number"
            initialValue={form.amount}
            placeholder="투자 금액을 입력해 주세요"
            onValueChange={handleValueChange('amount')}
            onKeyDown={(e) =>
            ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
          }
          />
        </div>

        <div className="modal_input">
          <label>투자 코멘트</label>
          <textarea
            className="invest_comment"
            placeholder="투자에 대한 코멘트를 입력해 주세요"
            value={form.comment}
            onChange={(e) => handleValueChange('comment')(e.target.value)}
          />
        </div>

        <div className="modal_input">
          <label>비밀번호</label>
          <Input
            type="password"
            initialValue={form.password}
            placeholder="비밀번호를 입력해주세요"
            onValueChange={handleValueChange('password')}
          />
        </div>
      </form>
    </Modal>
  );
}

export default ModalEditInvest;