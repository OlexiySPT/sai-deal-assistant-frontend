import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker-dark.css";
import { button } from "../cva/button-cva";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Dialog } from "../common/Dialog";
import {
  createEvent,
  getEventById,
  updateEvent,
} from "../../features/events/eventsAPI";
import { getContactPersons } from "../../features/contactPersons/contactPersonsAPI";
import {
  loadAllEnums,
  selectEnumValues,
} from "../../features/enums/enumsSlice";
import AddButton from "../common/buttons/AddButton";
import EditButton from "../common/buttons/EditButton";
import { CreateOrEditContactDialog } from "../contacts/CreateOrEditContactDialog";

interface CreateEventWithNotesDialogProps {
  open: boolean;
  onClose: () => void;
  dealId: number;
  firmId?: number | null;
  eventId?: number | null;
  onSaved?: () => void;
}

function toLocalDateTimeIso(value?: string | null): string {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

export const CreateEventWithNotesDialog: React.FC<
  CreateEventWithNotesDialogProps
> = ({ open, onClose, dealId, firmId, eventId, onSaved }) => {
  const dispatch = useAppDispatch();
  const eventTypes = useAppSelector(selectEnumValues("eventtype"));
  const eventStates = useAppSelector(selectEnumValues("eventstate"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contactPersons, setContactPersons] = useState<any[]>([]);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString(),
    topic: "",
    agenda: "",
    result: "",
    contactPersonId: "",
    typeId: 0,
    stateId: 0,
  });

  useEffect(() => {
    dispatch(loadAllEnums());
  }, [dispatch]);

  const loadContactPersons = async (preferredId?: number) => {
    if (!firmId) {
      setContactPersons([]);
      return;
    }

    try {
      const res = await getContactPersons(firmId);
      const items = res.items || [];
      setContactPersons(items);
      if (preferredId) {
        setForm((prev) => ({ ...prev, contactPersonId: String(preferredId) }));
      }
    } catch {
      setContactPersons([]);
    }
  };

  useEffect(() => {
    if (!open) return;

    loadContactPersons();
  }, [firmId, open]);

  useEffect(() => {
    if (!open) return;

    if (!eventId) {
      setForm({
        date: new Date().toISOString(),
        topic: "",
        agenda: "",
        result: "",
        contactPersonId: "",
        typeId: 0,
        stateId: 0,
      });
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    getEventById(eventId)
      .then((eventDto) => {
        setForm({
          date: toLocalDateTimeIso(eventDto.date),
          topic: eventDto.topic || "",
          agenda: eventDto.agenda || "",
          result: eventDto.result || "",
          contactPersonId:
            eventDto.contactPersonId !== null
              ? String(eventDto.contactPersonId)
              : "",
          typeId: eventDto.typeId || 0,
          stateId: eventDto.stateId || 0,
        });
      })
      .catch(() => {
        setError("Failed to load event details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId, open]);

  const onFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "typeId" || name === "stateId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payloadBase = {
        date: form.date,
        topic: form.topic.trim() ? form.topic.trim() : null,
        pos: 0,
        agenda: form.agenda.trim() ? form.agenda.trim() : null,
        result: form.result.trim() ? form.result.trim() : null,
        contactPersonId: form.contactPersonId
          ? Number(form.contactPersonId)
          : null,
        typeId: form.typeId,
        stateId: form.stateId,
      };

      if (eventId) {
        await updateEvent(eventId, {
          id: eventId,
          ...payloadBase,
        });
      } else {
        await createEvent({
          id: 0,
          ...payloadBase,
          dealId,
        });
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const openCreateContactDialog = () => {
    setEditingContactId(null);
    setContactDialogOpen(true);
  };

  const openEditContactDialog = () => {
    const selectedId = form.contactPersonId ? Number(form.contactPersonId) : 0;
    if (!selectedId) return;
    setEditingContactId(selectedId);
    setContactDialogOpen(true);
  };

  const dateValue = form.date ? new Date(form.date) : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={eventId ? "Edit Event" : "Create Event"}
      dialogClassName="max-w-4xl"
    >
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="w-32 text-sm font-medium">Date</label>
            <DatePicker
              selected={dateValue}
              onChange={(date: Date | null) => {
                setForm((prev) => ({
                  ...prev,
                  date: date ? date.toISOString() : "",
                }));
              }}
              showTimeSelect
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              timeFormat="HH:mm"
              className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              placeholderText="Select date & time"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32 text-sm font-medium">Topic</label>
            <input
              type="text"
              name="topic"
              value={form.topic}
              onChange={onFieldChange}
              className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              placeholder="Topic"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32 text-sm font-medium">Type</label>
            <select
              name="typeId"
              value={form.typeId}
              onChange={onFieldChange}
              className="flex-1 border rounded px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              required
            >
              <option value={0} disabled>
                Select type...
              </option>
              {eventTypes.map((type: any) => (
                <option key={type.Id} value={type.Id}>
                  {type.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32 text-sm font-medium">State</label>
            <select
              name="stateId"
              value={form.stateId}
              onChange={onFieldChange}
              className="flex-1 border rounded px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              required
            >
              <option value={0} disabled>
                Select state...
              </option>
              {eventStates.map((state: any) => (
                <option key={state.Id} value={state.Id}>
                  {state.State}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32 text-sm font-medium">Contact</label>
            <div className="flex-1 flex items-center gap-2">
              <select
                name="contactPersonId"
                value={form.contactPersonId}
                onChange={onFieldChange}
                className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              >
                <option value="">None</option>
                {contactPersons.map((cp: any) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.name || `Contact ${cp.id}`}
                  </option>
                ))}
              </select>
              <AddButton onClick={openCreateContactDialog} />
              <EditButton
                onClick={openEditContactDialog}
                disabled={!firmId || !form.contactPersonId}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Agenda</label>
            <textarea
              name="agenda"
              value={form.agenda}
              onChange={onFieldChange}
              className="border rounded px-2 py-1 min-h-[80px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Result</label>
            <textarea
              name="result"
              value={form.result}
              onChange={onFieldChange}
              className="border rounded px-2 py-1 min-h-[80px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col items-start gap-2 mt-2">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className={`${button({ colorClass: "blue", size: "md" })} !aspect-auto w-auto h-auto px-4 py-2 !rounded`}
            disabled={loading}
          >
            {loading ? "Saving..." : eventId ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>

      <CreateOrEditContactDialog
        open={contactDialogOpen}
        onClose={() => {
          setContactDialogOpen(false);
          setEditingContactId(null);
        }}
        firmId={firmId || 0}
        contactId={editingContactId}
        onSaved={(savedContactId) => {
          loadContactPersons(savedContactId);
        }}
      />
    </Dialog>
  );
};
