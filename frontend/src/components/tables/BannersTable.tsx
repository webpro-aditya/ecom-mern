import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EditIcon, DeleteIcon, DragIcon } from "../../icons";
import Badge from "../../components/ui/badge/Badge";
import ConfirmationModal from "../common/ConfirmationModal";
import SkeletonRow from "../common/SkeletonRow";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Banner {
  _id: string;
  image: string;
  htmlContent: string;
  sequence: number;
  isActive: boolean;
  createdAt: string;
}

interface BannersTableProps {
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onSequenceUpdate: (newBanners: Banner[]) => void;
}

export default function BannersTable({
  banners,
  setBanners,
  loading,
  onDelete,
  onSequenceUpdate,
}: BannersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  const handleOpenDeleteModal = (banner: Banner) => {
    setBannerToDelete(banner);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBannerToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (bannerToDelete) {
      await onDelete(bannerToDelete._id);
      handleCloseModal();
    }
  };

  // ✅ handle drag reorder
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updated = items.map((b, index) => ({ ...b, sequence: index + 1 }));
    setBanners(updated);
    onSequenceUpdate(updated);
  };

  return (
    <div className="overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="banners">
          {(provided) => (
            <table
              className="w-full border-collapse"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4 w-10"></th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Seq.
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Image
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Content
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : banners.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-slate-500 dark:text-slate-400"
                    >
                      No banners found.
                    </td>
                  </tr>
                ) : (
                  banners.map((banner, index) => (
                    <Draggable
                      key={banner._id}
                      draggableId={banner._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            transition-all duration-150 ease-in-out
                            hover:bg-slate-50 dark:hover:bg-slate-800/50
                            ${
                              snapshot.isDragging
                                ? "bg-blue-50 dark:bg-slate-700/50 shadow-lg ring-2 ring-blue-400 dark:ring-blue-500 scale-[1.01] cursor-grabbing"
                                : "cursor-pointer"
                            }
                          `}
                          style={{
                            ...provided.draggableProps.style,
                            transition: "transform 0.15s ease, box-shadow 0.15s ease",
                          }}
                        >
                          <td
                            className="p-4 cursor-grab hover:text-blue-600 dark:hover:text-blue-400"
                            {...provided.dragHandleProps}
                            title="Drag to reorder"
                          >
                            <div className="flex items-center justify-center">
                              <DragIcon />
                            </div>
                          </td>

                          <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                            {banner.sequence}
                          </td>

                          <td className="p-4">
                            <div className="h-14 w-24 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600">
                              {banner.image ? (
                                <img
                                  src={`${BACKEND_URL}${banner.image}`}
                                  alt="banner"
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <span className="text-slate-400 text-sm flex items-center justify-center h-full">
                                  No Image
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs">
                            <div
                              className="truncate"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(banner.htmlContent),
                              }}
                            />
                          </td>

                          <td className="p-4">
                            <Badge
                              color={banner.isActive ? "success" : "warning"}
                            >
                              {banner.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>

                          <td className="p-4">
                            <div className="flex gap-2">
                              <Link
                                to={`/admin/banners/${banner._id}/edit`}
                                title="Edit"
                                className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-slate-700"
                              >
                                <EditIcon />
                              </Link>
                              <button
                                onClick={() => handleOpenDeleteModal(banner)}
                                title="Delete"
                                className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this banner?"
      />
    </div>
  );
}
function sanitizeHtml(input: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");
  const walk = (node: any) => {
    const block = ["SCRIPT", "STYLE", "IFRAME"];
    if (block.includes(node.nodeName)) {
      node.remove();
      return;
    }
    if (node.attributes) {
      Array.from(node.attributes).forEach((attr: any) => {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || "").toLowerCase();
        const isEvent = name.startsWith("on");
        const isJsUrl = name === "href" || name === "src" ? value.startsWith("javascript:") : false;
        if (isEvent || isJsUrl) node.removeAttribute(attr.name);
      });
    }
    Array.from(node.childNodes).forEach(walk);
  };
  Array.from(doc.body.childNodes).forEach(walk);
  return doc.body.innerHTML;
}
