import React, { useLayoutEffect, useRef, useState } from "react";
import EditButton from "../../buttons/EditButton";
import OkButton from "../../buttons/OkButton";
import CancelButton from "../../buttons/CancelButton";
import InputLabel from "../InputLabel";
import { getControlHeightBySize, SizeType } from "../../StylingUtil";
import { modal } from "../../../cva/modal-cva";
import { buble } from "../../../cva/buble-cva";

interface EditablePartFrameBaseProps {
  label?: string;
  className?: string;
  size?: SizeType;
  editMode: boolean;
  error?: string | null;
  readView: () => React.ReactNode;
  readActions?: () => React.ReactNode;
  editView: () => React.ReactNode;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  width?: string;
}

export default function EditablePartFrameBase({
  label,
  className = "",
  readView,
  readActions,
  editView,
  size = "sm",
  editMode,
  error,
  handleEdit,
  handleCancel,
  handleSave,
  width,
}: EditablePartFrameBaseProps) {
  const fontSizeBySize: Record<SizeType, string> = {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
  };

  const labelWrapperRef = useRef<HTMLDivElement | null>(null);
  const [labelWidthPx, setLabelWidthPx] = useState(0);

  const normalizedTextWidth = width
    ? /^\d+(\.\d+)?$/.test(width.trim())
      ? `${width.trim()}ch`
      : width
    : undefined;

  useLayoutEffect(() => {
    if (!label || !labelWrapperRef.current) {
      setLabelWidthPx(0);
      return;
    }

    const el = labelWrapperRef.current;
    const updateLabelWidth = () => {
      setLabelWidthPx(el.getBoundingClientRect().width);
    };

    updateLabelWidth();
    const observer = new ResizeObserver(updateLabelWidth);
    observer.observe(el);

    return () => observer.disconnect();
  }, [label, size]);

  const fixedWidthStyle = normalizedTextWidth
    ? {
        minWidth: `calc(${normalizedTextWidth} + ${labelWidthPx}px + 0.5rem)`,
        maxWidth: `calc(${normalizedTextWidth} + ${labelWidthPx}px + 0.5rem)`,
        width: `calc(${normalizedTextWidth} + ${labelWidthPx}px + 0.5rem)`,
      }
    : undefined;

  const controlStyle: React.CSSProperties = {
    ...(fixedWidthStyle ?? {}),
    fontSize: fontSizeBySize[size],
    minHeight: `${getControlHeightBySize(size) * 0.25}rem`,
  };

  return (
    <div
      style={controlStyle}
      className={`mb-1 flex w-full min-h-0 items-center gap-2 ${className}`}
    >
      {label && (
        <div
          ref={labelWrapperRef}
          className="flex self-stretch shrink-0 items-center"
        >
          <InputLabel label={label} size={size} />
        </div>
      )}
      {!editMode ? (
        <div className="flex flex-1 min-w-0 self-stretch items-center justify-between gap-2">
          {/*Read-only part */}
          <div className="flex h-full flex-1 min-w-0 items-center overflow-hidden whitespace-nowrap truncate text-ellipsis">
            {readView()}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {readActions?.()}
            <EditButton onClick={handleEdit} size="xs" aria-label="Edit" />
          </div>
        </div>
      ) : (
        <>
          {/* Overlay to block all other interactions */}
          <div className={modal({ part: "overlay" })} />
          <div
            className={`relative flex flex-1 min-w-0 self-stretch items-center gap-1 ${modal({ part: "content" })} ${className}`}
          >
            {/* Edit part*/}
            {editView()}
            <OkButton onClick={handleSave} size="xs" aria-label="Save" />
            <CancelButton
              onClick={handleCancel}
              size="xs"
              aria-label="Cancel"
            />
            {error && (
              <div
                className={`${buble({ style: "error", size })}`}
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
