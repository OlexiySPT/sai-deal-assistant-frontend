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

## 🐳 Docker Support

The application includes Docker support for containerized deployment:

**Build Docker image:**

```bash
docker build -t sai-deal-assistant-frontend:latest .
```

**Run container:**

```bash
docker run -d \
  --name deal-assistant-frontend \
  -p 3000:80 \
  -p 3443:443 \
  -v $(pwd)/public/config.json:/usr/share/nginx/html/config.json:ro \
  sai-deal-assistant-frontend:latest
```

The container uses **Nginx** to serve the static files and includes SSL support.

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
