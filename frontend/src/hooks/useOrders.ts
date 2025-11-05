import { useEffect, useState, useCallback } from "react";

export interface Order {
  _id: string;
  orderNumber?: string;
  createdAt: string;
  status: string;
  total: number;
  currency?: string;
  user?: { name?: string; email?: string };
  items?: { productName: string; quantity: number }[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters/sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalPages, setTotalPages] = useState(1);

  // Handler for table-header sort clicks
  const handleSort = useCallback(
    (column: string) => {
      if (sortBy === column) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(column);
        setSortOrder("asc");
      }
    },
    [sortBy]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({
          limit: String(limit),
          page: String(page),
          sortBy,
          sortOrder,
        });
        if (search) params.append("search", search);
        if (status) params.append("status", status);

        // Adjust URL according to your actual API spec (add any necessary params)
        const url = `${import.meta.env.VITE_API_URL}user/orders?${params.toString()}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        setOrders([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    // Depend on all filters
  }, [limit, page, search, status, sortBy, sortOrder]);

  return {
    orders,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    sortOrder,
    handleSort,
    totalPages,
  };
}
