export type SizeType = "sm" | "md" | "lg" | "xl" | "2xl";

export function getHeightBySize(size?: SizeType) {
  switch (size) {
    case "sm":
      return 7;
    case "md":
      return 8;
    case "lg":
      return 9;
    case "xl":
      return 10;
    case "2xl":
      return 11;
    default:
      return 7;
  }
}
