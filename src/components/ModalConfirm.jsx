import Modal from '../components/Modal';
import Button from './Button';

function ModalConfirm() {
    // 코드 재사용을 위해 추후 props를 활용해 직접적인 텍스트는 지양
  return (
    <Modal
      footer={<Button>확인</Button>}
    >
      <p className="modal_desc">
        팝업 내용이 들어갑니다.
      </p>
    </Modal>
  );
}

export default ModalConfirm;