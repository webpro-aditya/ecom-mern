import React from "react";

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md">
      <div className="relative">
        <div className="absolute -inset-16 rounded-full bg-gradient-to-br from-pink-500/30 via-indigo-500/20 to-blue-500/30 blur-3xl opacity-40 animate-pulse"></div>
        <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
          <circle
            className="pl__ring pl__ring--a"
            cx="120"
            cy="120"
            r="105"
            fill="none"
            stroke="#000"
            strokeWidth="20"
            strokeDasharray="0 660"
            strokeDashoffset="-330"
            strokeLinecap="round"
          ></circle>
          <circle
            className="pl__ring pl__ring--b"
            cx="120"
            cy="120"
            r="35"
            fill="none"
            stroke="#000"
            strokeWidth="20"
            strokeDasharray="0 220"
            strokeDashoffset="-110"
            strokeLinecap="round"
          ></circle>
          <circle
            className="pl__ring pl__ring--c"
            cx="85"
            cy="120"
            r="70"
            fill="none"
            stroke="#000"
            strokeWidth="20"
            strokeDasharray="0 440"
            strokeLinecap="round"
          ></circle>
          <circle
            className="pl__ring pl__ring--d"
            cx="155"
            cy="120"
            r="70"
            fill="none"
            stroke="#000"
            strokeWidth="20"
            strokeDasharray="0 440"
            strokeLinecap="round"
          ></circle>
        </svg>
      </div>
    </div>
  );
};

export default Preloader;