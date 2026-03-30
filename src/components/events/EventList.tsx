import React, { useState } from "react";
import AddButton from "../common/buttons/AddButton";
import { CreateEventWithNotesDialog } from "./CreateEventWithNotesDialog";

// Returns a color class based on event state
function stateColorClass(state: string | null): string {
  const s = state?.toLowerCase() ?? "";
  if (s.includes("done") || s.includes("complet") || s.includes("held"))
    return "text-green-500";
  if (s.includes("cancel") || s.includes("miss")) return "text-red-500";
  if (s.includes("progress") || s.includes("ongoing")) return "text-orange-500";
  if (s.includes("plan") || s.includes("schedul") || s.includes("upcoming"))
    return "text-blue-500";
  return "text-gray-400";
}

// Icon that represents the event TYPE; color encodes the event STATE
const EventTypeIcon: React.FC<{
  type: string | null;
  state: string | null;
}> = ({ type, state }) => {
  const colorClass = stateColorClass(state);
  const t = type?.toLowerCase() ?? "";

  // Phone / Call
  if (t.includes("call") || t.includes("phone")) {
    return (
      <svg
        className={`w-4 h-4 ${colorClass} shrink-0`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>{type ?? "Call"}</title>
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    );
  }

  // Email / Message
  if (t.includes("email") || t.includes("mail") || t.includes("message")) {
    return (
      <svg
        className={`w-4 h-4 ${colorClass} shrink-0`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>{type ?? "Email"}</title>
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    );
  }

  // Demo / Presentation
  if (t.includes("demo") || t.includes("present") || t.includes("webinar")) {
    return (
      <svg
        className={`w-4 h-4 ${colorClass} shrink-0`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>{type ?? "Demo"}</title>
        <path
          fillRule="evenodd"
          d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm7 7a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
        <path d="M7 17h6a1 1 0 000-2H7a1 1 0 000 2z" />
      </svg>
    );
  }

  // Meeting / Visit
  if (
    t.includes("meet") ||
    t.includes("visit") ||
    t.includes("lunch") ||
    t.includes("dinner")
  ) {
    return (
      <svg
        className={`w-4 h-4 ${colorClass} shrink-0`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>{type ?? "Meeting"}</title>
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
      </svg>
    );
  }

  // Follow-up / Task
  if (t.includes("follow") || t.includes("task") || t.includes("action")) {
    return (
      <svg
        className={`w-4 h-4 ${colorClass} shrink-0`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>{type ?? "Follow-up"}</title>
        <path
          fillRule="evenodd"
          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  // Default — calendar icon
  return (
    <svg
      className={`w-4 h-4 ${colorClass} shrink-0`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <title>{type ?? "Event"}</title>
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  );
};

// Memoized event row
const EventRow: React.FC<{
  event: any;
  isSelected: boolean;
  onClick: (id: number) => void;
}> = ({ event, isSelected, onClick }) => {
  const dateStr = event.date ? new Date(event.date).toLocaleDateString() : "";
  const bottom = [dateStr, event.contactPerson].filter(Boolean).join(" · ");

  return (
    <div
      data-event-id={event.id}
      onClick={() => onClick(event.id)}
      role="button"
      className={`px-3 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <EventTypeIcon type={event.type} state={event.state} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {event.topic || event.type || "Event"}
          </div>
          {bottom && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {bottom}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MemoEventRow = React.memo(
  EventRow,
  (prev, next) =>
    prev.event.id === next.event.id && prev.isSelected === next.isSelected,
);

interface EventListProps {
  dealId: number;
  events: any[];
  selectedEventId?: number | null;
  onSelectEvent?: (id: number) => void;
  onUpdated?: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  dealId,
  events,
  selectedEventId = null,
  onSelectEvent,
  onUpdated,
}) => {
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const handleAddEventClick = () => {
    setEditingEventId(null);
    setEventDialogOpen(true);
  };

  const handleRowClick = (id: number) => {
    setEditingEventId(id);
    setEventDialogOpen(true);
    onSelectEvent?.(id);
  };

  const handleEventDialogClose = () => {
    setEventDialogOpen(false);
    setEditingEventId(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Events
        </h2>
        <AddButton onClick={handleAddEventClick} />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No events yet.
          </div>
        ) : (
          events.map((event: any) => (
            <MemoEventRow
              key={event.id}
              event={event}
              isSelected={event.id === selectedEventId}
              onClick={handleRowClick}
            />
          ))
        )}
      </div>

      <CreateEventWithNotesDialog
        open={eventDialogOpen}
        onClose={handleEventDialogClose}
        onSaved={onUpdated}
        dealId={dealId}
        eventId={editingEventId}
      />
    </div>
  );
};
