import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import toast from "react-hot-toast";

export function useBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");


  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/banners?page=${page}&limit=${limit}&search=${search}`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (data.success) {
        const bannersArray = data.data || [];
        const sorted = bannersArray.sort((a, b) => a.sequence - b.sequence);
        setBanners(sorted);
        setTotalPages(Math.ceil((data.count || bannersArray.length) / limit));
        setTotal(data.count || bannersArray.length);
      } else {
        toast.error(data.message || "Failed to fetch banners");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while fetching banners");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/banner/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "" },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Banner deleted successfully");
        fetchBanners();
      } else {
        toast.error(data.message || "Failed to delete banner");
      }
    } catch {
      toast.error("Server error while deleting banner");
    }
  };

  // ✅ Bulk sequence update API
  const handleUpdateSequences = async (newBanners: any[]) => {
    setBanners(newBanners);
    const sequences = newBanners.map((b, index) => ({
      _id: b._id,
      sequence: index + 1,
    }));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/banner/update-sequences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "",
          },
          credentials: "include",
          body: JSON.stringify({ sequences }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Banner sequences updated");
      } else {
        toast.error(data.message || "Failed to update sequences");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating banner sequences");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [page, limit, search]);

  return {
    banners,
    setBanners,
    loading,
    page,
    limit,
    totalPages,
    total,
    search,
    setSearch,
    setPage,
    setLimit,
    handleDeleteBanner,
    handleUpdateSequences,
  };
}
