import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchDealWithDependents,
  refreshDealListItem,
  selectCurrentDealWithDependents,
} from "../../features/deals/dealsSlice";
import EditableStringField from "../common/inputs/EditableStringField";
import AutocompleteEditableStringField from "../common/inputs/AutocompleteEditableStringField";
import AutocompleteDynamicDropDown, {
  DynamicDropdownActionArgs,
} from "../common/inputs/AutocompleteDynamicDropDown";
import EditableMultilineStringField from "../common/inputs/EditableMultilineStringField";
import { CreateDealDialog } from "./CreateDealDialog";
import { selectDealLoading } from "../../features/deals/dealsSlice";
import { getCachedDealStatuses } from "../../features/deals/dealsAPI";
import AutocompleteStringListEditor from "../common/inputs/AutocompleteStringListEditor";
import {
  addDealTag,
  deleteDealTag,
  getExistingTags,
} from "../../features/dealTags/dealTagsAPI";
import { getEnumValues } from "../../features/enums/enumsAPI";
import DropdownEditableField from "../common/inputs/DropdownEditableField";
import EditableDateField from "../common/inputs/EditableDateField";
import EditableMultiFieldGroup from "../common/inputs/EditableMultiFieldGroup";
import { getFirmsDropdown } from "../../features/firms/firmsAPI";
import {
  ContactPersonList,
  ContactPersonListHandle,
} from "../contacts/ContactPersonList";
import { EventList, EventListHandle } from "../events/EventList";
import AddButton from "../common/buttons/AddButton";
import { CreateOrEditFirmDialog } from "../firms/CreateOrEditFirmDialog";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [firmDialogOpen, setFirmDialogOpen] = useState(false);
  const [activeFirmId, setActiveFirmId] = useState<number | null>(null);
  const [initialFirmName, setInitialFirmName] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Description");
  const eventListRef = useRef<EventListHandle>(null);
  const contactListRef = useRef<ContactPersonListHandle>(null);

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

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  const handleDealUpdated = () => {
    if (dealId) {
      dispatch(fetchDealWithDependents(dealId));
      dispatch(refreshDealListItem(dealId));
    }
  };

  const handleAddFirmRequested = (_args: DynamicDropdownActionArgs) => {
    setActiveFirmId(null);
    setInitialFirmName("");
    setFirmDialogOpen(true);
  };

  const handleEditFirmRequested = ({
    id,
    value,
  }: DynamicDropdownActionArgs) => {
    if (!id) return;
    setActiveFirmId(id);
    setInitialFirmName(value);
    setFirmDialogOpen(true);
  };

  const handleFirmDialogClose = () => {
    setFirmDialogOpen(false);
    setActiveFirmId(null);
    setInitialFirmName("");
  };

  const handleFirmSaved = (_savedFirmId: number) => {
    handleFirmDialogClose();
    handleDealUpdated();
  };

  if (!dealId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a deal to view details
      </div>
    );
  }

  if (loading && !deal) {
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

  const events = deal.events || [];

  return (
    <div
      id="details-container"
      className="h-full flex flex-col bg-white dark:bg-gray-800"
    >
      {/* Header */}
      <div className="shrink-0 px-3 py-1">
        <div className="grid grid-cols-1 md:grid-cols-[18%_80%] gap-4">
          <div>
            <AutocompleteDynamicDropDown
              value={deal.firm?.name}
              entity="Firm"
              field="name"
              id={deal.firmId}
              validation="NotEmpty"
              onUpdated={handleDealUpdated}
              size="lg"
              loadOptions={getFirmsDropdown}
              showAllOnEmpty={false}
              pageSize={5}
              throttleMs={1000}
              width="100%"
              onAddRequested={handleAddFirmRequested}
              onEditRequested={handleEditFirmRequested}
            />
          </div>
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
          <EditableMultiFieldGroup
            entity="Deal"
            id={deal.id}
            onUpdated={handleDealUpdated}
            fields={[
              {
                field: "proposalAmount",
                type: "number",
                value: deal.proposalAmount,
                label: "Amount",
                width: "16ch",
                decimalAccuracy: 0,
                thousandsSeparator: true,
              },
              {
                field: "currencyCode",
                type: "string",
                value: deal.currencyCode,
                width: "14ch",
              },
              {
                field: "amountTypeId",
                type: "dropdown",
                value: deal.amountTypeId,
                width: "18ch",
                options: Array.isArray(amountTypeOptions)
                  ? amountTypeOptions.map((opt) => ({
                      id: opt.Id,
                      value: opt.Type,
                    }))
                  : [],
              },
              {
                field: "minClientAmount",
                type: "number",
                value: deal.minClientAmount,
                label: "Client min",
                width: "16ch",
                decimalAccuracy: 0,
                thousandsSeparator: true,
              },
              {
                field: "maxClientAmount",
                type: "number",
                value: deal.maxClientAmount,
                label: "max",
                width: "16ch",
                decimalAccuracy: 0,
                thousandsSeparator: true,
              },
            ]}
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
      </div>

      {/* Tabs */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="shrink-0 px-3 flex items-center border-b border-gray-300 dark:border-gray-600">
          {[
            "Description",
            "AI Information",
            "Events",
            "Firm Contact Persons",
          ].map((tab) => (
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
          ))}
          {(activeTab === "Events" || activeTab === "Firm Contact Persons") && (
            <div className="ml-auto">
              <AddButton
                size="sm"
                onClick={() => {
                  if (activeTab === "Events")
                    eventListRef.current?.openCreate();
                  else contactListRef.current?.openCreate();
                }}
              />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {activeTab === "Description" && (
            <div>
              <div className="mb-6">
                <EditableMultilineStringField
                  value={deal.description}
                  entity="Deal"
                  field="description"
                  id={deal.id}
                  validation="None"
                  label=""
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
            <EventList
              ref={eventListRef}
              dealId={deal.id}
              firmId={deal.firmId}
              events={events}
              onUpdated={handleDealUpdated}
            />
          )}
          {activeTab === "Firm Contact Persons" && (
            <ContactPersonList
              ref={contactListRef}
              contactPersons={deal.firm?.contactPersons || []}
              firmId={deal.firmId}
              onUpdated={handleDealUpdated}
            />
          )}
        </div>
      </div>
      <CreateDealDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onCreated={handleDealUpdated}
        dealId={dealId}
      />
      <CreateOrEditFirmDialog
        open={firmDialogOpen}
        onClose={handleFirmDialogClose}
        firmId={activeFirmId}
        initialName={initialFirmName}
        onSaved={handleFirmSaved}
      />
    </div>
  );
};
