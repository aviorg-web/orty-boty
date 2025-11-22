import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-full font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-blue-500 hover:bg-blue-600 text-white shadow-md focus:ring-blue-400';
      break;
    case 'secondary':
      variantStyles = 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md focus:ring-indigo-400';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:ring-blue-400';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;