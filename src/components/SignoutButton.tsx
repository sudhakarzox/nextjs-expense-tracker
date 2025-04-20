'use client';

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-gray-500  px-4 py-2 rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}
