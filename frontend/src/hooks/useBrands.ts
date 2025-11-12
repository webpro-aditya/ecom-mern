import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import toast from "react-hot-toast";

export function useBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");


  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/brands?page=${page}&limit=${limit}&search=${search}`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (data.success) {
        const list = data.data || [];
        setBrands(list);
        setTotalPages(Math.ceil((data.count || list.length) / limit));
      } else {
        toast.error(data.message || "Failed to fetch brands");
      }
    } catch (err) {
      toast.error("Server error while fetching brands");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/brand/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "" },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Brand deleted successfully");
        fetchBrands();
      } else {
        toast.error(data.message || "Failed to delete brand");
      }
    } catch (err) {
      toast.error("Server error while deleting brand");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [page, limit, search]);

  return {
    brands,
    loading,
    page,
    limit,
    totalPages,
    search,
    setSearch,
    setPage,
    setLimit,
    handleDeleteBrand,
  };
}
