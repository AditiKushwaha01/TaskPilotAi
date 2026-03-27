import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Props = {
  setActiveTab: (tab: string) => void;
  activeTab: string;
};

const menu = [
  { name: "Dashboard", key: "dashboard", icon: "⊞" },
  { name: "New Meeting", key: "meeting", icon: "＋" },
  { name: "Tasks", key: "tasks", icon: "✓" },
  { name: "Activity Logs", key: "logs", icon: "≡" },
 // {name: "Notifications", key: "notifications", icon: "🔔" },
];

export default function Sidebar({ setActiveTab, activeTab }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 p-4">
      {/* LOGO */}
      <div
        className="flex items-center gap-2 mb-8 cursor-pointer select-none"
        onClick={() => setActiveTab("dashboard")}
      >
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-sm font-bold">
          ✈
        </div>
        <span className="font-bold text-base tracking-tight">
          TaskPilot <span className="text-indigo-600">AI</span>
        </span>
      </div>

      {/* MENU */}
      <nav className="space-y-1 flex-1">
        {menu.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(item.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${
                isActive
                  ? "bg-black text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.name}
            </motion.button>
          );
        })}
      </nav>

      {/* AGENTS STATUS */}
      <div className="my-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Agents</p>
        {["AI Agent", "Reminder", "Escalation"].map((a) => (
          <div key={a} className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-600">{a}</span>
            <span className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
              Active
            </span>
          </div>
        ))}
      </div>

      {/* USER */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            U
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">Demo User</p>
            <p className="text-xs text-gray-400">demo@taskpilot.ai</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full text-xs text-gray-400 hover:text-black transition text-left px-1"
        >
          ← Logout
        </button>
      </div>
    </div>
  );
}
