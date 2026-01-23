import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { StatusBar } from "./components/layout/StatusBar";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <StatusBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
