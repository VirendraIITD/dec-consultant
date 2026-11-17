import { Link } from 'react-router-dom';

function Button({ 
  children, 
  to, 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '',
  fullWidth = false,
  isSmall = false,
  rounded = 'rounded-lg'
}) {
  
  const baseClasses = `
    btn-laser
    relative bg-navy overflow-hidden
    inline-flex items-center justify-center 
    text-white font-bold tracking-wide
    ${fullWidth ? 'w-full' : ''} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${isSmall ? 'px-4 py-1.5 text-xs' : 'px-8 py-2.5 text-sm'}
    ${rounded} 
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={baseClasses}
    >
      {children}
    </button>
  );
}

export default Button;