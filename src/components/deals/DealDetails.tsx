import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchDealWithDependents,
  selectCurrentDealWithDependents,
  selectDealsLoading,
} from "../../features/deals/dealsSlice";
import EditButton from "../common/buttons/EditButton";
import EditableStringField from "../common/inputs/EditableStringField";
import AutocompleteEditableStringField from "../common/inputs/AutocompleteEditableStringField";
import EditableMultilineStringField from "../common/inputs/EditableMultilineStringField";
import { CreateOrUpdateDealDialog } from "./CreateOrUpdateDealDialog";
import AddButton from "../common/buttons/AddButton";
import { selectDealLoading } from "../../features/deals/dealsSlice";
import { getCachedDealStatuses } from "../../features/deals/dealsAPI";
import AutocompleteStringListEditor from "../common/inputs/AutocompleteStringListEditor";
import { getExistingTags } from "../../features/dealTags/dealTagsAPI";

interface DealDetailsProps {
  dealId: number | null;
}

export const DealDetails: React.FC<DealDetailsProps> = ({ dealId }) => {
  const dispatch = useAppDispatch();
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const deal = useAppSelector(selectCurrentDealWithDependents);
  const loading = useAppSelector(selectDealLoading);
  const [showContactPersons, setShowContactPersons] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCachedDealStatuses().then((opts) => {
      if (mounted) setStatusOptions(opts || []);
      console.log;
    });
    getExistingTags().then((opts) => {
      if (mounted) setTagsOptions(opts || []);
      console.log;
    });
    return () => {
      mounted = false;
    };
  }, []);

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

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  const handleDealUpdated = () => {
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
          <div className="mb-2">
            <EditableStringField
              value={deal.name}
              entity="Deal"
              field="name"
              id={deal.id}
              validation="NotEmpty"
              onUpdated={handleDealUpdated}
              className="text-3xl font-bold text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Tags */}
          <div className="mb-1">
            <AutocompleteStringListEditor
              value={deal.tags ? deal.tags.map((t: any) => t.tag) : []}
              suggestions={tagsOptions} // Provide tag suggestions if available
              onChange={() => {}}
              className="flex flex-wrap gap-1"
              label="Tags"
            />
          </div>

          <EditableStringField
            value={deal.url}
            entity="Deal"
            field="url"
            id={deal.id}
            validation="Url"
            label="Website"
            onUpdated={handleDealUpdated}
            className="mb-2"
          />
          <AutocompleteEditableStringField
            value={deal.status}
            entity="Deal"
            field="status"
            id={deal.id}
            validation="None"
            label="Status"
            onUpdated={handleDealUpdated}
            options={Array.isArray(statusOptions) ? statusOptions : []}
            className="mb-2"
          />
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
        <div className="mb-6">
          <EditableMultilineStringField
            value={deal.description}
            entity="Deal"
            field="description"
            id={deal.id}
            validation="None"
            label="Description"
            onUpdated={handleDealUpdated}
            rows={5}
          />
        </div>

        {/* Details Grid */}
        <div className="mb-6">
          <EditableStringField
            value={deal.industry}
            entity="Deal"
            field="industry"
            id={deal.id}
            validation="None"
            label="Industry"
            onUpdated={handleDealUpdated}
          />
        </div>

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
