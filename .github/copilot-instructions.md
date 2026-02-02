# Copilot Instructions for Sai Deal Assistant Frontend

## Project Overview

- **Sai Deal Assistant** is a feature-based React/TypeScript CRM frontend, inspired by VSCode UI, for managing sales deals, events, contacts, and metadata.
- The codebase is split into UI components, Redux-based state features, API services, and configuration/utilities. See [README.md](../README.md) for architecture diagrams and details.

## Key Architectural Patterns

- **Feature-based structure:**
  - `src/components/`: UI, split into `common/`, `layout/`, and feature-specific folders.
  - `src/features/`: Each domain (deals, events, contactPersons, etc.) has its own Redux slice and API module.
  - `src/services/api.ts`: Central Axios instance, runtime config, interceptors.
  - `src/app/store.ts`: Central Redux store config; use typed hooks from `src/app/hooks.ts`.
  - `src/contexts/ThemeContext.tsx`: Theme switching logic.
- **Dynamic config:** Loads from `/public/config.json` at runtime (not in git).
- **VSCode-like UI:** Layout and navigation mimic VSCode (see `src/components/layout/`).

## Developer Workflows

- **Install:** `npm install`
- **Dev server:** `npm run dev` (Vite, hot reload)
- **Build:** `npm run build` → outputs to `dist/`
- **Preview:** `npm run preview`
- **Docker:** See [Dockerfile](../Dockerfile) and [nginx.conf](../nginx.conf) for containerized static hosting.
- **Config:** Copy `public/config.json.sample` to `public/config.json` and set `apiBaseUrl`.

## Conventions & Patterns

- **Redux Toolkit** for all state logic; colocate API and slice per feature.
- **TypeScript everywhere**; types in `src/types/`.
- **Axios** for all HTTP; use the shared instance in `src/services/api.ts`.
- **Tailwind CSS** for styling; config in `tailwind.config.js`.
- **No backend logic here**; all API calls go to the backend via `apiBaseUrl`.
- **Dark/light theme** via context; see `ThemeContext.tsx`.
- **Component library**: Reuse from `src/components/common/`.

## Integration Points

- **Backend API:** All data flows through the backend at `apiBaseUrl` (see config).
- **Docker/Nginx:** For production, static files are served via Nginx with SSL support.
- **CI/CD:** See `.github/workflows/` for deploy and PR automation.

## Examples

- Add a new feature: create a folder in `src/features/`, add `featureSlice.ts` and `featureAPI.ts`, wire to store.
- Add a new UI component: add to `src/components/common/` or a feature folder.
- Update config: edit `public/config.json` (not tracked in git).

## References

- [README.md](../README.md): Full architecture, setup, and workflow details.
- [src/features/](../src/features/): Feature modules (state + API).
- [src/components/](../src/components/): UI components.
- [src/services/api.ts](../src/services/api.ts): API logic.
- [src/app/store.ts](../src/app/store.ts): Redux store.

---

For questions or unclear patterns, check the README or ask for clarification.
