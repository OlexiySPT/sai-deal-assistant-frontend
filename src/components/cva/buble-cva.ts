import { cva } from "class-variance-authority";

export const buble = cva(
  "absolute left-0 w-full items-center rounded px-2 shadow-lg animate-fade-in",
  {
    variants: {
      style: {
        info: "bg-gray-100 dark:bg-gray-400 border border-gray-400 text-gray-700 dark:text-gray-900",
        ok: "bg-green-100 dark:bg-green-800 border border-green-400 text-green-700 dark:text-green-300",
        warning:
          "bg-yellow-100 dark:bg-yellow-600 border border-yellow-200 text-yellow-700 dark:text-yellow-200",
        error:
          "bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-300",
      },
      size: {
        xs: "text-xs h-4",
        sm: "text-sm h-6",
        md: "text-base h-8",
        lg: "text-lg h-10",
        xl: "text-xl h-12",
        "2xl": "text-2xl h-14",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);
