import React from "react";

export const StatusBar: React.FC = () => {
  return (
    <div className="bg-blue-600 dark:bg-blue-700 text-white text-xs h-6 flex items-center justify-between px-3">
      {/* Left section - for future status items */}
      <div className="flex items-center space-x-4"></div>

      {/* Right section - for future status items */}
      <div className="flex items-center space-x-4"></div>
    </div>
  );
};
