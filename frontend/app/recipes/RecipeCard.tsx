// frontend/app/recipes/RecipeCard.tsx
"use client";

import Link from "next/link";
import { Recipe } from "@/types/recipe";

interface Props {
  recipe: Recipe;
  onEdit: (r: Recipe) => void;
  onDelete: (id: string) => void;
}

export default function RecipeCard({ recipe, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      {recipe.image ? (
        <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover rounded mb-3" />
      ) : (
        <div className="w-full h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">No image</div>
      )}
      <h3 className="text-lg font-semibold">{recipe.title}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recipe.ingredients}</p>
      <div className="mt-auto flex items-center justify-between gap-2">
        <Link href={`/recipes/${recipe.id}`} className="text-sm text-blue-600 hover:underline">View</Link>
        <div className="flex gap-2">
          <button onClick={() => onEdit(recipe)} className="px-3 py-1 bg-yellow-500 rounded text-white text-sm">Edit</button>
          <button onClick={() => onDelete(recipe.id)} className="px-3 py-1 bg-red-500 rounded text-white text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}
