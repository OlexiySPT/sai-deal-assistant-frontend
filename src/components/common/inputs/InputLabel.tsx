import { SizeType } from "../sizeUtils";

export default function InputLabel({
  label,
  size,
}: {
  label?: string;
  size?: SizeType;
}) {
  if (!label) return null;
  return (
    <label
      className={`mr-2 text-${size || "sm"} font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap`}
    >
      {label}:
    </label>
  );
}
