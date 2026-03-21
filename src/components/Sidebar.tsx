import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ setActiveTab }: any) {
  const navigate = useNavigate();
  const menu = [
    { name: "Dashboard", key: "dashboard" },
    { name: "New Meetings", key: "meeting" },
    { name: "Tasks", key: "tasks" },
    { name: "Activity Logs", key: "logs" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r p-4">
      {/* LOGO */}
      <h2
        className="text-xl font-bold mb-8 cursor-pointer"
        onClick={() => setActiveTab("dashboard")}
      >
        TaskPilot
      </h2>

      {/* MENU */}
      <div className="space-y-2 flex-1">
        {menu.map((item) => (
          <motion.button
            key={item.key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(item.key)}
            className="w-full text-left px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            {item.name}
          </motion.button>
        ))}
      </div>

      {/* ACCOUNT SECTION */}
      <div className="mt-auto border-t pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
            U
          </div>

          <div>
            <p className="text-sm font-medium">Demo User</p>
            <p className="text-xs text-gray-500">demo@taskpilot.ai</p>
          </div>
        </div>

        <button
         onClick={() => navigate("/")}
         className="mt-3 w-full text-sm text-gray-500 hover:text-black transition">
         Logout
        </button>
      </div>
    </div>
  );
}