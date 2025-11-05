import React from "react";

// Supports dark mode and common statuses out of the box!
export function StatusBadge({ status }: { status: string }) {
  const statusMap: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
    shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200",
    refunded: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  const badgeStyle =
    statusMap[status?.toLowerCase()] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${badgeStyle}`}
    >
      {status}
    </span>
  );
}
