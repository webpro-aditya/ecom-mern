export default function ResponsiveImage() {
  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-xl">
      <div className="overflow-hidden">
        <img
          src="/images/grid-image/image-01.png"
          alt="Cover"
          className="w-full border border-gray-200 rounded-xl dark:border-gray-800"
        />
      </div>
    </div>
  );
}
