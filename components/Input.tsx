import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  // We keep base styles minimal so they can be overridden easily by the parent
  const baseStyles = 'w-full p-3 rounded-lg focus:outline-none transition-colors';
  
  // Default border styles only if NOT overridden by className (check for border-none)
  const defaultBorder = className?.includes('border-none') ? '' : 'border border-gray-300 focus:ring-2 focus:ring-blue-400';

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={props.id} className="mb-2 text-gray-700 font-medium text-sm">
          {label}
        </label>
      )}
      <input
        className={`${baseStyles} ${defaultBorder} ${className || ''}`}
        {...props}
      />
    </div>
  );
};

export default Input;