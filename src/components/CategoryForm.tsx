"use client";

import { useState } from "react";
import FormWrapper from "@/components/Wrapper/FormWrapper";
import InputWrapper from "@/components/Wrapper/InputWrapper";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }), // Only send the name field
      });

      if (res.ok) {
        setMessage("Category added successfully!");
        setName("");
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || "Failed to add category");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormWrapper title="Add Category" onSubmit={handleSubmit}>
      <InputWrapper
        label="Category Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Add Category"}
      </button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </FormWrapper>
  );
}