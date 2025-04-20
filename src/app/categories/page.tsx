import CategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen rounded bg-gray-100 p-3">
      <CategoryForm />
      <CategoryList />
    </div>
  );
}
