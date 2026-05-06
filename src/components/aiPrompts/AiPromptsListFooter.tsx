import React from "react";
import Button from "../common/buttons/Button";

interface AiPromptsListFooterProps {
  total: number;
}

export const AiPromptsListFooter: React.FC<AiPromptsListFooterProps> = ({
  total,
}) => (
  <div className="px-3 py-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600 dark:text-gray-400">{total} total</span>
      <div className="flex gap-3 items-center">
        <Button
          type="button"
          disabled
          className="!px-0 !py-0 !border-none !bg-transparent text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
        >
          Prev
        </Button>
        <span className="text-gray-700 dark:text-gray-300">1 / 1</span>
        <Button
          type="button"
          disabled
          className="!px-0 !py-0 !border-none !bg-transparent text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
);
