import React, { useState } from "react";

const FAQAccordion: React.FC<{ faqs: any[] }> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4 sm:p-5 transition"
        >
          {/* QUESTION */}
          <button
            onClick={() => toggle(i)}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
              {f.q}
            </span>

            <span className="text-xl text-gray-600 dark:text-gray-300 transition-transform"
              style={{
                transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
              }}
            >
              +
            </span>
          </button>

          {/* ANSWER */}
          <div
            className={`overflow-hidden transition-all duration-300 
              ${openIndex === i ? "max-h-40 mt-3" : "max-h-0"} 
            `}
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              {f.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
