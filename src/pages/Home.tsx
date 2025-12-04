import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Welcome to Deal Assistant
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 text-center">
          Manage your business operations efficiently
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/employees"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 mr-4">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Employees
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              View, add, edit, and manage employee records
            </p>
          </Link>

          <Link
            to="/customers"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 mr-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Customers
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Manage customer information and business relationships
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
