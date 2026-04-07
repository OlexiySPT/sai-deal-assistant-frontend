import React, { useEffect, useState } from "react";
import { Dialog } from "../common/Dialog";
import { button } from "../cva/button-cva";
import {
  createFirm,
  getFirmById,
  updateFirm,
} from "../../features/firms/firmsAPI";

interface CreateOrEditFirmDialogProps {
  open: boolean;
  onClose: () => void;
  firmId?: number | null;
  initialName?: string | null;
  onSaved?: (savedFirmId: number) => void;
}

interface FirmFormState {
  name: string;
  country: string;
  description: string;
}

const emptyForm: FirmFormState = {
  name: "",
  country: "",
  description: "",
};

export const CreateOrEditFirmDialog: React.FC<CreateOrEditFirmDialogProps> = ({
  open,
  onClose,
  firmId,
  initialName,
  onSaved,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FirmFormState>(emptyForm);

  useEffect(() => {
    if (!open) return;

    setError(null);

    if (!firmId) {
      setForm(emptyForm);
      setLoading(false);
      return;
    }

    setLoading(true);
    getFirmById(firmId)
      .then((firm) => {
        setForm({
          name: firm.name || "",
          country: firm.country || "",
          description: firm.description || "",
        });
      })
      .catch(() => {
        setError("Failed to load firm");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [firmId, initialName, open]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: form.name.trim() || null,
        country: form.country.trim() || null,
        description: form.description.trim() || null,
      };

      const savedFirm = firmId
        ? await updateFirm(firmId, { id: firmId, ...payload })
        : await createFirm({ id: 0, ...payload });

      onSaved?.(savedFirm.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save firm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={firmId ? "Edit Firm" : "Create Firm"}
      dialogClassName="max-w-2xl"
    >
      <form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">
        <div className="flex items-center gap-2">
          <label className="w-28 text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleFieldChange}
            className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-28 text-sm font-medium">Country</label>
          <input
            name="country"
            value={form.country}
            onChange={handleFieldChange}
            className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFieldChange}
            className="border rounded px-2 py-1 min-h-[120px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          className={`${button({ colorClass: "blue", size: "md" })} !aspect-auto w-auto h-auto px-4 py-2 !rounded`}
          disabled={loading}
        >
          {loading ? "Saving..." : firmId ? "Update Firm" : "Create Firm"}
        </button>
      </form>
    </Dialog>
  );
};
