import { useState } from "react";
import { Link } from "react-router-dom";
import { EditIcon, DeleteIcon } from "../../icons";
import ConfirmationModal from "../common/ConfirmationModal";
import SkeletonCategory from "../common/SkeletonCategory";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: { _id: string; name: string } | null;
  createdAt?: string;
}

interface CategoriesAccordionProps {
  categories: Category[];
  loading: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onDelete: (id: string) => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CategoriesAccordion({
  categories,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onDelete,
}: CategoriesAccordionProps) {
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  if (loading) {
    return (
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCategory key={i} />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0)
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        No categories found.
      </div>
    );

  const parentCategories = categories.filter((cat) => !cat.parent);
  const childCategories = categories.filter((cat) => cat.parent);

  const getChildren = (parentId: string) =>
    childCategories.filter((child) => child.parent?._id === parentId);

  const handleOpenDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await onDelete(categoryToDelete._id);
      handleCloseModal();
    }
  };

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {parentCategories.map((parent) => {
        const isExpanded = expandedParent === parent._id;
        const children = getChildren(parent._id);

        return (
          <div key={parent._id} className="p-4">
            <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div
                onClick={() => setExpandedParent(isExpanded ? null : parent._id)}
                className="cursor-pointer flex items-center gap-4 flex-1"
              >
                {/* Category Image */}
                {parent.image ? (
                  <img
                    src={
                      parent.image.startsWith("http")
                        ? parent.image
                        : `${BACKEND_URL}${parent.image}`
                    }
                    alt={parent.name}
                    className="h-10 w-10 rounded object-cover border border-slate-200 dark:border-slate-600"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-xs">
                    N/A
                  </div>
                )}

                {/* Category Info */}
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {parent.name}
                  </h3>
                  {parent.description && (
                    <p className="text-sm text-slate-500">{parent.description}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
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

                <button
                  onClick={() => handleOpenDeleteModal(parent)}
                  title="Delete"
                  className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  <DeleteIcon />
                </button>

                <button
                  onClick={() => setExpandedParent(isExpanded ? null : parent._id)}
                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  <svg
                    className={`w-5 h-5 text-slate-600 transform transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Subcategories */}
            {isExpanded && (
              <div className="mt-3 ml-6 border-l border-slate-300 dark:border-slate-700 pl-4 space-y-2">
                {children.length > 0 ? (
                  children.map((child) => (
                    <div
                      key={child._id}
                      className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        {/* Child Image */}
                        {child.image ? (
                          <img
                            src={
                              child.image.startsWith("http")
                                ? child.image
                                : `${BACKEND_URL}${child.image}`
                            }
                            alt={child.name}
                            className="h-8 w-8 rounded object-cover border border-slate-200 dark:border-slate-600"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500">
                            -
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-200">
                            {child.name}
                          </p>
                          {child.description && (
                            <p className="text-xs text-slate-500">{child.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <Link
                          to={`/admin/category/${child._id}/edit`}
                          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
                          title="Edit"
                        >
                          <EditIcon />
                        </Link>
                        <button
                          onClick={() => handleOpenDeleteModal(child)}
                          title="Delete"
                          className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No subcategories found.</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
