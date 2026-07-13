import Modal from '../components/Modal';
import Button from './Button';
import '../assets/css/ModalConfirm.css';

function ModalConfirm({
  onClose,
}) {
    // 코드 재사용을 위해 추후 props를 활용해 직접적인 텍스트는 지양
  return (
    <Modal
      footer={
          <div className="modal_footer_btns">
            <Button variant="secondary" onClose={onClose}>
              취소
            </Button>

            <Button>
              확인
            </Button>
        </div>
      }
    >
      <p className="modal_desc">
        팝업 내용이 들어갑니다.
      </p>
    </Modal>
  );
}

export default ModalConfirm;