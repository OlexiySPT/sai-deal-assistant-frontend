# Deal Assistant

A **sales management CRM** designed to help sales managers work with potential clients, track deals, and close opportunities to generate revenue. This is a **pet project** demonstrating modern .NET development practices and architectural patterns.

> **⚠️ Project Status**: Under active development. Developed according to the "Idea First" startup paradigm — core features are prioritized, with infrastructure and advanced features planned for future iterations.

---

## 🎯 Purpose

**Sai Deal Assistant** enables sales teams to:

- Manage potential clients and deals throughout the sales pipeline
- Track events, meetings, and touchpoints with prospects
- Organize deal metadata (tags, contact persons, deal types, etc.)
- Monitor deal states and progress toward closing

---

## 🏗️ Architecture

The project follows a **feature-based architecture** with clear separation of concerns:

### Structure

```
┌─────────────────────────────────────────┐
│         Components (UI Layer)           │  ← React components, layouts
├─────────────────────────────────────────┤
│         Features (State Layer)          │  ← Redux slices, API calls
├─────────────────────────────────────────┤
│         Services (API Layer)            │  ← Axios configuration, base API
├─────────────────────────────────────────┤
│       Config/Utils (Support)            │  ← Configuration, constants, types
└─────────────────────────────────────────┘
```

#### **1. Components Layer**

- **Common**: Reusable UI components (`Button`, `Card`)
- **Layout**: Application structure (`Header`, `Footer`, `MenuBar`, `ActivityBar`, `StatusBar`)
- **Feature Components**: Domain-specific components (`DealsList`, `DealDetails`)
- VSCode-inspired UI design

#### **2. Features Layer (Redux)**

- **Slices**: State management for `deals`, `events`, `contactPersons`, `dealTags`, `enums`, `eventNotes`
- **API Functions**: Feature-specific API calls using Axios
- Redux Toolkit for efficient state updates
- Centralized store configuration

#### **3. Services Layer**

- Axios instance with base configuration
- Runtime config loading from `config.json`
- API interceptors and error handling

#### **4. Configuration & Utilities**

- Dynamic configuration loading
- TypeScript type definitions
- Application constants
- Theme context for dark/light mode

---

## 🛠️ Technology Stack

| Category             | Technology                 |
| -------------------- | -------------------------- |
| **Framework**        | React 18                   |
| **Language**         | TypeScript 5               |
| **Build Tool**       | Vite 5                     |
| **State Management** | Redux Toolkit 2            |
| **Routing**          | React Router 6             |
| **HTTP Client**      | Axios 1                    |
| **Styling**          | Tailwind CSS 3             |
| **CSS Processing**   | PostCSS, Autoprefixer      |
| **Design Pattern**   | Feature-based architecture |
| **Deployment**       | Docker + Nginx             |

---

## 📦 Features Overview

### Core Features

- **Deal Management**: Browse and view deal information
- **Event Tracking**: View events associated with deals
- **Contact Persons**: Display contact information
- **Deal Tags**: Organize deals with tagging system
- **Event Notes**: View notes attached to events

### UI/UX Features

- **VSCode-Inspired Design**: Familiar interface for developers
- **Dark/Light Theme**: Toggle between color schemes
- **Responsive Layout**: Activity bar, menu bar, status bar
- **Component Library**: Reusable UI components

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or later
- **npm** or **yarn**
- Running **Deal Assistant Backend** instance

### Configuration

The application loads its configuration from `/public/config.json` at runtime.

**Create `public/config.json`** (based on `config.json.sample`):

```json
{
  "apiBaseUrl": "https://localhost:7196"
}
```

**For development**, you can also create `public/config.dev.json`:

```json
{
  "apiBaseUrl": "https://your-dev-server:5001"
}
```

**Notes:**

- `apiBaseUrl`: Base URL of the Deal Assistant backend API
- Config files are **not tracked in git** for security
- Sample files are provided as templates

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd sai-deal-assistant-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create configuration:**

   ```bash
   cp public/config.json.sample public/config.json
   # Edit config.json with your backend URL
   ```

### Running the Application

**Development mode:**

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

**Production build:**

```bash
npm run build
```

The optimized output will be in the `dist/` directory.

**Preview production build:**

```bash
npm run preview
```

---

## 🧪 Key Features Implemented

✅ **Redux State Management**: Centralized state with Redux Toolkit  
✅ **TypeScript**: Full type safety across the application  
✅ **Feature-Based Architecture**: Organized by domain features  
✅ **Dynamic Configuration**: Runtime config loading  
✅ **Theme Support**: Dark/light mode switching  
✅ **Component Library**: Reusable UI components  
✅ **API Integration**: Axios-based backend communication  
✅ **Responsive Design**: Tailwind CSS styling  
✅ **Vite Build**: Fast development and optimized builds  
✅ **Docker Support**: Containerized deployment with Nginx

---

## 📂 Project Structure

