export default function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-4">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
      </td>
      <td className="p-4">
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
      </td>
      <td className="p-4">
        <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
      </td>
      <td className="p-4">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
      </td>
      <td className="p-4">
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
      </td>
      <td className="p-4">
        <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
      </td>
    </tr>
  );
}
