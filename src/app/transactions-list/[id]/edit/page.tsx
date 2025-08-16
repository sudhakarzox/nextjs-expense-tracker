import PageWrapper from "@/components/Wrapper/PageWrapper";
import TransactionForm from "@/components/TransactionForm";

export default async function EditTransactionPage({ params }:  { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Fetch transaction data from API
  const res = await fetch(`${process.env.NEXTAUTH_URL || ""}/api/transactions/${id}`, {
    cache: "no-store",
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