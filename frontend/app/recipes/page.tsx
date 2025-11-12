"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "date" | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/recipes");
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách công thức. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
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
      if (sortOrder === "asc") return a.title.localeCompare(b.title);
      if (sortOrder === "desc") return b.title.localeCompare(a.title);
      if (sortOrder === "date") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
      return 0;
    });
    const paginatedRecipes = filteredRecipes.slice(
      (currentPage - 1) * limit,
      currentPage * limit
    );
    useEffect(() => {
      setTotalPages(Math.ceil(filteredRecipes.length / limit));
    }, [filteredRecipes, limit]);
    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm, selectedTag, sortOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Recipe Manager
              </h1>
              <p className="text-blue-100">Quản lý tất cả công thức nấu ăn của bạn</p>
            </div>
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
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
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
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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

            {/* Sort & View Mode */}
            <div className="flex gap-2">
              {/* Sort buttons */}
              <select
                value={sortOrder || ""}
                onChange={(e) => setSortOrder(e.target.value as any || null)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
              >
                <option value="">Sắp xếp</option>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
                <option value="date">Mới nhất</option>
              </select>

              {/* View mode toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-md text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Grid view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-md text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="List view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-gray-700">Tags:</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTag === null
                      ? "bg-blue-600 text-white shadow-md"
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
                        ? "bg-blue-600 text-white shadow-md"
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
            <span className="font-semibold text-gray-900">{filteredRecipes.length}</span> công thức
            {selectedTag && (
              <span className="ml-1">
                với tag <span className="font-semibold text-blue-600">"{selectedTag}"</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 rounded-md text-sm"
            >
              <option value={6}>6 món</option>
              <option value={9}>9 món</option>
              <option value={12}>12 món</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Đang tải...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRecipes.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công thức</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedTag
                ? "Thử điều chỉnh bộ lọc"
                : "Bắt đầu thêm công thức đầu tiên!"}
            </p>
          </div>
        )}

        {/* Grid View */}
        {!loading && !error && paginatedRecipes.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {recipe.title}
                  </h2>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {Array.isArray(recipe.ingredients)
                      ? recipe.ingredients.join(", ")
                      : recipe.ingredients}
                  </p>

                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {recipe.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{recipe.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* View button */}
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="flex items-center justify-between w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all group"
                  >
                    <span>Xem chi tiết</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && !error && filteredRecipes.length > 0 && viewMode === "list" && (
          <div className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {recipe.title}
                    </h2>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {Array.isArray(recipe.ingredients)
                        ? recipe.ingredients.join(", ")
                        : recipe.ingredients}
                    </p>

                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* View button */}
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all group"
                    >
                      <span>Xem chi tiết</span>
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filteredRecipes.length > limit && (
  <div className="mt-10">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i + 1}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i + 1);
              }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
)}

      </div>

  )}