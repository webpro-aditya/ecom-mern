import { useState } from "react";
import { Link } from "react-router-dom";
import { EditIcon } from "../../icons";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parent?: { _id: string; name: string } | null;
  createdAt?: string;
}

interface CategoriesAccordionProps {
  categories: Category[];
  loading: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function CategoriesAccordion({
  categories,
  loading,
  sortBy,
  sortOrder,
  onSort,
}: CategoriesAccordionProps) {
  const [expandedParent, setExpandedParent] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        Loading categories...
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        No categories found.
      </div>
    );
  }

  // Separate parents and children
  const parentCategories = categories.filter((cat) => !cat.parent);
  const childCategories = categories.filter((cat) => cat.parent);

  const getChildren = (parentId: string) =>
    childCategories.filter((child) => child.parent?._id === parentId);

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {parentCategories.map((parent) => {
        const isExpanded = expandedParent === parent._id;
        const children = getChildren(parent._id);

        return (
          <div key={parent._id} className="p-4">
            {/* Parent Accordion Header */}
            <div
              onClick={() =>
                setExpandedParent(isExpanded ? null : parent._id)
              }
              className="flex justify-between items-center cursor-pointer p-3 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  {parent.name}
                </h3>
                <p className="text-sm text-slate-500">{parent.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {new Date(parent.createdAt || "").toLocaleDateString()}
                </span>
                <Link
                  to={`/admin/category/${parent._id}/edit`}
                  className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
                  title="Edit"
                >
                  <EditIcon />
                </Link>
                <svg
                  className={`w-5 h-5 text-slate-600 transform transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Child Categories */}
            {isExpanded && children.length > 0 && (
              <div className="mt-3 ml-6 border-l border-slate-300 dark:border-slate-700 pl-4 space-y-2">
                {children.map((child) => (
                  <div
                    key={child._id}
                    className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {child.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {child.description}
                      </p>
                    </div>
                    <Link
                      to={`/admin/category/${child._id}/edit`}
                      className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
                      title="Edit"
                    >
                      <EditIcon />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* No children */}
            {isExpanded && children.length === 0 && (
              <p className="ml-6 mt-2 text-sm text-slate-500">
                No subcategories found.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
