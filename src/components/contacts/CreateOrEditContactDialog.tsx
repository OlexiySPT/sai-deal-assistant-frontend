import React, { useEffect, useState } from "react";
import { Dialog } from "../common/Dialog";
import {
  createContactPerson,
  getContactPersonById,
  updateContactPerson,
} from "../../features/contactPersons/contactPersonsAPI";

interface CreateOrEditContactDialogProps {
  open: boolean;
  onClose: () => void;
  dealId: number;
  contactId?: number | null;
  onSaved?: (savedContactId: number) => void;
}

export const CreateOrEditContactDialog: React.FC<
  CreateOrEditContactDialogProps
> = ({ open, onClose, dealId, contactId, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    if (!open) return;

    if (!contactId) {
      setForm({
        name: "",
        position: "",
        phone: "",
        email: "",
        description: "",
      });
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    getContactPersonById(contactId)
      .then((contact) => {
        setForm({
          name: contact.name || "",
          position: contact.position || "",
          phone: contact.phone || "",
          email: contact.email || "",
          description: contact.description || "",
        });
      })
      .catch(() => {
        setError("Failed to load contact");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [contactId, open]);

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
        position: form.position.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        description: form.description.trim() || null,
      };

      let savedId = contactId || 0;

      if (contactId) {
        const updated = await updateContactPerson(contactId, {
          id: contactId,
          ...payload,
        });
        savedId = updated.id;
      } else {
        const created = await createContactPerson({
          id: 0,
          ...payload,
          dealId,
        });
        savedId = created.id;
      }

      if (onSaved) onSaved(savedId);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={contactId ? "Edit Contact" : "Create Contact"}
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
          <label className="w-28 text-sm font-medium">Position</label>
          <input
            name="position"
            value={form.position}
            onChange={handleFieldChange}
            className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-28 text-sm font-medium">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleFieldChange}
            className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-28 text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={form.phone}
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
            className="border rounded px-2 py-1 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : contactId
              ? "Update Contact"
              : "Create Contact"}
        </button>
      </form>
    </Dialog>
  );
};
