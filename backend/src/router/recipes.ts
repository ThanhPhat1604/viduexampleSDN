import { Router, Request, Response } from "express";
import { supabase } from "../supabaseClient";
import { Recipe } from "../types";

const router = Router();

/**
 * ✅ Lấy tất cả recipes
 */
router.get("/", async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("recipes").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * ✅ Lấy 1 recipe theo ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Recipe not found" });
  res.json(data);
});

/**
 * ✅ Tạo mới recipe
 */
router.post("/", async (req: Request, res: Response) => {
  const { title, ingredients, tags, image }: Recipe = req.body;

  if (!title || !ingredients) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert([{ title, ingredients, tags, image }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * ✅ Cập nhật recipe theo ID
 */
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, ingredients, tags, image }: Recipe = req.body;

  // Kiểm tra nếu không có dữ liệu gửi lên
  if (!title && !ingredients && !tags && !image) {
    return res.status(400).json({ error: "No update data provided" });
  }

  const { data, error } = await supabase
    .from("recipes")
    .update({ title, ingredients, tags, image })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * ✅ Xoá recipe theo ID
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Recipe deleted successfully" });
});

export default router;
