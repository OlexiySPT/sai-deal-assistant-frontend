import { cva } from "class-variance-authority";

export const input = cva(
  " py-0 px-1 input border rounded w-full block truncate",
  {
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
  },
);
