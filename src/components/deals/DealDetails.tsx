import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchDealWithDependents,
  selectCurrentDealWithDependents,
  selectDealsLoading,
} from "../../features/deals/dealsSlice";
import EditButton from "../common/EditButton";
import { CreateOrUpdateDealDialog } from "./CreateOrUpdateDealDialog";
import AddButton from "../common/AddButton";

interface DealDetailsProps {
  dealId: number | null;
}

export const DealDetails: React.FC<DealDetailsProps> = ({ dealId }) => {
  const dispatch = useAppDispatch();
  const deal = useAppSelector(selectCurrentDealWithDependents);
  const loading = useAppSelector(selectDealsLoading);
  const [showContactPersons, setShowContactPersons] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMoveListener = (e: MouseEvent) => {
      if (isDragging) {
        const container = document.getElementById("details-container");
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const newWidth =
            ((containerRect.right - e.clientX) / containerRect.width) * 100;
          setRightPanelWidth(Math.min(Math.max(newWidth, 20), 60));
        }
      }
    };

    const handleMouseUpListener = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMoveListener);
      document.addEventListener("mouseup", handleMouseUpListener);
      return () => {
        document.removeEventListener("mousemove", handleMouseMoveListener);
        document.removeEventListener("mouseup", handleMouseUpListener);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (dealId) {
      dispatch(fetchDealWithDependents(dealId));
    }
  }, [dispatch, dealId]);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  const handleDealUpdated = () => {
    setEditDialogOpen(false);
    if (dealId) {
      dispatch(fetchDealWithDependents(dealId));
    }
  };

  if (!dealId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a deal to view details
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Deal not found
      </div>
    );
  }

  return (
    <div
      id="details-container"
      className="h-full md:flex md:flex-row p-6 bg-white dark:bg-gray-800 overflow-y-auto md:overflow-hidden"
    >
      {/* Left Column */}
      <div
        style={{
          width: isMobile ? "100%" : `${100 - rightPanelWidth}%`,
        }}
        className="md:overflow-y-auto md:pr-2"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {deal.name || "Untitled Deal"}
            <EditButton onClick={handleEditClick} />
          </h1>

          {/* Tags */}
          <div className="mb-1">
            <div className="flex flex-wrap gap-1">
              <span>Tags:</span>
              {deal.tags?.map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-3 py-0 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm"
                >
                  {tag.tag}
                </span>
              ))}
              <EditButton />
            </div>
          </div>

          {deal.url && (
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-2 block"
            >
              {deal.url}
            </a>
          )}
          <div className="flex gap-2">
            {deal.type && (
              <span className="px-3 py-0 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm">
                {deal.type}
              </span>
            )}
            {deal.state && (
              <span className="px-3 py-0 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm">
                {deal.state}
              </span>
            )}
            {deal.status && (
              <span className="px-3 py-0 rounded-full bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">
                {deal.status}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {deal.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {deal.description}
            </p>
          </div>
        )}

        {/* Details Grid */}
        {deal.industry && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Industry
            </h3>
            <p className="text-gray-900 dark:text-gray-100">{deal.industry}</p>
          </div>
        )}

        {/* AI Information */}
        {(deal.aiSearchInfo || deal.aiBriefDescription) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              AI Information
            </h2>
            {deal.aiBriefDescription && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Brief Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {deal.aiBriefDescription}
                </p>
              </div>
            )}
            {deal.aiSearchInfo && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Search Info
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {deal.aiSearchInfo}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contact Persons - Collapsible (Desktop only) */}
        {!isMobile && deal.contactPersons && deal.contactPersons.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
              onClick={() => setShowContactPersons(!showContactPersons)}
            >
              <span className="mr-2">{showContactPersons ? "▼" : "►"}</span>
              Contact Persons
            </h2>
            {showContactPersons && (
              <div className="space-y-2">
                {deal.contactPersons.map((person: any) => (
                  <div
                    key={person.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded"
                  >
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Splitter */}
      <div
        className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 cursor-col-resize flex-shrink-0 hidden md:block"
        onMouseDown={handleMouseDown}
      />

      {/* Right Column */}
      <div
        style={{
          width: isMobile ? "100%" : `${rightPanelWidth}%`,
        }}
        className={`${isMobile ? "" : "overflow-y-auto"} md:pl-2 mt-6 md:mt-0`}
      >
        {/* Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Events
            </h2>
            <AddButton />
          </div>
          <div className="space-y-3">
            {deal.events?.map((event: any) => (
              <div
                key={event.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {event.type || "Event"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
                {event.agenda && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>Agenda:</strong> {event.agenda}
                  </div>
                )}
                {event.result && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>Result:</strong> {event.result}
                  </div>
                )}
                {event.contactPerson && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Contact: {event.contactPerson}
                  </div>
                )}
                {event.notes && event.notes.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                    {event.notes.map((note: any) => (
                      <div
                        key={note.id}
                        className="text-sm text-gray-700 dark:text-gray-300 mb-1"
                      >
                        • {note.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Persons - Mobile only (below events) */}
        {isMobile && deal.contactPersons && deal.contactPersons.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
              onClick={() => setShowContactPersons(!showContactPersons)}
            >
              <span className="mr-2">{showContactPersons ? "▼" : "►"}</span>
              Contact Persons
            </h2>
            {showContactPersons && (
              <div className="space-y-2">
                {deal.contactPersons.map((person: any) => (
                  <div
                    key={person.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded"
                  >
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <CreateOrUpdateDealDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onCreated={handleDealUpdated}
        dealId={dealId}
      />
    </div>
  );
};
