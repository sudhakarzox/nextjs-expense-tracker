import DebtorForm from "@/components/DebtorForm";
import DebtorList from "@/components/DebtorList";


export default function DebtorsPage() {
  return (
    <div className="min-h-full rounded bg-gray-100 p-3">
      <DebtorForm />
      <DebtorList />
    </div>
  );
}
