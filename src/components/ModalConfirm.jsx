import Modal from "../components/Modal";
import Button from "./Button";
import "../assets/css/ModalConfirm.css";

function ModalConfirm({
  message,
  onClose,
}) {
    // 코드 재사용을 위해 props를 활용해 직접적인 텍스트는 지양
  return (
    <Modal
      footer={
          <div className="modal_footer_btns">

            <Button 
              size="medium"
              onClick={onClose}>
              확인
            </Button>
        </div>
      }
    >
      <p className="modal_desc">
        {message}
      </p>
    </Modal>
  );
}

export default ModalConfirm;