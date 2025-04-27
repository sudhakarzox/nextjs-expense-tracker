import React from "react";

type ListWrapperProps = {
  title: string;
  items: { _id: string; name: string }[];
  loading: boolean;
  renderItem: (item: { _id: string; name: string; }) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
};

export default function ListWrapper({
  title,
  items,
  loading,
  renderItem,
  emptyMessage = "No items found.",
  className = "",
}: ListWrapperProps) {
  return (
    <div className={`mt-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">{items.map(renderItem)}</ul>
      )}
    </div>
  );
}