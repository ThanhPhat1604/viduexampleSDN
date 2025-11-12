// frontend/lib/api.ts
import axios from "axios";
import { RecipePayload, Recipe } from "@/types/recipe";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", // backend của bạn
  timeout: 5000,
});

export const getRecipes = async (): Promise<Recipe[]> => {
  const res = await API.get("/recipes");
  return res.data;
};

export const getRecipe = async (id: string): Promise<Recipe> => {
  const res = await API.get(`/recipes/${id}`);
  return res.data;
};

export const createRecipe = async (payload: RecipePayload): Promise<Recipe> => {
  const res = await API.post("/recipes", payload);
  return res.data;
};

export const updateRecipe = async (id: string, payload: Partial<RecipePayload>) => {
  const res = await API.put(`/recipes/${id}`, payload);
  return res.data;
};

export const deleteRecipe = async (id: string) => {
  const res = await API.delete(`/recipes/${id}`);
  return res.data;
};
