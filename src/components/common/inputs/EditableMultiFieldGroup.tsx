import React, { useState } from "react";
import fieldUpdateAPI from "../../../features/fieldUpdate/fieldUpdateAPI";
import { SizeType } from "../StylingUtil";
import { text } from "../../cva/text-cva";
import { input } from "../../cva/input-cva";
import InputLabel from "./InputLabel";
import EditButton from "../buttons/EditButton";
import OkButton from "../buttons/OkButton";
import CancelButton from "../buttons/CancelButton";
import { modal } from "../../cva/modal-cva";
import { buble } from "../../cva/buble-cva";

export type MultiFieldDescriptor =
  | {
      field: string;
      type: "string";
      value: string | null | undefined;
      label?: string;
      width?: string;
    }
  | {
      field: string;
      type: "number";
      value: number | null | undefined;
      label?: string;
      width?: string;
      decimalAccuracy?: number;
      thousandsSeparator?: boolean;
    }
  | {
      field: string;
      type: "dropdown";
      value: number | null | undefined;
      label?: string;
      width?: string;
      options: Array<{ id: number; value: string }>;
    };

interface EditableMultiFieldGroupProps {
  entity: string;
  id: number;
  fields: MultiFieldDescriptor[];
  onUpdated?: () => void;
  size?: SizeType;
}

function formatNumber(
  value: number | null | undefined,
  decimalAccuracy = 0,
  thousandsSeparator = false,
): string {
  if (value === null || value === undefined || isNaN(value)) return "(empty)";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimalAccuracy,
    maximumFractionDigits: decimalAccuracy,
    useGrouping: thousandsSeparator,
  });
}

export default function EditableMultiFieldGroup({
  entity,
  id,
  fields,
  onUpdated,
  size = "sm",
}: EditableMultiFieldGroupProps) {
  const [editMode, setEditMode] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEdit() {
    const init: Record<string, any> = {};
    fields.forEach((f) => {
      init[f.field] = f.value ?? "";
    });
    setInputValues(init);
    setError(null);
    setEditMode(true);
  }

  function handleCancel() {
    setError(null);
    setEditMode(false);
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      await fieldUpdateAPI.updateMultiple({
        entity,
        id,
        fields: fields.map((f) => ({
          field: f.field,
          value:
            f.type === "number" || f.type === "dropdown"
              ? inputValues[f.field] === "" ||
                inputValues[f.field] === undefined
                ? null
                : Number(inputValues[f.field])
              : inputValues[f.field] || null,
        })),
      });
      onUpdated?.();
      setEditMode(false);
    } catch (err: any) {
      const failures = err.response?.data?.failures?.Value;
      if (Array.isArray(failures) && failures.length > 0) {
        setError(failures.join("; "));
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || "Error updating fields");
      }
    } finally {
      setLoading(false);
    }
  }

  function renderReadField(f: MultiFieldDescriptor) {
    return (
      <div key={f.field} className="flex items-center gap-1">
        {f.label && <InputLabel label={f.label} size={size} />}
        {f.type === "string" && (
          <span className={text({ style: "value", size })}>
            {f.value || "(empty)"}
          </span>
        )}
        {f.type === "number" && (
          <span className={text({ style: "value", size })}>
            {formatNumber(
              f.value,
              (f as any).decimalAccuracy,
              (f as any).thousandsSeparator,
            )}
          </span>
        )}
        {f.type === "dropdown" && (
          <span className={text({ style: "value", size })}>
            {f.options.find((o) => o.id === f.value)?.value || "(empty)"}
          </span>
        )}
      </div>
    );
  }

  function renderEditField(f: MultiFieldDescriptor) {
    const val = inputValues[f.field];
    const setVal = (v: any) =>
      setInputValues((prev) => ({ ...prev, [f.field]: v }));

    const style: React.CSSProperties = f.width ? { width: f.width } : {};

    return (
      <div
        key={f.field}
        className="flex items-center gap-1 min-w-0"
        style={style}
      >
        {f.label && <InputLabel label={f.label} size={size} />}
        {f.type === "string" && (
          <input
            className={`${input({ size })} flex-1 min-w-0`}
            type="text"
            value={val ?? ""}
            onChange={(e) => setVal(e.target.value)}
            disabled={loading}
          />
        )}
        {f.type === "number" && (
          <input
            className={`${input({ size })} flex-1 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            type="number"
            value={val ?? ""}
            onChange={(e) => setVal(e.target.value)}
            disabled={loading}
          />
        )}
        {f.type === "dropdown" && (
          <select
            className={`${input({ size })} flex-1 min-w-0`}
            value={val ?? ""}
            onChange={(e) => setVal(Number(e.target.value))}
            disabled={loading}
          >
            <option value="">(empty)</option>
            {f.options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.value}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  return (
    <div className="mb-1 flex w-full min-h-0 items-center gap-2">
      {!editMode ? (
        <div className="flex flex-1 min-w-0 self-stretch items-center justify-between gap-2">
          <div className="flex flex-wrap gap-3 items-center flex-1 min-w-0">
            {fields.map(renderReadField)}
          </div>
          <div className="flex shrink-0 items-center">
            <EditButton onClick={handleEdit} size="xs" aria-label="Edit" />
          </div>
        </div>
      ) : (
        <>
          <div className={modal({ part: "overlay" })} />
          <div
            className={`relative flex-1 min-w-0 ${modal({ part: "content" })}`}
          >
            <div className="flex flex-wrap gap-2 items-center">
              {fields.map(renderEditField)}
              <OkButton onClick={handleSave} size="xs" aria-label="Save" />
              <CancelButton
                onClick={handleCancel}
                size="xs"
                aria-label="Cancel"
              />
            </div>
            {error && (
              <div
                className={buble({ style: "error", size })}
                style={{ top: "calc(100% + 0.5rem)", pointerEvents: "auto" }}
              >
                {error}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
