import React, { useMemo } from "react";

const dealStateIconPalette = [
  {
    colorClass: "text-blue-500",
    path: (
      <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 010-2h6V3a1 1 0 011-1z" />
    ),
  },
  {
    colorClass: "text-cyan-500",
    path: <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12l-6-3-6 3V4z" />,
  },
  {
    colorClass: "text-indigo-500",
    path: (
      <path d="M10 2l2.4 4.9L18 8l-4 3.9.9 5.6L10 15l-4.9 2.5.9-5.6L2 8l5.6-.1L10 2z" />
    ),
  },
  {
    colorClass: "text-violet-500",
    path: (
      <path d="M10 2a6 6 0 016 6c0 4.4-6 10-6 10S4 12.4 4 8a6 6 0 016-6zm0 8.5A2.5 2.5 0 1010 5a2.5 2.5 0 000 5.5z" />
    ),
  },
  {
    colorClass: "text-fuchsia-500",
    path: (
      <path d="M5 3h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm2 3v2h6V6H7zm0 4v4h2v-4H7zm4 0v4h2v-4h-2z" />
    ),
  },
  {
    colorClass: "text-pink-500",
    path: (
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3-8a1 1 0 011.7-.7L10 10.6l1.3-1.3a1 1 0 111.4 1.4l-2 2a1 1 0 01-1.4 0l-2-2A1 1 0 017 10z" />
    ),
  },
  {
    colorClass: "text-rose-500",
    path: (
      <path d="M10 2l7 4v8l-7 4-7-4V6l7-4zm0 2.2L5 7v6l5 2.8 5-2.8V7l-5-2.8z" />
    ),
  },
  {
    colorClass: "text-red-500",
    path: (
      <path d="M6 3h8l1 3h2v2h-1l-1 9H5L4 8H3V6h2l1-3zm1.2 3h5.6l-.5-1.5H7.7L7.2 6zm.3 3v6h2V9h-2zm3 0v6h2V9h-2z" />
    ),
  },
  {
    colorClass: "text-orange-500",
    path: (
      <path d="M10 2l8 8-8 8-8-8 8-8zm0 2.8L4.8 10 10 15.2 15.2 10 10 4.8z" />
    ),
  },
  {
    colorClass: "text-amber-500",
    path: (
      <path d="M10 2l8 14H2L10 2zm0 4.2L5.4 14h9.2L10 6.2zM9 9h2v3H9V9zm0 4h2v2H9v-2z" />
    ),
  },
  {
    colorClass: "text-yellow-500",
    path: (
      <path d="M10 2a8 8 0 018 8c0 3.7-2.5 7-6 7.8V20h-4v-2.2A8 8 0 112 10a8 8 0 018-8zm-1 5v6l5-3-5-3z" />
    ),
  },
  {
    colorClass: "text-lime-500",
    path: (
      <path d="M4 10a6 6 0 1112 0v6H4v-6zm6-8a8 8 0 00-8 8v8h16v-8a8 8 0 00-8-8z" />
    ),
  },
  {
    colorClass: "text-green-500",
    path: (
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.3 6.7l-4 4a1 1 0 01-1.4 0l-2-2a1 1 0 111.4-1.4l1.3 1.3 3.3-3.3a1 1 0 111.4 1.4z" />
    ),
  },
  {
    colorClass: "text-emerald-500",
    path: (
      <path d="M10 2l2.1 4.3L17 7l-3.5 3.4.8 4.9L10 13.1 5.7 15.3l.8-4.9L3 7l4.9-.7L10 2z" />
    ),
  },
  {
    colorClass: "text-teal-500",
    path: (
      <path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-3l-2 3-2-3H5a2 2 0 01-2-2V4z" />
    ),
  },
  {
    colorClass: "text-sky-500",
    path: (
      <path d="M2 6h16v2H2V6zm2 4h12v8H4v-8zm3 2v4h2v-4H7zm4 0v4h2v-4h-2z" />
    ),
  },
  {
    colorClass: "text-slate-500",
    path: (
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3 11.6l-1.4 1.4L10 13.4 8.4 15 7 13.6 8.6 12 7 10.4 8.4 9 10 10.6 11.6 9l1.4 1.4L11.4 12l1.6 1.6z" />
    ),
  },
  {
    colorClass: "text-gray-500",
    path: (
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 4h2v5H9V6zm0 6h2v2H9v-2z" />
    ),
  },
];

const UnknownStateIcon: React.FC = () => (
  <svg
    className="w-4 h-4 text-gray-400 shrink-0"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <title>Unknown State</title>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
      clipRule="evenodd"
    />
  </svg>
);

interface DealStateIconProps {
  id: number | null;
  states: any[];
}

