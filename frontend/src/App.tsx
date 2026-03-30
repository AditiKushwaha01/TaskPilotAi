import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Auth from "./pages/Auth";
import { useState } from "react";

export default function App() {
  const [demoMode, setDemoMode] = useState(false); // ✅ moved inside

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* ✅ ONLY ONE DASHBOARD ROUTE */}
        <Route
          path="/dashboard"
          element={<Dashboard demoMode={demoMode} />}
        />

        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}