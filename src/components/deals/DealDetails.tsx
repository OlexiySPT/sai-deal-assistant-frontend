import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchDealWithDependents,
  selectCurrentDealWithDependents,
  selectDealsLoading,
} from "../../features/deals/dealsSlice";
import EditButton from "../common/buttons/EditButton";
import EditableStringField from "../common/inputs/EditableStringField";
import EditableNumberField from "../common/inputs/EditableNumberField";
import AutocompleteEditableStringField from "../common/inputs/AutocompleteEditableStringField";
import EditableMultilineStringField from "../common/inputs/EditableMultilineStringField";
import { CreateDealDialog } from "./CreateDealDialog";
import AddButton from "../common/buttons/AddButton";
import { selectDealLoading } from "../../features/deals/dealsSlice";
import { getCachedDealStatuses } from "../../features/deals/dealsAPI";
import AutocompleteStringListEditor from "../common/inputs/AutocompleteStringListEditor";
import {
  addDealTag,
  deleteDealTag,
  getExistingTags,
} from "../../features/dealTags/dealTagsAPI";
import { EnumValue, getEnumValues } from "../../features/enums/enumsAPI";
import DropdownEditableField from "../common/inputs/DropdownEditableField";
import EditableDateField from "../common/inputs/EditableDateField";

interface DealDetailsProps {
  dealId: number | null;
}

