import { cva } from "class-variance-authority";

export const text = cva(
  "inline-flex items-center whitespace-nowrap bg-transparent align-middle leading-none",
  {
    variants: {
      style: {
        value: "text-gray-900 dark:text-gray-200",
        label: "text-gray-600 dark:text-gray-400",
        url: "text-blue-600 dark:text-blue-400 hover:underline italic",
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
