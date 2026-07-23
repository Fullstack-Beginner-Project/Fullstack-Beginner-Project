import { useState } from "react";

import Modal from "../components/Modal";
import Button from "../components/Button";
import Input from "../components/Input";
import "../assets/css/modalInput.css";

function ModalDelete({
  onClose,
  onDelete,
}) {
  const [password, setPassword] = useState('');

  return (
    <Modal
      title="삭제 권한 인증"
      onClose={onClose}
      footer={
        <div className="modal_footer_btns">
          <Button onClick={() => onDelete(password)}>
            삭제하기
          </Button>
        </div>
      }
    >
      <div className="modal_input">
        <label>비밀번호</label>  
        <Input type="password" 
               placeholder="패스워드를 입력해주세요"
               onValueChange={setPassword}/>
      </div>

    </Modal>
  );
}

export default ModalDelete;