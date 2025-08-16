import SimpleNameForm from "./SimpleForm";

export default function CategoryForm() {
  return (
    <SimpleNameForm
      apiEndpoint="/api/categories"
      successMessage="Category added successfully!"
      placeholder="Enter category name"
      buttonText="Add Category"
      title="Category Form"
    />
  );
}
