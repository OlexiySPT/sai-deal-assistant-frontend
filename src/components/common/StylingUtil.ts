export type SizeType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ColorClassType = "grey" | "green" | "red" | "blue";

export function getHeightBySize(size?: SizeType) {
  switch (size) {
    case "sm":
      return 6;
    case "md":
      return 8;
    case "lg":
      return 9;
    case "xl":
      return 10;
    case "2xl":
      return 11;
    default:
      return 6;
  }
}

export function getControlHeightBySize(size?: SizeType) {
  switch (size) {
    case "xs":
      return 4;
    case "sm":
      return 6;
    case "md":
      return 8;
    case "lg":
      return 10;
    case "xl":
      return 12;
    case "2xl":
      return 14;
    default:
      return 6;
  }
}
