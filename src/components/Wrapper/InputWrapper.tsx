import React from "react";

type InputWrapperProps = {
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string; // Optional additional classes
};

export default function InputWrapper({
  label,
  type,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  required = false,
  className = "",
}: InputWrapperProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`"block w-full border p-2 rounded focus:outline-none focus:ring-2  focus:ring-white-500"
          ${disabled ? "bg-gray-800 text-gray-500 cursor-not-allowed" : ""}`}
          
      />
    </div>
  );
}