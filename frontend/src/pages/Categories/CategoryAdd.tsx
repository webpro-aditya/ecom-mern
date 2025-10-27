import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

// Modern icons
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
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

const SlugIcon = () => (
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
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

      <div className="mx-auto max-w-3xl">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Add New Category
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create a new category for organizing your products
            </p>
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

        <ComponentCard>
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <CategoryIcon />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500"
                    placeholder="e.g., Electronics, Clothing, Books"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Choose a descriptive name for your category
                </p>
              </div>

              {/* Slug (auto-generated) */}
              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  URL Slug
                  <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Auto-generated
                  </span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <SlugIcon />
                  </div>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    readOnly
                    className="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-4 text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  This will be used in the URL (automatically created from name)
                </p>
              </div>

              {/* Parent Category */}
              <div>
                <label
                  htmlFor="parent"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Parent Category
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <ParentIcon />
                  </div>
                  <select
                    id="parent"
                    name="parent"
                    value={formData.parent}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-10 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500"
                  >
                    <option value="">None (Top-level Category)</option>
                    {parents.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Leave empty to create a top-level category
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Description
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-3">
                    <DescriptionIcon />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Provide a brief description of this category..."
                    className="block w-full resize-none rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500"
                  ></textarea>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Help users understand what products belong in this category
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
                <Link
                  to="/admin/categories"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900"
                >
                  {loading && (
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
                  )}
                  {loading ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </ComponentCard>

        {/* Info Box */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex">
            <svg
              className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Category Tips
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                <ul className="list-inside list-disc space-y-1">
                  <li>Use clear, descriptive names for better organization</li>
                  <li>
                    Parent categories help create hierarchical product structures
                  </li>
                  <li>The URL slug is automatically generated from the name</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
