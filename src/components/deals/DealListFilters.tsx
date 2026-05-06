import React, { useState } from "react";
import { MultiSelect } from "../common/inputs/MultiSelect";
import AutocompleteInput from "../common/inputs/AutocompleteInput";
import DatePicker from "../common/inputs/DatePicker";
import AddButton from "../common/buttons/AddButton";
import Button from "../common/buttons/Button";
import { MakeMagicButton } from "../common/buttons/MakeMagicButton";

interface DealListFiltersProps {
  dealStates: any[];
  dealTypes: any[];
  firmNameDraft: string;
  contactPersonNameDraft: string;
  industryDraft: string;
  statusDraft: string;
  selectedStates: number[];
  selectedTypes: number[];
  eventStartDate: string | null;
  eventEndDate: string | null;
  industryOptions: string[];
  statuses: string[];
  onFirmNameChange: (value: string) => void;
  onContactPersonNameChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onIndustrySelect: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStatusSelect: (value: string) => void;
  onSelectedStatesChange: (values: number[]) => void;
  onSelectedTypesChange: (values: number[]) => void;
  onEventStartDateChange: (value: string | null) => void;
  onEventEndDateChange: (value: string | null) => void;
  onAdd: () => void;
  onAddMagic: () => void;
  onClearAll: () => void;
}

export const DealListFilters: React.FC<DealListFiltersProps> = ({
  dealStates,
  dealTypes,
  firmNameDraft,
  contactPersonNameDraft,
  industryDraft,
  statusDraft,
  selectedStates,
  selectedTypes,
  eventStartDate,
  eventEndDate,
  industryOptions,
  statuses,
  onFirmNameChange,
  onContactPersonNameChange,
  onIndustryChange,
  onIndustrySelect,
  onStatusChange,
  onStatusSelect,
  onSelectedStatesChange,
  onSelectedTypesChange,
  onEventStartDateChange,
  onEventEndDateChange,
  onAdd,
  onAddMagic,
  onClearAll,
}) => {
  const [showExtendedFilters, setShowExtendedFilters] = useState(false);

  return (
    <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Deals
        </h2>
        <div className="flex gap-2">
          <AddButton onClick={onAdd} />
          <MakeMagicButton onClick={onAddMagic} />
          <Button
            type="button"
            className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            onClick={onClearAll}
            aria-label="Clear all filters"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by firm name..."
            className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={firmNameDraft}
            onChange={(e) => onFirmNameChange(e.target.value)}
          />
          {firmNameDraft && (
            <button
              type="button"
              className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
              style={{ padding: 0 }}
              aria-label="Clear firm name"
              onClick={() => onFirmNameChange("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by contact person..."
            className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={contactPersonNameDraft}
            onChange={(e) => onContactPersonNameChange(e.target.value)}
          />
          {contactPersonNameDraft && (
            <button
              type="button"
              className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
              style={{ padding: 0 }}
              aria-label="Clear contact person name"
              onClick={() => onContactPersonNameChange("")}
            >
              ×
            </button>
          )}
        </div>
        <div className="relative flex-1 min-w-0 flex gap-2 items-center">
          <DatePicker
            value={eventStartDate}
            onChange={onEventStartDateChange}
            placeholder="Start date"
            className="w-full max-w-[12rem] pr-2 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <span className="text-xs">–</span>
          <DatePicker
            value={eventEndDate}
            onChange={onEventEndDateChange}
            placeholder="End date"
            className="w-full max-w-[12rem] pr-2 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Advanced filters
          </div>
          <button
            type="button"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            aria-expanded={showExtendedFilters}
            aria-controls="extended-filters"
            onClick={() => setShowExtendedFilters((prev) => !prev)}
          >
            {showExtendedFilters ? "Hide filters" : "Show more filters"}
          </button>
        </div>

        <div
          id="extended-filters"
          className={showExtendedFilters ? "space-y-1.5" : "hidden"}
        >
          <div className="relative">
            <MultiSelect
              options={dealStates.map((state: any) => ({
                id: state.Id,
                label: state.State,
              }))}
              selectedValues={selectedStates}
              onChange={(values) => onSelectedStatesChange(values as number[])}
              placeholder="All States"
            />
            {selectedStates.length > 0 && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear state filter"
                onClick={() => onSelectedStatesChange([])}
              >
                ×
              </button>
            )}
          </div>

          <div className="relative">
            <AutocompleteInput
              value={statusDraft}
              onChange={onStatusChange}
              suggestions={statuses}
              placeholder="Status..."
              onSelect={(s) => {
                onStatusChange(s);
                onStatusSelect(s);
              }}
              className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {statusDraft && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear status"
                onClick={() => onStatusChange("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="relative">
            <MultiSelect
              options={dealTypes.map((type: any) => ({
                id: type.Id,
                label: type.Type,
              }))}
              selectedValues={selectedTypes}
              onChange={(values) => onSelectedTypesChange(values as number[])}
              placeholder="All Types"
            />
            {selectedTypes.length > 0 && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear type filter"
                onClick={() => onSelectedTypesChange([])}
              >
                ×
              </button>
            )}
          </div>

          <div className="relative">
            <AutocompleteInput
              value={industryDraft}
              onChange={onIndustryChange}
              suggestions={industryOptions}
              placeholder="Industry..."
              onSelect={(s) => {
                onIndustryChange(s);
                onIndustrySelect(s);
              }}
              className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {industryDraft && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear industry"
                onClick={() => onIndustryChange("")}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
