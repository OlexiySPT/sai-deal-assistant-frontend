import React, { useMemo } from "react";
import { Dialog } from "../common/Dialog";
import Button from "../common/buttons/Button";

interface ParsePageResultDialogProps {
  open: boolean;
  result: string;
  originalText: string;
  onClose: () => void;
  onCreate?: (parsed: ParsedPageResult) => void;
}

interface ParsedPageResult {
  title: string | null;
  company: string | null;
  location: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  perks: string[];
}

const safeJsonParse = (text: string): any => {
  const normalizeQuotesAndNewlines = (input: string) => {
    let result = "";
    let inString = false;
    let quoteChar = "";
    let escaped = false;

    for (let i = 0; i < input.length; i += 1) {
      const char = input[i];
      if (!inString) {
        if (char === '"' || char === "'") {
          inString = true;
          quoteChar = char;
          result += '"';
        } else {
          result += char;
        }
        continue;
      }

      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === "\\") {
        result += char;
        escaped = true;
        continue;
      }

      if (char === quoteChar) {
        inString = false;
        quoteChar = "";
        result += '"';
        continue;
      }

      if (char === "\n" || char === "\r") {
        result += "\\n";
        continue;
      }

      if (char === '"' && quoteChar === "'") {
        result += '\\"';
        continue;
      }

      result += char;
    }

    return result;
  };

  const normalizeSingleQuotes = (input: string) =>
    input
      .replace(/([\{,\s])'([^']+)'\s*:/g, '$1"$2":')
      .replace(/:\s*'([^']*)'/g, ':"$1"')
      .replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(text);
  } catch {
    const withStringsEscaped = normalizeQuotesAndNewlines(text);
    const normalized = normalizeSingleQuotes(withStringsEscaped);
    return JSON.parse(normalized);
  }
};

const parseLooseText = (text: string): Record<string, any> => {
  const result: Record<string, any> = {};
  let currentKey: string | null = null;
  let currentList: string[] | null = null;

  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const keyValue = trimmed.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (keyValue) {
      const key = keyValue[1];
      const value = keyValue[2].trim();
      currentKey = key;
      currentList = null;

      if (value === "[" || value === "[") {
        result[key] = [];
        currentList = result[key];
      } else if (value.startsWith("[") && value.endsWith("]")) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value.slice(1, -1).split(/,\s*/).filter(Boolean);
        }
      } else {
        result[key] = value;
      }
    } else if (currentList && trimmed.startsWith("-")) {
      currentList.push(trimmed.slice(1).trim());
    } else if (currentKey) {
      if (Array.isArray(result[currentKey])) {
        result[currentKey].push(trimmed);
      } else {
        result[currentKey] = `${result[currentKey] || ""}\n${trimmed}`.trim();
      }
    }
  });

  return result;
};

const parsePageResult = (result: string): ParsedPageResult => {
  if (!result) {
    return {
      title: null,
      company: null,
      location: null,
      description: "",
      responsibilities: [],
      requirements: [],
      nice_to_have: [],
      perks: [],
    };
  }

  let parsed: any;
  try {
    parsed = safeJsonParse(result);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    parsed = parseLooseText(result);
  }

  return {
    title: parsed?.title ?? null,
    company: parsed?.company ?? null,
    location: parsed?.location ?? null,
    description: parsed?.description ?? "",
    responsibilities: Array.isArray(parsed?.responsibilities)
      ? parsed.responsibilities.map(String)
      : [],
    requirements: Array.isArray(parsed?.requirements)
      ? parsed.requirements.map(String)
      : [],
    nice_to_have: Array.isArray(parsed?.nice_to_have)
      ? parsed.nice_to_have.map(String)
      : [],
    perks: Array.isArray(parsed?.perks) ? parsed.perks.map(String) : [],
  };
};

const asTextAreaValue = (value: string | null) => value ?? "";
const asTextAreaList = (value: string[]) => value.join("\n");

export const ParsePageResultDialog: React.FC<ParsePageResultDialogProps> = ({
  open,
  result,
  originalText,
  onClose,
  onCreate,
}) => {
  const parsed = useMemo(() => parsePageResult(result), [result]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Parsed Page Result"
      dialogClassName="w-[80%] h-[80vh]  flex-col"
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto">
          <div className="grid gap-2">
            <div className="flex gap-2 sticky top-0 z-10 bg-white dark:bg-gray-800 py-2">
              <div className="w-1/5 space-y-1">
                <div className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {asTextAreaValue(parsed.company)}
                </div>
              </div>
              <div className="w-4/5 space-y-1">
                <div className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {asTextAreaValue(parsed.title)}
                </div>
              </div>
            </div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
              Location
            </label>
            <div className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {asTextAreaValue(parsed.location)}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Description
              </label>
              <div className="w-full min-h-[1rem] rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words focus:outline-none focus:ring-2 focus:ring-blue-500">
                {parsed.description}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Responsibilities
              </label>
              <div className="w-full min-h-[1rem] rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words focus:outline-none focus:ring-2 focus:ring-blue-500">
                {asTextAreaList(parsed.responsibilities)}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Requirements
              </label>
              <div className="w-full min-h-[1rem] rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words focus:outline-none focus:ring-2 focus:ring-blue-500">
                {asTextAreaList(parsed.requirements)}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Nice to Have
              </label>
              <div className="w-full min-h-[1rem] rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words focus:outline-none focus:ring-2 focus:ring-blue-500">
                {asTextAreaList(parsed.nice_to_have)}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Perks
              </label>
              <div className="w-full min-h-[1rem] rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words focus:outline-none focus:ring-2 focus:ring-blue-500">
                {asTextAreaList(parsed.perks)}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Raw data
              </label>
              <div className="w-full min-h-[1rem] rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words focus:outline-none focus:ring-2 focus:ring-blue-500">
                {result}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                Original Text
              </label>
              <div className="w-full min-h-[1rem] rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words focus:outline-none focus:ring-2 focus:ring-blue-500">
                {originalText}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-10 flex items-center justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-3 py-1 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onCreate?.(parsed);
              onClose();
            }}
            className="px-3 py-1 text-xs"
          >
            Create
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
