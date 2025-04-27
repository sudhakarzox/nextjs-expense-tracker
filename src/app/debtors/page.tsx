import DebtorForm from "@/components/DebtorForm";
import DebtorList from "@/components/DebtorList";
import PageWrapper from "@/components/Wrapper/PageWrapper";


export default function DebtorsPage() {
  return (
    <PageWrapper>
      <DebtorForm />
      <DebtorList />
    </PageWrapper>
  );
}
