"use client";

import { useState } from "react";

import FormWrapper from "@/components/Wrapper/FormWrapper";
import InputWrapper from "@/components/Wrapper/InputWrapper";
import Button from "./Wrapper/Button";

interface SimpleNameFormProps {
  apiEndpoint: string;
  successMessage: string;
  placeholder: string;
  buttonText: string;
  title: string;
}

export default function SimpleNameForm({
  apiEndpoint,
  successMessage,
  placeholder,
  buttonText,
  title,
}: SimpleNameFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage(successMessage);
        setName("");
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || "Failed to submit");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormWrapper title={title} onSubmit={handleSubmit}>
      <InputWrapper
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          label={`${title.split(" ").at(0)} Name`}
          required
          disabled={loading}
        />

      <Button type="submit" loading={loading}>
        {buttonText}
      </Button>

      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </FormWrapper>
  );
}
