import React from "react";

type FormWrapperProps = {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string; // Optional additional classes
};

export default function FormWrapper({
  title,
  children,
  onSubmit,
  className = "",
}: FormWrapperProps) {
  return (
    <form
      onSubmit={onSubmit}
      // className={`p-4 max-w-md mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-500 rounded-xl shadow-md space-y-4 ${className}`}

      className={`p-1 max-w-md mx-auto  rounded-xl  space-y-4 ${className}`}
>
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </form>
  );
}