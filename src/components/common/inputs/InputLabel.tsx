import { text } from "../../cva/text.cva";
import { SizeType } from "../StylingUtil";

export default function InputLabel({
  label,
  size = "sm",
}: {
  label?: string;
  size?: SizeType;
}) {
  if (!label) return null;
  return <label className={text({ style: "label", size })}>{label}:</label>;
}
