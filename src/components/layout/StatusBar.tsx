import React from "react";
import { useAppSelector } from "../../app/hooks";

export const StatusBar: React.FC = () => {
  const dealsLoading = useAppSelector((state) => state.deals.loading);
  const eventsLoading = useAppSelector((state) => state.events.loading);
  const contactPersonsLoading = useAppSelector(
    (state) => state.contactPersons.loading
  );
  const dealTagsLoading = useAppSelector((state) => state.dealTags.loading);
  const enumsLoading = useAppSelector((state) => state.enums.loading);
  const eventNotesLoading = useAppSelector((state) => state.eventNotes.loading);

  const dealsError = useAppSelector((state) => state.deals.error);
  const eventsError = useAppSelector((state) => state.events.error);
  const contactPersonsError = useAppSelector(
    (state) => state.contactPersons.error
  );
  const dealTagsError = useAppSelector((state) => state.dealTags.error);

  const getStatusMessage = () => {
    const statuses = [];

    if (dealsLoading) statuses.push("Loading Deals...");
    if (eventsLoading) statuses.push("Loading Events...");
    if (contactPersonsLoading) statuses.push("Loading Contact Persons...");
    if (dealTagsLoading) statuses.push("Loading Tags...");
    if (enumsLoading) statuses.push("Loading Enums...");
    if (eventNotesLoading) statuses.push("Loading Notes...");

    if (dealsError) statuses.push(`Error: ${dealsError}`);
    if (eventsError) statuses.push(`Error: ${eventsError}`);
    if (contactPersonsError) statuses.push(`Error: ${contactPersonsError}`);
    if (dealTagsError) statuses.push(`Error: ${dealTagsError}`);

    if (statuses.length > 0) {
      return statuses.join(" | ");
    }

    return "Ready";
  };

  const isLoading =
    dealsLoading ||
    eventsLoading ||
    contactPersonsLoading ||
    dealTagsLoading ||
    enumsLoading ||
    eventNotesLoading;
  const hasError =
    dealsError || eventsError || contactPersonsError || dealTagsError;

  return (
    <div className="bg-blue-700 dark:bg-gray-900 text-white text-xs h-6 flex items-center justify-between px-3 transition-colors duration-200">
      {/* Left section - Status messages */}
      <div className="flex items-center space-x-4">
        <span className="flex items-center">
          {isLoading && (
            <svg
              className="animate-spin h-3 w-3 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {hasError && !isLoading && (
            <svg
              className="h-3 w-3 mr-2 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {getStatusMessage()}
        </span>
      </div>

      {/* Right section - Additional info */}
      <div className="flex items-center space-x-4">
        <span className="opacity-75">Deal Assistant</span>
      </div>
    </div>
  );
};
