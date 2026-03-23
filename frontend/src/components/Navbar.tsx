import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="font-bold text-lg cursor-pointer"
        >
          TaskPilot AI
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 items-center">
          <button onClick={() => navigate("/about")} className="hover:text-black text-gray-600">
            About
          </button>
          <button onClick={() => navigate("/dashboard")} className="hover:text-black text-gray-600">
            Dashboard
          </button>
          
          <button
            onClick={() => navigate("/auth")}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 border-t">
          <button onClick={() => navigate("/about")} className="block w-full text-left">
            About
          </button>
          <button onClick={() => navigate("/dashboard")} className="block w-full text-left">
            Dashboard
          </button>
          <button onClick={() => navigate("/auth")} className="block w-full text-left">
            Login
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="w-full bg-black text-white py-2 rounded-xl"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}

