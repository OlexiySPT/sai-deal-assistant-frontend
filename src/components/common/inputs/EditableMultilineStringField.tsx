import { UpdateStringFieldCommand } from "../../../features/fieldUpdate/fieldUpdateAPI";
import fieldUpdateAPI from "../../../features/fieldUpdate/fieldUpdateAPI";
import MultilineStringEditor from "./MultilineStringEditor";

interface EditableMultilineStringFieldProps {
  value: string | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  label?: string;
  className?: string;
  rows?: number;
}
export default function EditableMultilineStringField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  className = "",
  rows = 2,
}: EditableMultilineStringFieldProps) {
  const handleSave = async (newValue: string) => {
    const command: UpdateStringFieldCommand = {
      entity,
      field,
      id,
      value: newValue,
      validation,
    };
    await fieldUpdateAPI.updateString(command);
    if (onUpdated) onUpdated();
  };

  return (
    <MultilineStringEditor
      value={value}
      label={label}
      rows={rows}
      className={className}
      onSave={handleSave}
    />
  );
}
