import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  status?: string;
}

interface ApiResponse {
  success: boolean;
  pagination: {
    total: number;
    totalPages: number;
  };
  users: User[];
}

// The custom hook
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
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

    const fetchUsers = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }admin/users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${searchDebounced}`,
          { signal, headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Network response failed");
        const data: ApiResponse = await res.json();
        setUsers(data.users || []);
        setTotal(data.pagination.total || 0);
        setTotalPages(data.pagination.totalPages || 0);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch users:", error);
          setUsers([]);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [page, limit, sortBy, sortOrder, searchDebounced]);

  const handleSort = (field: string) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}admin/user/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete user.");
      }

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== userId)
      );
      setTotal((currentTotal) => currentTotal - 1);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Could not delete user. Please try again.");
    }
  };

  return {
    users,
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
    handleDeleteUser,
  };
}
