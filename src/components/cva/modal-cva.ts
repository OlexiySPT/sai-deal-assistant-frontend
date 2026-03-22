import { cva } from "class-variance-authority";

export const modal = cva("", {
  variants: {
    part: {
      overlay: "fixed inset-0 z-40 bg-black bg-opacity-10",
      content: "z-50 relative",
    },
  },
});
