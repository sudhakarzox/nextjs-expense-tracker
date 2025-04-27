import CategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";
import PageWrapper from "@/components/Wrapper/PageWrapper";

export default function CategoriesPage() {
  return (
    <PageWrapper>
      <CategoryForm />
      <CategoryList />
    </PageWrapper>
  );
}
