import React from "react";

const EditButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => (
  <button
    type="button"
    className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    title="Edit Deal"
    {...props}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4"
      />
    </svg>
  </button>
);

export default EditButton;
