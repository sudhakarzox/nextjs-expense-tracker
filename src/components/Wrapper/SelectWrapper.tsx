import React from "react";

type SelectWrapperProps = {
  label: string ;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function SelectWrapper({
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  className = "",
}: SelectWrapperProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`"block w-full border p-2 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-white-500"
          ${disabled ? "bg-gray-800 text-gray-500 cursor-not-allowed" : ""}`}
      >
        <option className="dark:bg-gray-700"  value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option className="dark:bg-gray-700" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}