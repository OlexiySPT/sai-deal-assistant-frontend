import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  deleteContactPerson,
  type ContactPersonListItemDto,
} from "../../features/contactPersons/contactPersonsAPI";
import CancelButton from "../common/buttons/CancelButton";
import { CreateOrEditContactDialog } from "./CreateOrEditContactDialog";

// Contact person row — matches EventList row style
const ContactRow: React.FC<{
  person: ContactPersonListItemDto;
  onClick: (id: number) => void;
  onRemove: (id: number, name?: string | null) => void;
  removing: boolean;
}> = ({ person, onClick, onRemove, removing }) => {
  const details = [person.position, person.email].filter(Boolean).join(" · ");

  return (
    <div
      className="group px-3 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center"
      onClick={() => onClick(person.id)}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {person.name || "Contact"}
        </div>
        {details && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {details}
          </div>
        )}
      </div>
      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CancelButton
          size="xs"
          disabled={removing}
          title={`Delete ${person.name || "contact"}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(person.id, person.name);
          }}
        />
      </span>
    </div>
  );
};

const MemoContactRow = React.memo(
  ContactRow,
  (prev, next) =>
    prev.person.id === next.person.id && prev.removing === next.removing,
);

interface ContactPersonListProps {
  contactPersons: ContactPersonListItemDto[];
  firmId?: number | null;
  onUpdated?: () => void;
}

export interface ContactPersonListHandle {
  openCreate: () => void;
}

export const ContactPersonList = forwardRef<
  ContactPersonListHandle,
  ContactPersonListProps
>(({ contactPersons, firmId, onUpdated }, ref) => {
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

  useImperativeHandle(ref, () => ({
    openCreate: openCreateDialog,
  }));

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
    <div className="flex flex-col h-full">
      {error && <div className="px-3 py-1 text-sm text-red-600">{error}</div>}

      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No contact persons available.
          </div>
        ) : (
          contacts.map((person) => (
            <MemoContactRow
              key={person.id}
              person={person}
              onClick={openEditDialog}
              onRemove={handleDelete}
              removing={deletingContactId === person.id}
            />
          ))
        )}
      </div>

      <CreateOrEditContactDialog
        open={dialogOpen}
        onClose={closeDialog}
        firmId={firmId ?? 0}
        contactId={activeContactId}
        onSaved={handleSaved}
      />
    </div>
  );
});
