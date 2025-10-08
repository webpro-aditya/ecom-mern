import React from "react";
import {
  FirstPageIcon,
  PreviousPageIcon,
  NextPageIcon,
  LastPageIcon,
} from "../../icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageItems = () => {
    const items: (number | string)[] = [];
    const pageNeighbours = 1;

    if (totalPages <= 5 + pageNeighbours) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

      items.push(1);

      if (startPage > 2) {
        items.push("ellipsis-left");
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      if (endPage < totalPages - 1) {
        items.push("ellipsis-right");
      }

      items.push(totalPages);
    }
    return items;
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </div>

      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center gap-1.5"
      >
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center h-9 w-9 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to first page"
        >
          <FirstPageIcon />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center h-9 w-9 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to previous page"
        >
          <PreviousPageIcon />
        </button>

        {getPageItems().map((item, index) => {
          if (typeof item === "number") {
            const isActive = item === currentPage;
            return (
              <button
                key={index}
                onClick={() => onPageChange(item)}
                className={`flex items-center justify-center h-9 w-9 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item}
              </button>
            );
          }
          return (
            <span
              key={index}
              className="flex items-center justify-center h-9 w-9 select-none text-slate-500 dark:text-slate-400"
            >
              …
            </span>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center h-9 w-9 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to next page"
        >
          <NextPageIcon />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center h-9 w-9 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to last page"
        >
          <LastPageIcon />
        </button>
      </nav>
    </div>
  );
}
