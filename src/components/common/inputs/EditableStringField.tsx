import React, { useState } from "react";
import { UpdateStringFieldCommand } from "../../../features/fieldUpdate/fieldUpdateAPI";
import fieldUpdateAPI from "../../../features/fieldUpdate/fieldUpdateAPI";
import OkButton from "../buttons/OkButton";
import CancelButton from "../buttons/CancelButton";
import EditButton from "../buttons/EditButton";

interface EditableStringFieldProps {
  value: string | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  label?: string;
  className?: string;
}

const EditableStringField: React.FC<EditableStringFieldProps> = ({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  className = "",
}) => {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setInputValue(value ?? "");
    setEditMode(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const command: UpdateStringFieldCommand = {
      entity,
      field,
      id,
      value: inputValue,
      validation,
    };
    try {
      await fieldUpdateAPI.updateString(command);
      setEditMode(false);
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "Error updating field",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="mr-2 font-medium">{label}:</span>}
      {!editMode ? (
        <>
          <span className="truncate max-w-xs" title={value ?? ""}>
            {value ?? <span className="text-gray-400">(empty)</span>}
          </span>
          <EditButton onClick={handleEdit} size="sm" aria-label="Edit" />
        </>
      ) : (
        <>
          <input
            className="input input-sm border rounded px-2 py-1 max-w-xs"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              } else if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
              }
            }}
          />
          <OkButton
            onClick={handleSave}
            size="sm"
            disabled={loading}
            aria-label="Save"
          />
          <CancelButton
            onClick={handleCancel}
            size="sm"
            disabled={loading}
            aria-label="Cancel"
          />
        </>
      )}
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </div>
  );
};

export default EditableStringField;
