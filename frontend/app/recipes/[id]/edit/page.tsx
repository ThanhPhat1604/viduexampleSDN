"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RecipeForm from "@/app/recipes/RecipeForm";
import { Recipe, RecipePayload } from "@/types/recipe";

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  // Lấy dữ liệu recipe hiện tại
  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`http://localhost:4000/recipes/${id}`);
      const data = await res.json();
      setRecipe(data);
    };
    fetchRecipe();
  }, [id]);

  // Gửi yêu cầu update
  const handleSubmit = async (payload: RecipePayload) => {
    await fetch(`http://localhost:4000/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    router.push(`/recipes/${id}`); // Quay lại trang chi tiết sau khi sửa
  };

  if (!recipe) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Recipe</h1>
      <RecipeForm
        initial={recipe}
        onSubmit={handleSubmit}
        submitLabel="Update Recipe"
      />
    </div>
  );
}
