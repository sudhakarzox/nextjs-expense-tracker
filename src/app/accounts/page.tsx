import AccountForm from "@/components/AccountForm";
import AccountList from "@/components/AccountList";


export default function AccountsPage() {
  return (
    <div className="min-h-full rounded bg-gray-100 p-3">
      <AccountForm />
      <AccountList />
    </div>
  );
}
