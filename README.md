# Deal Assistant Frontend

This is a React application built with Vite, Tailwind CSS, and Redux Toolkit. It serves as the frontend for the Deal Assistant project, which interacts with a backend API to manage deals.

## Features

- **Responsive Design**: Utilizes Tailwind CSS for styling, ensuring a responsive and modern UI.
- **State Management**: Implements Redux Toolkit for efficient state management across the application.
- **API Integration**: Uses Axios for making HTTP requests to the backend API.
- **Modular Components**: Components are organized into common and layout categories for better maintainability.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd deal-assistant-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

or

```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build, run:

```bash
npm run build
```

or

```bash
yarn build
```

The output will be in the `dist` directory.

## API Endpoints

The application interacts with the backend API located at `https://localhost:7196/swagger/index.html`. Please refer to the Swagger documentation for available endpoints and their usage.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.