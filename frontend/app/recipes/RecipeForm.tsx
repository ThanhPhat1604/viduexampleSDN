"use client";

import { useEffect, useState } from "react";
import { Recipe, RecipePayload } from "@/types/recipe";

interface Props {
  initial?: Recipe | null;
  onSubmit: (payload: RecipePayload) => Promise<void> | void;
  submitLabel?: string;
}

export default function RecipeForm({ initial = null, onSubmit, submitLabel = "Save" }: Props) {
  const [form, setForm] = useState({
    title: "",
    ingredientsText: "", 
    tagsText: "",
    image: "",
  });

  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Popular tags suggestions
  const popularTags = ["Vegan", "Quick", "Easy", "Healthy", "Dessert", "Spicy", "Vegetarian", "Gluten-free"];

  useEffect(() => {
    if (initial) {
      const newForm = {
        title: initial.title || "",
        ingredientsText: Array.isArray(initial.ingredients)
          ? initial.ingredients.join("\n")
          : "",
        tagsText: Array.isArray(initial.tags) ? initial.tags.join(", ") : "",
        image: initial.image || "",
      };
      setForm(newForm);
      if (initial.image) {
        setImagePreview(initial.image);
      }
    }
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Update image preview
    if (name === "image" && value.trim()) {
      setImagePreview(value.trim());
    } else if (name === "image") {
      setImagePreview(null);
    }
  };

  const addTag = (tag: string) => {
    const currentTags = form.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(", ");
      setForm((prev) => ({ ...prev, tagsText: newTags }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    
    const newTags = currentTags.filter((t) => t !== tagToRemove).join(", ");
    setForm((prev) => ({ ...prev, tagsText: newTags }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!form.ingredientsText.trim()) {
      newErrors.ingredientsText = "Nguyên liệu là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      const payload: RecipePayload = {
        title: form.title.trim(),
        ingredients: form.ingredientsText
          .split("\n")
          .map((i) => i.trim())
          .filter(Boolean),
        tags: form.tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image: form.image.trim() || undefined,
      };

      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  };

  const currentTags = form.tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const ingredientCount = form.ingredientsText
    .split("\n")
    .filter((i) => i.trim()).length;

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-8 py-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {initial ? "Chỉnh sửa công thức" : "Thêm công thức mới"}
        </h2>
        <p className="text-purple-100 mt-1">
          {initial ? "Cập nhật thông tin công thức của bạn" : "Chia sẻ công thức yêu thích của bạn với mọi người"}
        </p>
      </div>

      <form onSubmit={submit} className="p-8 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tên công thức *
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ví dụ: Spaghetti Carbonara"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none ${
              errors.title ? "border-red-500" : "border-gray-200"
            }`}
            required
          />
          {errors.title && (
            <p className="text-red-600 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.title}
            </p>
          )}
        </div>

        {/* Ingredients */}
        <div className="space-y-2">
          <label htmlFor="ingredientsText" className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Nguyên liệu *
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {ingredientCount} nguyên liệu
            </span>
          </label>
          <textarea
            id="ingredientsText"
            name="ingredientsText"
            value={form.ingredientsText}
            onChange={handleChange}
            placeholder="Mỗi nguyên liệu một dòng&#10;Ví dụ:&#10;200g spaghetti&#10;100g bacon&#10;2 quả trứng&#10;50g phô mai parmesan"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none ${
              errors.ingredientsText ? "border-red-500" : "border-gray-200"
            }`}
            rows={6}
            required
          />
          {errors.ingredientsText && (
            <p className="text-red-600 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.ingredientsText}
            </p>
          )}
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Nhập mỗi nguyên liệu trên một dòng riêng
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label htmlFor="tagsText" className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tags
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {currentTags.length} tags
            </span>
          </label>

          {/* Selected tags display */}
          {currentTags.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
              {currentTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full shadow-md group"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          <input
            id="tagsText"
            name="tagsText"
            value={form.tagsText}
            onChange={handleChange}
            placeholder="Phân cách bằng dấu phẩy: Vegan, Quick, Easy"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
          />

          {/* Popular tags suggestions */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">Gợi ý tags phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  disabled={currentTags.includes(tag)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    currentTags.includes(tag)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-105"
                  }`}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image URL with Preview */}
        <div className="space-y-3">
          <label htmlFor="image" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Hình ảnh món ăn (Tùy chọn)
          </label>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input area */}
            <div className="space-y-2">
              <input
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/delicious-food.jpg"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Dán link URL hình ảnh vào đây
              </p>

              {/* Example URLs (optional helper) */}
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Nguồn hình ảnh miễn phí:
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Unsplash.com - Hình ảnh chất lượng cao</li>
                  <li>• Pexels.com - Miễn phí bản quyền</li>
                  <li>• Pixabay.com - Kho ảnh đa dạng</li>
                </ul>
              </div>
            </div>

            {/* Preview area */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Xem trước hình ảnh:
              </p>
              <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 border-2 border-dashed border-purple-300 shadow-inner">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setImagePreview(null);
                        alert("❌ Không thể tải hình ảnh. Vui lòng kiểm tra URL!");
                      }}
                    />
                    {/* Overlay with remove button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, image: "" }));
                          setImagePreview(null);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xóa hình
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-purple-700 font-semibold mb-1">
                      Chưa có hình ảnh
                    </p>
                    <p className="text-sm text-purple-600">
                      Dán URL hình ảnh để xem trước
                    </p>
                    <div className="mt-3 text-xs text-purple-500">
                      📸 Hình ảnh sẽ hiển thị ở đây
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{submitLabel}</span>
              </>
            )}
          </button>
        </div>

        {/* Info box */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">💡 Mẹo:</p>
              <ul className="space-y-1 text-xs">
                <li>• Viết tên công thức ngắn gọn và dễ nhớ</li>
                <li>• Liệt kê đầy đủ nguyên liệu kèm định lượng</li>
                <li>• Thêm tags để người khác dễ tìm kiếm</li>
                <li>• Sử dụng hình ảnh chất lượng cao</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}