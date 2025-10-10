import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parent?: string;
}

interface ApiResponse {
  success: boolean;
  pagination: {
    total: number;
    totalPages: number;
  };
  categories: Category[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchDebounced, setSearchDebounced] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch categories
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchCategories = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}admin/categories?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${searchDebounced}`,
          { signal, headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to load categories.");

        const data: ApiResponse = await res.json();
        setCategories(data.categories || []);
        setTotal(data.pagination.total || 0);
        setTotalPages(data.pagination.totalPages || 0);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Fetch categories error:", error);
          toast.error(error.message || "Failed to fetch categories.");
          setCategories([]);
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, [page, limit, sortBy, sortOrder, searchDebounced]);

  // Sorting
  const handleSort = (field: string) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  // Delete category (toastr only)
  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}admin/category/delete/${categoryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to delete category.");
        return;
      }

      // Optimistically update state
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      setTotal((prev) => Math.max(prev - 1, 0));

      toast.success("Category deleted successfully.");
    } catch (error: any) {
      console.error("Delete category error:", error);
      toast.error(error.message || "Could not delete category. Please try again.");
    }
  };

  return {
    categories,
    loading,
    page,
    limit,
    sortBy,
    sortOrder,
    totalPages,
    total,
    search,
    setSearch,
    setPage,
    setLimit,
    handleSort,
    handleDeleteCategory,
  };
}
