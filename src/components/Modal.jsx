import ModalClose from '../assets/images/icon_delete.png';

function Modal({
    title,
    children,
    footer,
    onClose,
}) {

  return (
    <div className="wrap">
      // 모달 레이아웃
      <div className='modal_wrap'>
        <div className='modal'>

          {/* 모달 상단 */}
          <div className='modal_top'>
            {/* 제목이 있는 경우와 없는 경우를 고려 */}
            {title && <h3>{title}</h3>}
            <button onClick={onClose}>
                <img src={ ModalClose } alt='모달창 닫기' />
            </button>
          </div>

          {/* 모달 콘텐츠 */}
          <div className='modal_content'>
            {children}
          </div>

          {/* 모달 하단 */}
          {/* 버튼이 있는 경우와 페이지네이션이 있는 경우를 고려 */}
          { footer && (
            <div className='modal_footer'>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal;
