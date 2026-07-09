import '../assets/css/button.css';



function Button({
  size = 'medium',
  variant = 'primary',
  selected = false,
  disabled = false,
  onClick,
  children,
}) {

  const className = [
    'btn',
    `btn_${size}`,
    `btn_${variant}`,
    selected ? 'is-selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const onButtonClick = (event) => {
    if (disabled) return;
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
        {children}
      </button>
    </div>
  );
}



export default Button;