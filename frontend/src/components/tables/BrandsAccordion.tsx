import { useState } from "react";
import { Link } from "react-router-dom";
import { EditIcon, DeleteIcon } from "../../icons";
import ConfirmationModal from "../common/ConfirmationModal";
import SkeletonCategory from "../common/SkeletonCategory";

interface SubBrand {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
}

interface Brand {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  subbrands?: SubBrand[];
}

interface BrandsAccordionProps {
  brands: Brand[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function BrandsAccordion({
  brands,
  loading,
  onDelete,
}: BrandsAccordionProps) {
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  if (loading) {
    return (
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCategory key={i} />
        ))}
      </div>
    );
  }

  if (!brands || brands.length === 0)
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        No brands found.
      </div>
    );

  const handleOpenDeleteModal = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBrandToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      await onDelete(brandToDelete._id);
      handleCloseModal();
    }
  };

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {brands.map((brand) => {
        const isExpanded = expandedParent === brand._id;
        const children = brand.subbrands || [];

        return (
          <div key={brand._id} className="p-4">
            <div className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg transition">
              <div
                onClick={() =>
                  setExpandedParent(isExpanded ? null : brand._id)
                }
                className="cursor-pointer flex items-center gap-4 flex-1"
              >
                {/* Logo */}
                {brand.logo ? (
                  <img
                    src={
                      brand.logo.startsWith("http")
                        ? brand.logo
                        : `${BACKEND_URL}${brand.logo}`
                    }
                    alt={brand.name}
                    className="h-10 w-10 rounded object-contain border border-slate-200 dark:border-slate-600"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-xs">
                    N/A
                  </div>
                )}

                {/* Brand Info */}
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {brand.name}
                  </h3>
                  {brand.description && (
                    <p className="text-sm text-slate-500">{brand.description}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    brand.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {brand.isActive ? "Active" : "Inactive"}
                </span>

                <span className="text-xs text-slate-500">
                  {new Date(brand.createdAt || "").toLocaleDateString()}
                </span>

                <Link
                  to={`/admin/brand/${brand._id}/edit`}
                  className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
                  title="Edit"
                >
                  <EditIcon />
                </Link>

                <button
                  onClick={() => handleOpenDeleteModal(brand)}
                  title="Delete"
                  className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  <DeleteIcon />
                </button>

                <button
                  onClick={() =>
                    setExpandedParent(isExpanded ? null : brand._id)
                  }
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Subbrands */}
            {isExpanded && (
              <div className="mt-3 ml-6 border-l border-slate-300 dark:border-slate-700 pl-4 space-y-2">
                {children.length > 0 ? (
                  children.map((child) => (
                    <div
                      key={child._id}
                      className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        {child.logo ? (
                          <img
                            src={
                              child.logo.startsWith("http")
                                ? child.logo
                                : `${BACKEND_URL}${child.logo}`
                            }
                            alt={child.name}
                            className="h-8 w-8 rounded object-contain border border-slate-200 dark:border-slate-600"
                            loading="lazy"
                            decoding="async"
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
                            <p className="text-xs text-slate-500">
                              {child.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Link
                          to={`/admin/brand/${child._id}/edit`}
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
                  <p className="text-sm text-slate-500">
                    No sub-brands found.
                  </p>
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
        message={`Are you sure you want to delete "${brandToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
