import SimpleNameForm from "./SimpleForm";

export default function DebtorForm() {
  return (
    <SimpleNameForm
      apiEndpoint="/api/debtors"
      successMessage="Debtor added successfully!"
      placeholder="Enter debtor name"
      buttonText="Add Debtor"
      title="Debtor Form"
    />
  );
}
