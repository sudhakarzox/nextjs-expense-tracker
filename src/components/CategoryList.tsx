"use client";

import { useEffect, useState } from "react";
import ListWrapper from "./Wrapper/ListWrapper"; // Import ListWrapper

type Category = {
  _id: string;
  name: string;
};

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        if (data.success) {
          setCategories(data.data); // Use the `data` field from the API response
        } else {
          console.error("Failed to load categories:", data.error);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <ListWrapper
      title="Categories"
      items={categories}
      loading={loading}
      emptyMessage="No categories found."
      renderItem={(category) => (
        <li key={category._id} className="p-2 dark:bg-gray-700 rounded">
          <span>{category.name}</span>
        </li>
      )}
    />
  );
}