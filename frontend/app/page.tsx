"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Recipe } from "@/types/recipe";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:4000/recipes")
      .then((res) => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError("Không thể tải danh sách công thức. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(recipes.flatMap((r) => r.tags || []))
  );

  // Filter and sort recipes
  const filteredRecipes = recipes
    .filter((r) => {
      const matchesSearch = r.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? r.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (!sortOrder) return 0;
      if (sortOrder === "asc") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold mb-4">🍳 Recipe Collection</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Khám phá và chia sẻ những công thức nấu ăn tuyệt vời
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm công thức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? null : "asc")}
                className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  sortOrder === "asc"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                A-Z
              </button>
              <button
                onClick={() => setSortOrder(sortOrder === "desc" ? null : "desc")}
                className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  sortOrder === "desc"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Z-A
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-gray-700">Lọc theo tag:</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTag === null
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedTag === tag
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Hiển thị <span className="font-semibold text-gray-900">{filteredRecipes.length}</span> công thức
            {selectedTag && (
              <span className="ml-1">
                với tag <span className="font-semibold text-orange-600">"{selectedTag}"</span>
              </span>
            )}
          </p>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm công thức mới
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Đang tải công thức...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Lỗi tải dữ liệu</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRecipes.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công thức nào</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedTag
                ? "Thử điều chỉnh bộ lọc của bạn"
                : "Hãy là người đầu tiên thêm công thức!"}
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm công thức đầu tiên
            </Link>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((r) => (
              <Link
                key={r.id}
                href={`/auth/login`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {r.title}
                  </h2>

                  {/* Tags */}
                  {r.tags && r.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {r.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {r.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{r.tags.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full mb-3">
                      Chưa có tag
                    </span>
                  )}

                  {/* View button */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Xem chi tiết</span>
                    <svg
                      className="w-5 h-5 text-orange-500 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="font-medium">© 2024 Recipe App. Made with ❤️ for food lovers.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}