```
sai-deal-assistant-frontend/
├── public/
│   ├── config.json.sample         # Configuration template
│   └── config.dev.json.sample     # Dev configuration template
├── src/
│   ├── components/
│   │   ├── common/                # Reusable components (Button, Card)
│   │   ├── deals/                 # Deal-specific components
│   │   └── layout/                # Layout components (Header, Footer, etc.)
│   ├── features/
│   │   ├── deals/                 # Deals slice + API
│   │   ├── events/                # Events slice + API
│   │   ├── contactPersons/        # Contact persons slice + API
│   │   ├── dealTags/              # Deal tags slice + API
│   │   ├── enums/                 # Enums slice + API
│   │   └── eventNotes/            # Event notes slice + API
│   ├── services/
│   │   └── api.ts                 # Axios configuration
│   ├── config/
│   │   └── config.ts              # Configuration loader
│   ├── contexts/
│   │   └── ThemeContext.tsx       # Theme context provider
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   └── constants.ts           # Application constants
│   ├── app/
│   │   ├── store.ts               # Redux store configuration
│   │   └── hooks.ts               # Typed Redux hooks
│   ├── pages/
│   │   └── Home.tsx               # Main page component
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # Application entry point
├── .github/
│   └── workflows/
│       ├── deploy-dev.yml         # CI/CD deployment workflow
│       └── auto-pr.yml            # Automated PR workflow
├── deploy-dev.sh                  # Deployment script
├── Dockerfile                     # Docker configuration
├── nginx.conf                     # Nginx configuration
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies
```

---

## 🐳 Docker Support & TLS Reverse Proxy 🔐

The application supports running as Docker containers and includes an optional TLS-terminating reverse proxy (nginx) that front-ends the frontend and BFF services. This is the recommended setup for local dev and simple deployments where you want HTTPS on `https://localhost`.

Key points

- The frontend, BFF and proxy are defined in `docker-compose.yml`.
- The **proxy** service is built from `docker/proxy/Dockerfile`. The nginx configuration (`proxy.conf`) is baked into the proxy image at build time (for reproducible deployments). To override config in development, edit `docker/proxy/proxy.conf` and rebuild the `proxy` image.
- TLS certs (for dev) are mounted from `bff/certs` into the proxy at `/etc/nginx/certs`.
- The BFF is a Next.js app in `bff/` which listens on port `3001` internally and acts as an API gateway for frontend `/api/*` calls.

Local development using the proxy (HTTPS)

1. Generate local self-signed certs (example):

```bash
# from bff/certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365 -subj "/CN=localhost"
```

2. Build and start services (from repo root):

```bash
# Build everything and start services including proxy
docker compose build
docker compose up --build
```

3. Access the app at `https://localhost` (the proxy listens on 443 and terminates TLS). The proxy forwards `/api/*` to the BFF at `http://bff:3001`.

Configuration notes

- When using the proxy, set `VITE_API_BASE_URL=https://localhost` (frontend config) so API calls go to the proxied origin.
- Ensure `ALLOWED_ORIGINS` in BFF includes `https://localhost` (see `bff/src/lib/config.ts` used by `bff/src/lib/proxy.ts`).
- In development the BFF sets `NODE_TLS_REJECT_UNAUTHORIZED=0` to allow backend calls to self-signed certs — do not copy this to production.

CI / Deploy behavior

- The deployed workflow (`.github/workflows/deploy-dev.yml`) now builds and saves the proxy image as `proxy.tar` and then creates a single `deploy.tar` archive containing the images, `docker-compose.yml`, `.env`, `deploy-dev.sh`, and `bff/certs/`. The deploy job uploads `deploy.tar` to the server where the deploy script extracts the archive, loads the images, and places certs in place so `docker compose up -d` can bind them at runtime.
- The deploy script (`deploy-dev.sh`) loads `proxy.tar` and places TLS certs (`bff/certs/`) into the deployment directory so `docker compose up -d` can bind them at runtime.

Security reminder ⚠️

- Do not commit production private keys into the repository. Use a secrets manager or Let's Encrypt/ACME in production to obtain and rotate certificates.

References

- `docker-compose.yml` (services: `proxy`, `frontend`, `bff`)
- `docker/proxy/Dockerfile` (proxy config baked into image)
- `bff/certs/` (dev certs)
- `bff/src/lib/proxy.ts` (BFF proxying and CORS handling)
- `.github/workflows/deploy-dev.yml` and `deploy-dev.sh` (CI/deploy flow)

---

## 🚧 Roadmap / Planned Features

This project is under active development. Upcoming features include:

- [ ] Deal creation and editing UI
- [ ] Event creation and management
- [ ] Contact person management
- [ ] Advanced filtering and search
- [ ] Deal analytics dashboard
- [ ] Real-time updates (SignalR integration)
- [ ] File upload support
- [ ] Authentication & Authorization
- [ ] Comprehensive unit and integration tests
- [ ] Accessibility improvements (WCAG 2.1)
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) support
- [ ] End-to-end testing (Playwright/Cypress)

---

## 📄 License

This project is for educational and portfolio purposes.

---

## 👤 Author

**Olexiy** — [GitHub Profile](https://github.com/OlexiySPT)

---

## 🙏 Acknowledgments

Built with modern React and TypeScript best practices. UI design inspired by Visual Studio Code's interface for a familiar developer experience.
