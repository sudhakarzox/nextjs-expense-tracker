"use client";

import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
};

export default function CategoryList() {
  const [categories, setcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        if (data.success) {
          setcategories(data.data); // Use the `data` field from the API response
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
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Categories</h3>
      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat._id} className="border p-2 rounded bg-gray-50">
              <span>{cat.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}