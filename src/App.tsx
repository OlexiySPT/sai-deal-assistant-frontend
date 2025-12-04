import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Home } from "./pages/Home";
import { EmployeesList } from "./features/employees/EmployeesList";
import { EmployeeForm } from "./features/employees/EmployeeForm";
import { CustomersList } from "./features/customers/CustomersList";
import { CustomerForm } from "./features/customers/CustomerForm";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<EmployeesList />} />
            <Route path="/employees/create" element={<EmployeeForm />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            <Route path="/customers" element={<CustomersList />} />
            <Route path="/customers/create" element={<CustomerForm />} />
            <Route path="/customers/edit/:id" element={<CustomerForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
