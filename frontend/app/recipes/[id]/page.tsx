"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Recipe } from "@/types/recipe";

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/recipes/${id}`);
        if (!res.ok) throw new Error("Recipe not found");
        const data = await res.json();
        setRecipe(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải công thức. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`http://localhost:4000/recipes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/recipes");
    } catch (err) {
      alert("Không thể xóa công thức. Vui lòng thử lại.");
      console.error(err);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải công thức...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công thức</h2>
          <p className="text-gray-600 mb-6">{error || "Công thức này không tồn tại hoặc đã bị xóa."}</p>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Back navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Main content card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero image */}
          <div className="relative h-96 bg-gradient-to-br from-blue-100 to-purple-100">
            {recipe.image ? (
              <>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-32 h-32 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Tags overlay on image */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                {recipe.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-700 text-sm font-semibold rounded-full shadow-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {recipe.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  {recipe.created_at 
                    ? new Date(recipe.created_at).toLocaleDateString('vi-VN')
                    : 'Không rõ ngày'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="font-medium">
                  {recipe.tags?.length || 0} tags
                </span>
              </div>
            </div>

            {/* Ingredients section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nguyên liệu</h2>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                {Array.isArray(recipe.ingredients) ? (
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-medium">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{recipe.ingredients}</p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <Link
                href={`/recipes/${id}/edit`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa công thức
              </button>
            </div>
          </div>
        </div>

        {/* Related actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Muốn chia sẻ công thức khác?</p>
          <Link
            href="/recipes/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm công thức mới
          </Link>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Xác nhận xóa?
            </h3>
            <p className="text-gray-600 text-center mb-8">
              Bạn có chắc chắn muốn xóa công thức <span className="font-semibold text-gray-900">"{recipe.title}"</span>? 
              Hành động này không thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xóa...
                  </>
                ) : (
                  'Xóa ngay'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}