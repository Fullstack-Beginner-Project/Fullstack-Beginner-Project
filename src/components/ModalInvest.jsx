import Modal from '../components/Modal';
import Input from './Input';
import DefaultLogo from '../assets/images/logo_default.png';

function ModalInvest({
    onClose,
}) {
  return (
    <Modal
      title='기업에 투자하기'
      onClose={onClose}
      footer={
        <>
          <Button>취소</Button>
          <Button>투자하기</Button>
        </>
      }
    >
      {/* 투자 기업 정보 */}
      <div className='invest_company_info'>
        <p>투자 기업 정보</p>
        <div className='invest_company'>
          <img src={logo ?? DefaultLogo} alt={name} />  
          <p>{name}</p>
          <p>{category}</p>
        </div>
      </div>

      {/* 투자 인풋 */}

    </Modal>
  )
}

export default ModalInvest
