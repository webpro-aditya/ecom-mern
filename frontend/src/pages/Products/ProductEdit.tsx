import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "simple",
    category: "",
    subcategory: "",
    price: "",
    stock: "",
    images: [],
    variations: [],
  });

  // ✅ Load initial data: categories, attributes, product
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch all required data in parallel
      const [catRes, attrRes, prodRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}admin/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}admin/attributes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}admin/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [catData, attrData, prodData] = await Promise.all([
        catRes.json(),
        attrRes.json(),
        prodRes.json(),
      ]);

      if (catData.success) setCategories(catData.categories || []);
      if (attrData.success) setAttributes(attrData.attributes || []);

      if (prodData.success && prodData.product) {
        const product = prodData.product;
        setFormData({
          name: product.name,
          description: product.description,
          type: product.type,
          category: product.category?._id || "",
          subcategory: product.subcategory?._id || "",
          price: product.price || "",
          stock: product.stock || "",
          images: product.images || [],
          variations: product.variations || [],
        });

        // Prefill attribute selections if variations exist
        if (product.type === "variable" && product.variations.length) {
          const preselected = {};
          product.variations.forEach((v) => {
            Object.entries(v.attributes).forEach(([attrId, val]) => {
              if (!preselected[attrId]) preselected[attrId] = new Set();
              preselected[attrId].add(val);
            });
          });

          const formatted = {};
          for (const key in preselected) {
            formatted[key] = Array.from(preselected[key]);
          }
          setSelectedAttributes(formatted);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    }
  };

  // ✅ Subcategory logic
  useEffect(() => {
    if (!formData.category) {
      setSubcategories([]);
      return;
    }
    const subs = categories.filter(
      (cat) => cat.parent && cat.parent._id === formData.category
    );
    setSubcategories(subs);
  }, [formData.category, categories]);

  // ✅ Generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ File upload helper
  const uploadFiles = async (files) => {
    const token = localStorage.getItem("token");
    const form = new FormData();
    files.forEach((file) => form.append("images", file));

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}admin/images/upload`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Image upload failed");
    return data.paths;
  };

  // ✅ Product image upload
  const handleProductImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadFiles(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Variation image upload
  const handleVariationImageUpload = async (vIndex, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadFiles(files);
      const variations = [...formData.variations];
      variations[vIndex].images = [
        ...(variations[vIndex].images || []),
        ...uploaded,
      ];
      setFormData((prev) => ({ ...prev, variations }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Variation handler
  const handleVariationChange = (index, field, value) => {
    const variations = [...formData.variations];
    variations[index][field] = value;
    setFormData((prev) => ({ ...prev, variations }));
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/product/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");

      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove variation
  const removeVariation = (index) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  // ✅ Remove image helper
  const removeProductImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeVariationImage = (vIndex, imgIndex) => {
    const variations = [...formData.variations];
    variations[vIndex].images = variations[vIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setFormData((prev) => ({ ...prev, variations }));
  };

  return (
    <>
      <PageMeta title="Edit Product | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Edit Product" />

      <div className="mx-auto max-w-6xl">
        <form onSubmit={handleSubmit} noValidate>
          {/* Header Section */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Edit Product
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update product information and settings
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/products"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploading}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900"
              >
                {loading ? (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-start">
                <svg
                  className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <ComponentCard>
                <div className="p-6">
                  <h3 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                    Basic Information
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        placeholder="Enter product description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </ComponentCard>

              {/* Pricing & Inventory (Simple Product) */}
              {formData.type === "simple" && (
                <ComponentCard>
                  <div className="p-6">
                    <h3 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                      Pricing & Inventory
                    </h3>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                            $
                          </span>
                          <input
                            type="number"
                            name="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-8 pr-4 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          name="stock"
                          placeholder="0"
                          value={formData.stock}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </ComponentCard>
              )}

              {/* Product Images (Simple Product) */}
              {formData.type === "simple" && (
                <ComponentCard>
                  <div className="p-6">
                    <h3 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                      Product Images
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-10 h-10 mb-3 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              PNG, JPG or WEBP (MAX. 5MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleProductImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                          {formData.images.map((img, i) => (
                            <div
                              key={i}
                              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-slate-200 dark:border-slate-700"
                            >
                              <img
                                src={`${import.meta.env.VITE_BACKEND_URL}${img}`}
                                alt={`Product ${i + 1}`}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeProductImage(i)}
                                  className="rounded-lg bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ComponentCard>
              )}

              {/* Variations List */}
              {formData.type === "variable" && formData.variations.length > 0 && (
                <ComponentCard>
                  <div className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Product Variations
                      </h3>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {formData.variations.length} variations
                      </span>
                    </div>

                    <div className="space-y-5">
                      {formData.variations.map((v, i) => (
                        <div
                          key={i}
                          className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                        >
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeVariation(i)}
                            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          {/* Variation Label */}
                          <div className="mb-4 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              Variation {i + 1}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {v.name || Object.values(v.attributes || {}).join(" / ")}
                            </span>
                          </div>

                          {/* Form Fields */}
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                                Name
                              </label>
                              <input
                                type="text"
                                placeholder="Variation name"
                                value={v.name}
                                onChange={(e) =>
                                  handleVariationChange(i, "name", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                                SKU
                              </label>
                              <input
                                type="text"
                                placeholder="SKU"
                                value={v.sku}
                                onChange={(e) =>
                                  handleVariationChange(i, "sku", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                                Price
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400">
                                  $
                                </span>
                                <input
                                  type="number"
                                  placeholder="0.00"
                                  value={v.price}
                                  onChange={(e) =>
                                    handleVariationChange(
                                      i,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  step="0.01"
                                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                                Stock
                              </label>
                              <input
                                type="number"
                                placeholder="0"
                                value={v.stock}
                                onChange={(e) =>
                                  handleVariationChange(i, "stock", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
                              />
                            </div>
                          </div>

                          {/* Variation Images */}
                          <div className="mt-5">
                            <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
                              Variation Images
                            </label>
                            <div className="flex items-start gap-3">
                              <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700">
                                <svg
                                  className="h-8 w-8 text-slate-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleVariationImageUpload(i, e)
                                  }
                                  className="hidden"
                                />
                              </label>

                              {(v.images || []).map((img, j) => (
                                <div
                                  key={j}
                                  className="group relative h-24 w-24 overflow-hidden rounded-lg border-2 border-slate-200 dark:border-slate-700"
                                >
                                  <img
                                    src={`${
                                      import.meta.env.VITE_BACKEND_URL
                                    }${img}`}
                                    alt={`Variation ${i + 1} - ${j + 1}`}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeVariationImage(i, j)
                                      }
                                      className="rounded-lg bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700"
                                    >
                                      <svg
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ComponentCard>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Product Type Card */}
              <ComponentCard>
                <div className="p-6">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Product Type
                  </h3>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-slate-200 p-3 transition-all hover:border-blue-300 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:border-slate-700 dark:hover:border-blue-600 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-900/20">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="type"
                          value="simple"
                          checked={formData.type === "simple"}
                          onChange={handleChange}
                          className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            Simple Product
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Single variant
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-slate-200 p-3 transition-all hover:border-blue-300 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:border-slate-700 dark:hover:border-blue-600 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-900/20">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="type"
                          value="variable"
                          checked={formData.type === "variable"}
                          onChange={handleChange}
                          className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            Variable Product
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Multiple variants
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </ComponentCard>

              {/* Category Card */}
              <ComponentCard>
                <div className="p-6">
                  <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Product Organization
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categories
                          .filter((c) => !c.parent)
                          .map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {subcategories.length > 0 && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Subcategory
                        </label>
                        <select
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500"
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </ComponentCard>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
