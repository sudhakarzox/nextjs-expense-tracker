import React from "react";

type PageWrapperProps = {
  children: React.ReactNode;
  className?: string; // Optional additional classes
};

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <div
      className={`min-h-full rounded-lg dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4 border border-gray-600 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}