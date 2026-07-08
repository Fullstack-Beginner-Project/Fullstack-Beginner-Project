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
    `btn--${size}`,
    `btn--${variant}`,
    selected ? 'is-selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const onButtonClick = (event) => {
    if (disabled) return;
    if (onClick) onClick(event);
  };

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onButtonClick}
    >
      {children}
    </button>
  );
}



export default Button;