import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useProducts = (productType) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const url = `${
        import.meta.env.VITE_API_URL
      }admin/products?type=${productType}&page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/product/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, sortBy, sortOrder, search, productType]);

  return {
    products,
    loading,
    page,
    limit,
    sortBy,
    sortOrder,
    totalPages,
    search,
    setSearch,
    setPage,
    setLimit,
    handleSort,
    handleDeleteProduct,
  };
};
