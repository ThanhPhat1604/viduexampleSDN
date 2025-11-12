"use client";

import { useRouter } from "next/navigation";
import RecipeForm from "../RecipeForm";
import { RecipePayload } from "@/types/recipe";

export default function NewRecipePage() {
  const router = useRouter();

  const handleSubmit = async (payload: RecipePayload) => {
    const res = await fetch("http://localhost:4000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const created = await res.json();
      router.push(`/recipes/${created.id}`);
    } else {
      alert("Error creating recipe");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* <h1 className="text-3xl font-bold mb-4">Create New Recipe</h1> */}
      <RecipeForm onSubmit={handleSubmit} submitLabel="Create Recipe" />
    </div>
    
  );
}
