import '../assets/css/Button.css';



function Button({
  size = 'medium',
  variant = 'primary',
  selected = false,
  disabled = false,
  showResetIcon = false,
  onClick,
  children,
}) {

  // size, variant, selected 상태를 조합해서 클래스명 생성
  const className = [
    'btn',
    `btn_${size}`,
    `btn_${variant}`,
    selected ? 'is-selected' : '',
  ]
    .filter(Boolean) // 빈 문자열('is-selected' 아닐 때) 제거
    .join(' ');

  const onButtonClick = (event) => {
    if (disabled) return; // 비활성화 상태면 클릭 무시
    if (onClick) onClick(event);
  };

  return (
    <div className="btn_wrap">
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={onButtonClick}
      >
        {showResetIcon && <span className="btn_reset_icon" aria-hidden="true">↻</span>}
        {children}
      </button>
    </div>
  );
}



export default Button;