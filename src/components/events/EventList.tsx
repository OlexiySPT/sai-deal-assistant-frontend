import React, { useState, useImperativeHandle, forwardRef } from "react";
import CancelButton from "../common/buttons/CancelButton";
import { CreateEventWithNotesDialog } from "./CreateEventWithNotesDialog";
import { deleteEvent } from "../../features/events/eventsAPI";

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

// Memoized event row with remove button
const EventRow: React.FC<{
  event: any;
  isSelected: boolean;
  onClick: (id: number) => void;
  onRemove: (id: number) => void;
  removing: boolean;
}> = ({ event, isSelected, onClick, onRemove, removing }) => {
  const dateStr = event.date ? new Date(event.date).toLocaleDateString() : "";

  return (
    <div
      data-event-id={event.id}
      className={`group px-3 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
          : ""
      }`}
    >
      <div
        className="flex items-center gap-2 flex-1 min-w-0"
        onClick={() => onClick(event.id)}
      >
        <EventTypeIcon type={event.type} state={event.state} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {event.topic || event.type || "Event"}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {dateStr && <span>{dateStr}</span>}
            {event.contactPerson && (
              <span className="flex items-center gap-0.5 truncate">
                <svg
                  className="w-3 h-3 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                {event.contactPerson}
              </span>
            )}
          </div>
        </div>
      </div>
      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CancelButton
          size="xs"
          disabled={removing}
          title="Remove event"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(event.id);
          }}
        />
      </span>
    </div>
  );
};

const MemoEventRow = React.memo(
  EventRow,
  (prev, next) =>
    prev.event.id === next.event.id &&
    prev.isSelected === next.isSelected &&
    prev.removing === next.removing,
);

interface EventListProps {
  dealId: number;
  firmId?: number | null;
  events: any[];
  selectedEventId?: number | null;
  onSelectEvent?: (id: number) => void;
  onUpdated?: () => void;
}

export interface EventListHandle {
  openCreate: () => void;
}

export const EventList = forwardRef<EventListHandle, EventListProps>(
  (
    {
      dealId,
      firmId,
      events,
      selectedEventId = null,
      onSelectEvent,
      onUpdated,
    },
    ref,
  ) => {
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const handleAddEventClick = () => {
      setEditingEventId(null);
      setEventDialogOpen(true);
    };

    useImperativeHandle(ref, () => ({
      openCreate: handleAddEventClick,
    }));

    const handleRowClick = (id: number) => {
      setEditingEventId(id);
      setEventDialogOpen(true);
      onSelectEvent?.(id);
    };

    const handleEventDialogClose = () => {
      setEventDialogOpen(false);
      setEditingEventId(null);
    };

    const handleRemove = async (id: number) => {
      if (!window.confirm("Are you sure you want to remove this event?"))
        return;
      setRemovingId(id);
      try {
        await deleteEvent(id);
        onUpdated?.();
      } finally {
        setRemovingId(null);
      }
    };

    return (
      <div className="flex flex-col h-full">
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
                onRemove={handleRemove}
                removing={removingId === event.id}
              />
            ))
          )}
        </div>

        <CreateEventWithNotesDialog
          open={eventDialogOpen}
          onClose={handleEventDialogClose}
          onSaved={onUpdated}
          dealId={dealId}
          firmId={firmId}
          eventId={editingEventId}
        />
      </div>
    );
  },
);
