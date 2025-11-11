export default function SkeletonCategory() {
  return (
    <div className="p-4 animate-pulse">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
