import PageWrapper from "@/components/Wrapper/PageWrapper";
import TransactionForm from "@/components/TransactionForm";
import { cookies } from "next/headers";

export default async function EditTransactionPage({ params }:  { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore =await cookies();
  // Fetch transaction data from API
  const res = await fetch(`${process.env.NEXTAUTH_URL || ""}/api/transactions/${id}`, {
    cache: "no-store",
    headers: { cookie: cookieStore.toString() },
  });
  const data = await res.json();
  const transaction = data.data;

  if (!transaction) {
    return (
      <PageWrapper>
        <div className="text-center py-10">Transaction not found.</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TransactionForm transaction={transaction} />
    </PageWrapper>
  );
}

