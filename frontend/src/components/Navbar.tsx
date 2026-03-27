import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "About", path: "/about" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="font-bold text-lg cursor-pointer tracking-tight select-none"
        >
          TaskPilot <span className="text-indigo-600">AI</span>
        </h1>

        {/* DESKTOP */}
        <div className="hidden md:flex gap-6 items-center">
          {links.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className={`text-sm transition ${
                location.pathname === l.path
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/auth")}
            className="bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-xl text-gray-600"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden px-6 pb-4 space-y-2 border-t border-gray-100 bg-white"
          >
            {links.map((l) => (
              <button
                key={l.path}
                onClick={() => { navigate(l.path); setOpen(false); }}
                className="block w-full text-left py-2 text-sm text-gray-600 hover:text-black transition"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => { navigate("/auth"); setOpen(false); }}
              className="w-full bg-black text-white py-2 rounded-xl text-sm mt-1"
            >
              Sign Up
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
