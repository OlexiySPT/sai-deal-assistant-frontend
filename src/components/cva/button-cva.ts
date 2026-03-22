import { cva } from "class-variance-authority";

export const button = cva(
  "inline-flex items-center justify-center rounded p-1 focus:outline-none transition-colors aspect-square disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      colorClass: {
        grey: "bg-gray-100 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300",
        green:
          "bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-green-300",
        red: "bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-300",
        blue: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-300",
      },
      size: {
        xs: "text-xs w-4 h-4",
        sm: "text-sm w-6 h-6",
        md: "text-base w-8 h-8",
        lg: "text-lg w-10 h-10",
        xl: "text-xl w-12 h-12",
        "2xl": "text-2xl w-14 h-14",
      },
    },
    defaultVariants: {
      colorClass: "grey",
      size: "sm",
    },
  },
);