export const DealStateIcon: React.FC<DealStateIconProps> = ({ id, states }) => {
  const iconsById = useMemo(() => {
    const newIcon = (
      <svg
        className="w-4 h-4 shrink-0 text-blue-500"
        fill="none"
        viewBox="0 0 20 20"
      >
        <title>New</title>
        <rect
          x="3"
          y="5"
          width="14"
          height="10"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M4.5 7L10 11l5.5-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    const contactedIcon = (
      <svg
        className="w-4 h-4 shrink-0 text-cyan-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>Contacted</title>
        <path d="M10 3L2 8l8 5 8-5-8-5z" />
        <path d="M3 9.5V14a2 2 0 002 2h10a2 2 0 002-2V9.5l-7 4.375a1 1 0 01-1.06 0L3 9.5z" />
      </svg>
    );

    const techQualifiedIcon = (
      <svg
        className="w-5 h-5 shrink-0 text-emerald-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>Tech Qualified</title>
        <path
          fillRule="evenodd"
          d="M11.49 3.17a1 1 0 00-1.98 0l-.11.87a6.03 6.03 0 00-1.28.53l-.7-.53a1 1 0 00-1.4.14l-.7.87a1 1 0 00.14 1.4l.68.55a6.1 6.1 0 00-.23 1.2l-.87.11a1 1 0 00-.86.99v1.1a1 1 0 00.86.99l.87.11c.05.42.13.82.25 1.2l-.69.55a1 1 0 00-.14 1.4l.7.87a1 1 0 001.4.14l.7-.53c.4.22.83.4 1.28.53l.11.87a1 1 0 001.98 0l.11-.87c.45-.13.88-.31 1.28-.53l.7.53a1 1 0 001.4-.14l.7-.87a1 1 0 00-.14-1.4l-.69-.55c.12-.38.2-.78.25-1.2l.87-.11a1 1 0 00.86-.99v-1.1a1 1 0 00-.86-.99l-.87-.11a6.1 6.1 0 00-.23-1.2l.68-.55a1 1 0 00.14-1.4l-.7-.87a1 1 0 00-1.4-.14l-.7.53a6.03 6.03 0 00-1.28-.53l-.11-.87zM10.5 12.5a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    );

    const managementQualifiedIcon = (
      <svg
        className="w-4 h-4 shrink-0 text-indigo-500"
        fill="none"
        viewBox="0 0 20 20"
      >
        <title>Management Qualified</title>
        <path
          d="M6 3h6l3 3v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 3v3h3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 13.5l5.8-5.8 1.7 1.7-5.8 5.8-2.2.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    const finalQualifiedIcon = (
      <svg
        className="w-5 h-5 shrink-0 text-teal-500"
        fill="none"
        viewBox="0 0 20 20"
      >
        <title>Final Qualified</title>
        <path
          d="M5 4.5h10a1.5 1.5 0 011.5 1.5v8A1.5 1.5 0 0115 15.5H5A1.5 1.5 0 013.5 14V6A1.5 1.5 0 015 4.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.2 10.1l2.1 2.1 3.6-3.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 4.5h10a1.5 1.5 0 011.5 1.5v1.2H3.5V6A1.5 1.5 0 015 4.5z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="none"
        />
        <path
          d="M6.6 6h1.6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M9.4 6h4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );

    const wonIcon = (
      <svg
        className="w-4 h-4 shrink-0 text-green-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>Won</title>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );

    const lostIcon = (
      <svg
        className="w-4 h-4 shrink-0 text-red-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>Lost</title>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    );

    const icons: Array<JSX.Element | undefined> = [];

    states.forEach((state: any) => {
      const key = String(state.State);
      const stateId = Number(state.Id);
      if (!Number.isFinite(stateId) || stateId < 0) return;

      const paletteIcon =
        dealStateIconPalette[
          (Math.max(1, stateId) - 1) % dealStateIconPalette.length
        ];

      if (key === "New") {
        icons[stateId] = newIcon;
        return;
      }
      if (key === "Contacted") {
        icons[stateId] = contactedIcon;
        return;
      }
      if (key === "Tech Qualified") {
        icons[stateId] = techQualifiedIcon;
        return;
      }
      if (key === "Management Qualified") {
        icons[stateId] = managementQualifiedIcon;
        return;
      }
      if (key === "Final Qualified") {
        icons[stateId] = finalQualifiedIcon;
        return;
      }
      if (key === "Won" || key === "Closed Won") {
        icons[stateId] = wonIcon;
        return;
      }
      if (key === "Lost" || key === "Closed Lost") {
        icons[stateId] = lostIcon;
        return;
      }

      icons[stateId] = (
        <svg
          className={`w-4 h-4 shrink-0 ${paletteIcon.colorClass}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <title>{key}</title>
          {paletteIcon.path}
        </svg>
      );
    });

    return icons;
  }, [states]);

  if (id === null || !Number.isFinite(id) || id < 0) {
    return <UnknownStateIcon />;
  }

  return iconsById[id] ?? <UnknownStateIcon />;
};