export const DealDetails: React.FC<DealDetailsProps> = ({ dealId }) => {
  const dispatch = useAppDispatch();
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [typesOptions, setTypesOptions] = useState<any[]>([]);
  const [stateOptions, setStateOptions] = useState<any[]>([]);
  const [amountTypeOptions, setAmountTypeOptions] = useState<any[]>([]);
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const deal = useAppSelector(selectCurrentDealWithDependents);
  const loading = useAppSelector(selectDealLoading);
  const [showContactPersons, setShowContactPersons] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Description");

  useEffect(() => {
    let mounted = true;
    getCachedDealStatuses().then((opts) => {
      if (mounted) setStatusOptions(opts || []);
    });
    getEnumValues("dealType").then((opts) => {
      if (mounted) setTypesOptions(opts || []);
    });
    getEnumValues("dealState").then((opts) => {
      if (mounted) setStateOptions(opts || []);
    });
    getEnumValues("amountType").then((opts) => {
      if (mounted) setAmountTypeOptions(opts || []);
    });
    getExistingTags().then((opts) => {
      if (mounted) setTagsOptions(opts || []);
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
      className="h-full p-6 bg-white dark:bg-gray-800 overflow-y-auto"
    >
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-[70%_28%] gap-4">
        <div>
          <EditableStringField
            value={deal.name}
            entity="Deal"
            field="name"
            id={deal.id}
            validation="NotEmpty"
            onUpdated={handleDealUpdated}
            size="lg"
          />
        </div>
        <div>
          <EditableStringField
            value={deal.company}
            entity="Deal"
            field="company"
            id={deal.id}
            validation="NotEmpty"
            onUpdated={handleDealUpdated}
            size="lg"
          />
        </div>
      </div>
      <div className="flex gap-4 justify-start flex-wrap">
        <EditableStringField
          value={deal.url}
          entity="Deal"
          field="url"
          id={deal.id}
          validation="Url"
          label="Website"
          onUpdated={handleDealUpdated}
          size="sm"
          width="50ch"
        />
        <EditableDateField
          value={deal.startDate}
          entity="Deal"
          field="startDate"
          id={deal.id}
          validation="None"
          label="Start Date"
          onUpdated={handleDealUpdated}
          width="20ch"
        />
      </div>
      <div className="flex gap-4 justify-start flex-wrap">
        <EditableNumberField
          value={deal.proposalAmount}
          entity="Deal"
          field="proposalAmount"
          id={deal.id}
          validation="None"
          label="Amount"
          onUpdated={handleDealUpdated}
          decimalAccuracy={0}
          thousandsSeparator={true}
          width="16ch"
        />
        <EditableStringField
          value={deal.currencyCode}
          entity="Deal"
          field="currencyCode"
          id={deal.id}
          validation="NotEmpty"
          onUpdated={handleDealUpdated}
          width="14ch"
        />
        <DropdownEditableField
          value={deal.amountTypeId}
          entity="Deal"
          field="amountTypeId"
          id={deal.id}
          validation="NotNull"
          label=""
          width="18ch"
          onUpdated={handleDealUpdated}
          options={
            Array.isArray(amountTypeOptions)
              ? amountTypeOptions.map((opt) => ({
                  id: opt.Id,
                  value: opt.Type,
                }))
              : []
          }
        />
        <EditableNumberField
          value={deal.minClientAmount}
          entity="Deal"
          field="minClientAmount"
          id={deal.id}
          validation="None"
          label="Client min"
          onUpdated={handleDealUpdated}
          decimalAccuracy={0}
          thousandsSeparator={true}
          width="16ch"
        />
        <EditableNumberField
          value={deal.maxClientAmount}
          entity="Deal"
          field="maxClientAmount"
          id={deal.id}
          validation="None"
          label="max"
          onUpdated={handleDealUpdated}
          decimalAccuracy={0}
          thousandsSeparator={true}
          width="16ch"
        />
      </div>
      <div className="flex gap-4 justify-start flex-wrap">
        <AutocompleteEditableStringField
          value={deal.status}
          entity="Deal"
          field="status"
          id={deal.id}
          validation="None"
          label="Status"
          onUpdated={handleDealUpdated}
          options={Array.isArray(statusOptions) ? statusOptions : []}
          width="24ch"
        />
      </div>
      <div className="flex gap-4 justify-start flex-wrap">
        <EditableStringField
          value={deal.industry}
          entity="Deal"
          field="industry"
          id={deal.id}
          validation="None"
          label="Industry"
          onUpdated={handleDealUpdated}
          width="24ch"
        />
      </div>
      <div className="flex gap-4 justify-start flex-wrap">
        <DropdownEditableField
          value={deal.typeId}
          entity="Deal"
          field="typeId"
          id={deal.id}
          validation="NotNull"
          label="Type"
          onUpdated={handleDealUpdated}
          size="sm"
          options={
            Array.isArray(typesOptions)
              ? typesOptions.map((opt) => ({
                  id: opt.Id,
                  value: opt.Type,
                }))
              : []
          }
          width="32ch"
        />
        <DropdownEditableField
          value={deal.stateId}
          entity="Deal"
          field="stateId"
          id={deal.id}
          validation="NotNull"
          label="State"
          onUpdated={handleDealUpdated}
          size="sm"
          options={
            Array.isArray(stateOptions)
              ? stateOptions.map((opt) => ({
                  id: opt.Id,
                  value: opt.State,
                }))
              : []
          }
          width="22ch"
        />
      </div>
      {/* Tags */}
      <div className="mb-1">
        <AutocompleteStringListEditor
          value={deal.tags ? deal.tags.map((t: any) => t.tag) : []}
          suggestions={tagsOptions}
          editMode={true}
          onAdd={(tag) => addDealTag({ dealId: deal.id, tag })}
          onDelete={(tag) => deleteDealTag({ dealId: deal.id, tag })}
          className="flex flex-wrap gap-1"
          label="Tags"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-300 dark:border-gray-600 mb-4">
          {["Description", "AI Information", "Events", "Contact Persons"].map(
            (tab) => (
              <button
                key={tab}
                className={`px-4 py-2 -mb-px font-medium border-b-2 transition-colors duration-200 focus:outline-none ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-600 dark:text-gray-300 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ),
          )}
        </div>
        <div>
          {activeTab === "Description" && (
            <div>
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
            </div>
          )}
          {activeTab === "AI Information" && (
            <div>
              {deal.aiSearchInfo || deal.aiBriefDescription ? (
                <div>
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
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  No AI information available.
                </div>
              )}
            </div>
          )}
          {activeTab === "Events" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Events
                </h2>
                <AddButton />
              </div>
              <div className="space-y-3">
                {deal.events?.length > 0 ? (
                  deal.events.map((event: any) => (
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
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    No events available.
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "Contact Persons" && (
            <div>
              {deal.contactPersons && deal.contactPersons.length > 0 ? (
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
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  No contact persons available.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <CreateDealDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onCreated={handleDealUpdated}
        dealId={dealId}
      />
    </div>
  );
};
