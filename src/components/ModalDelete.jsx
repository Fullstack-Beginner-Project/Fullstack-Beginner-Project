import { useState } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
// 인풋 import 예정

function ModalDelete({
  onClose,
  onDelete,
}) {
  const [password, setPassword] = useState('');

  return (
    <Modal
      title='삭제 권한 인증'
      onClose={onClose}
      footer={
        <Button onClick={() => onDelete(password)}>
          삭제하기
        </Button>
      }
    >
      <div className='password_input'>
        <p>비밀번호</p>  
        <input type='password' placeholder='패스워드를 입력해주세요'/>
      </div>

    </Modal>
  );
}

export default ModalDelete;