import { useState, useRef, useEffect } from "react";

interface MultiSelectOption {
  id: number | string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: (number | string)[];
  onChange: (values: (number | string)[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<(number | string)[]>(selectedValues);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync pendingValues with selectedValues when closed
  useEffect(() => {
    if (!isOpen) setPendingValues(selectedValues);
  }, [isOpen, selectedValues]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (id: number | string) => {
    if (pendingValues.includes(id)) {
      setPendingValues(pendingValues.filter((val) => val !== id));
    } else {
      setPendingValues([...pendingValues, id]);
    }
  };

  const clearAll = () => {
    setPendingValues([]);
  };

  const applyFilter = () => {
    onChange(pendingValues);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.id === selectedValues[0]);
      return option?.label || placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500"
      >
        <span className="truncate">{getDisplayText()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
          {pendingValues.length > 0 && (
            <div className="px-2 py-1.5 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
          {options.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">
              No options available
            </div>
          ) : (
            <>
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={pendingValues.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-xs text-gray-900 dark:text-gray-100">
                    {option.label}
                  </span>
                </label>
              ))}
              <div className="px-2 py-2 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                <button
                  type="button"
                  className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                  onClick={applyFilter}
                >
                  Apply
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
