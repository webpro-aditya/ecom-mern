import { useState, useEffect } from "react";

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

// The custom hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchDebounced, setSearchDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchCategories = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }admin/categories?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${searchDebounced}`,
          { signal, headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Network response failed");
        const data: ApiResponse = await res.json();
        setCategories(data.categories || []);
        setTotal(data.pagination.total || 0);
        setTotalPages(data.pagination.totalPages || 0);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch categories:", error);
          setCategories([]);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, [page, limit, sortBy, sortOrder, searchDebounced]);

  const handleSort = (field: string) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    setPage(1);
  };

//   const handleDeleteUser = async (userId: string): Promise<void> => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${import.meta.env.VITE_API_URL}admin/user/delete/${userId}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const data = await response.json();
//       throw new Error(data.message || 'Failed to delete user.');
//     }

//     // On success, remove the user from the local state for an instant UI update
//     setCategories((currentUsers) => currentUsers.filter((user) => user._id !== userId));
//     setTotal((currentTotal) => currentTotal - 1);

//   } catch (error) {
//     console.error("Delete error:", error);
//     // Here you could set an error state to show a notification
//     alert('Could not delete user. Please try again.');
//   }
// };

  // Return all state and handlers needed by the UI
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
    // handleDeleteUser,
  };
}
