import React, { useState } from "react";

interface MenuBarProps {}

export const MenuBar: React.FC<MenuBarProps> = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      label: "File",
      items: ["New Deal", "Open", "Save", "Close"],
    },
    {
      label: "Edit",
      items: ["Undo", "Redo", "Cut", "Copy", "Paste"],
    },
    {
      label: "Selection",
      items: ["Select All", "Expand Selection", "Shrink Selection"],
    },
    {
      label: "View",
      items: ["Command Palette", "Open View", "Appearance", "Layout"],
    },
    {
      label: "Go",
      items: ["Back", "Forward", "Go to File", "Go to Line"],
    },
    {
      label: "Run",
      items: ["Start", "Stop", "Restart"],
    },
    {
      label: "Help",
      items: ["Documentation", "About"],
    },
  ];

  const handleMenuClick = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const handleBlur = () => {
    setTimeout(() => setActiveMenu(null), 200);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800 text-sm">
      <div className="flex items-center px-2">
        {menus.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              onClick={() => handleMenuClick(menu.label)}
              onBlur={handleBlur}
              className={`px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 transition ${
                activeMenu === menu.label ? "bg-gray-200 dark:bg-gray-800" : ""
              } text-gray-700 dark:text-gray-300`}
            >
              {menu.label}
            </button>
            {activeMenu === menu.label && (
              <div className="absolute top-full left-0 mt-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg min-w-[200px] z-50">
                {menu.items.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-gray-700 dark:text-gray-300 transition"
                    onClick={() => setActiveMenu(null)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
