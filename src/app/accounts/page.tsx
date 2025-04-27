import AccountForm from "@/components/AccountForm";
import AccountList from "@/components/AccountList";
import PageWrapper from "@/components/Wrapper/PageWrapper";


export default function AccountsPage() {
  return (
    <PageWrapper>
      <AccountForm />
      <AccountList />
    </PageWrapper>
  );
}
