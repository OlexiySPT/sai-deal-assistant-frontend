import { cva } from "class-variance-authority";

export const breadcrumb = cva("flex items-center px-1 rounded-md", {
  variants: {
    colorClass: {
      grey: "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300",
      green:
        "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300",
      red: "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300",
      blue: "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300",
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
    colorClass: "grey",
    size: "sm",
  },
});

export const breadcrumbsArea = cva("flex items-center rounded-md", {
  variants: {
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
});
