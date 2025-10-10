import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { UserIcon, MailIcon, LockIcon } from "../../icons";

// Small icons reused for visual consistency
const CategoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h18M3 12h18M3 17h18"
    />
  </svg>
);

const DescriptionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v16l4-4z"
    />
  </svg>
);

const ParentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4v16m8-8H4"
    />
  </svg>
);

export default function CategoryAdd() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parents, setParents] = useState<{ _id: string; name: string }[]>([]);
  const navigate = useNavigate();

  // Fetch parent categories (only those with parent = null)
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}admin/categories?limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.success) {
          const parentOnly = data.categories.filter(
            (cat: any) => cat.parent === null
          );
          setParents(parentOnly);
        }
      } catch (err) {
        console.error("Failed to fetch parent categories:", err);
      }
    };
    fetchParents();
  }, []);

  // Generate slug dynamically when name changes
  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name) {
      setError("Category name is required.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}admin/category/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category.");
      }

      navigate("/admin/categories");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Add Category | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Add Category" />

      <div className="max-w-2xl mx-auto">
        <ComponentCard>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
              New Category Details
            </h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                {/* Category Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >
                    Category Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <CategoryIcon />
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      placeholder="Enter category name"
                    />
                  </div>
                </div>

                {/* Slug (auto-generated, readonly) */}
                <div>
                  <label
                    htmlFor="slug"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >
                    Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-slate-400">
                      <DescriptionIcon />
                    </span>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter category description"
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Parent Category */}
                <div>
                  <label
                    htmlFor="parent"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >
                    Parent Category
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <ParentIcon />
                    </span>
                    <select
                      id="parent"
                      name="parent"
                      value={formData.parent}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none"
                    >
                      <option value="">None (Top-level Category)</option>
                      {parents.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <Link
                    to="/admin/categories"
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-md transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading && (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    )}
                    {loading ? "Saving..." : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
