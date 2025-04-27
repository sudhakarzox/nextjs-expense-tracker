import React from "react";

type SelectWrapperProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
};

export default function SelectWrapper({
  label,
  value,
  onChange,
  options,
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
        className="w-full border p-2 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-white-500"
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