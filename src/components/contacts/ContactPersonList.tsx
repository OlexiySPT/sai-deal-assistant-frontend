import React, { useEffect, useState } from "react";
import {
  deleteContactPerson,
  type ContactPersonListItemDto,
} from "../../features/contactPersons/contactPersonsAPI";
import AddButton from "../common/buttons/AddButton";
import CancelButton from "../common/buttons/CancelButton";
import ListItemEditButton from "../common/buttons/ListItemEditButton";
import { CreateOrEditContactDialog } from "./CreateOrEditContactDialog";

interface ContactPersonListProps {
  contactPersons: ContactPersonListItemDto[];
  firmId?: number | null;
  onUpdated?: () => void;
}

export const ContactPersonList: React.FC<ContactPersonListProps> = ({
  contactPersons,
  firmId,
  onUpdated,
}) => {
  const [contacts, setContacts] = useState(contactPersons || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContacts(contactPersons || []);
  }, [contactPersons]);

  const openCreateDialog = () => {
    setActiveContactId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (contactId: number) => {
    setActiveContactId(contactId);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setActiveContactId(null);
  };

  const handleSaved = () => {
    setError(null);
    onUpdated?.();
  };

  const handleDelete = async (
    contactId: number,
    contactName?: string | null,
  ) => {
    const confirmed = window.confirm(
      `Delete ${contactName?.trim() || "this contact"}?`,
    );
    if (!confirmed) return;

    setDeletingContactId(contactId);
    setError(null);

    try {
      await deleteContactPerson(contactId);
      setContacts((current) =>
        current.filter((person) => person.id !== contactId),
      );
      onUpdated?.();
    } catch (err: any) {
      setError(err?.message || "Failed to delete contact");
    } finally {
      setDeletingContactId(null);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-end">
        <AddButton
          onClick={openCreateDialog}
          size="xs"
          disabled={!firmId}
          title={firmId ? "Add contact person" : "Select a firm first"}
        />
      </div>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      {contacts.length > 0 ? (
        <div className="space-y-2">
          {contacts.map((person) => (
            <div
              key={person.id}
              className="rounded bg-gray-50 p-3 dark:bg-gray-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {person.name}
                  </div>
                  {person.position && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {person.position}
                    </div>
                  )}
                  {person.email && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {person.email}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <ListItemEditButton
                    onClick={() => openEditDialog(person.id)}
                    size="xs"
                    title={`Edit ${person.name || "contact"}`}
                  />
                  <CancelButton
                    onClick={() => handleDelete(person.id, person.name)}
                    size="xs"
                    title={`Delete ${person.name || "contact"}`}
                    aria-label={`Delete ${person.name || "contact"}`}
                    disabled={deletingContactId === person.id}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400">
          No contact persons available.
        </div>
      )}

      <CreateOrEditContactDialog
        open={dialogOpen}
        onClose={closeDialog}
        firmId={firmId ?? 0}
        contactId={activeContactId}
        onSaved={handleSaved}
      />
    </div>
  );
};
