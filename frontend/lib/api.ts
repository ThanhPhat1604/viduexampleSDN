// frontend/lib/api.ts
import axios from "axios";
import { RecipePayload, Recipe } from "@/types/recipe";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", // backend URL
  timeout: 5000,
});

// 🧩 Fetch toàn bộ danh sách recipes
export const getRecipes = async (): Promise<Recipe[]> => {
  const res = await API.get<Recipe[]>("/recipes");
  return res.data;
};

// 🧩 Fetch chi tiết một recipe theo id
export const getRecipe = async (id: string): Promise<Recipe> => {
  const res = await API.get<Recipe>(`/recipes/${id}`);
  return res.data;
};

// 🧩 Tạo mới recipe
export const createRecipe = async (payload: RecipePayload): Promise<Recipe> => {
  const res = await API.post<Recipe>("/recipes", payload);
  return res.data;
};

// 🧩 Cập nhật recipe
export const updateRecipe = async (
  id: string,
  payload: Partial<RecipePayload>
): Promise<Recipe> => {
  const res = await API.put<Recipe>(`/recipes/${id}`, payload);
  return res.data;
};

// 🧩 Xóa recipe
export const deleteRecipe = async (id: string): Promise<{ success: boolean }> => {
  const res = await API.delete<{ success: boolean }>(`/recipes/${id}`);
  return res.data;
};
