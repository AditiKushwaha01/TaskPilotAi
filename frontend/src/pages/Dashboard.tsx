import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MeetingChat from "../components/MeetingChat";
import TaskTable from "../components/TaskTable";
import NotificationPanel from "../components/NotificationPannel";
import ActivityLogs from "../components/ActivityLogs";
import Agents from "../components/Agents";
import Escalations from "../components/Escalations";
import MeetingList from "../components/MeetingList";
import type { Task } from "../types/task";

const STATS = [
  { label: "Total Meetings", value: "12", icon: "🗓", color: "text-indigo-600" },
  { label: "Upcoming",       value: "3",  icon: "⏳", color: "text-yellow-600" },
  { label: "Tasks Pending",  value: "8",  icon: "📋", color: "text-blue-600" },
  { label: "Completed",      value: "47", icon: "✅", color: "text-green-600" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [activeTab, setActiveTab]             = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMeetingModal, setShowMeetingModal]   = useState(false);
  const [refresh, setRefresh]                 = useState(0);
  const [tasks]                               = useState<Task[]>([]);

  const handleTasksGenerated = () => {
    setRefresh((prev) => prev + 1);
    setShowMeetingModal(false);
    setActiveTab("dashboard");
  };

  const tabLabel: Record<string, string> = {
    dashboard: "Dashboard",
    meeting:   "New Meeting",
    tasks:     "Tasks",
    logs:      "Activity Logs",
    agents:    "Agents",
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex md:hidden"
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 bg-white shadow-2xl"
            >
              <Sidebar setActiveTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} activeTab={activeTab} />
            </motion.div>
            <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 flex-shrink-0 bg-white shadow-sm">
        <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <div className="flex justify-between items-center px-5 py-3.5 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-500 hover:text-black text-xl transition"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <div>
              <h1 className="text-sm font-semibold">{tabLabel[activeTab] || "Dashboard"}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">TaskPilot AI · 6 agents active</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* NOTIFICATION BELL */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((p) => !p)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                aria-label="Notifications"
              >
                <span className="text-base">🔔</span>
                {tasks.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tasks.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 z-50">
                    <NotificationPanel
                      tasks={tasks}
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* NEW MEETING */}
            <button
              onClick={() => setShowMeetingModal(true)}
              className="bg-black text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition flex items-center gap-1.5"
            >
              <span>＋</span>
              <span className="hidden sm:inline">New Meeting</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <>
              {/* STATS GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{s.icon}</span>
                    </div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* AGENTS */}
              <Agents />

              {/* ESCALATIONS */}
              <Escalations />

              {/* MEETING LIST */}
              <div>
                <h2 className="text-sm font-semibold mb-3 text-gray-700">Recent Meetings</h2>
                <MeetingList />
              </div>

              {/* TASK TABLE */}
              <TaskTable refresh={refresh} />
            </>
          )}

          {activeTab === "meeting" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold mb-4">Process Meeting Transcript</h2>
              <MeetingChat onDone={handleTasksGenerated} />
            </div>
          )}

          {activeTab === "tasks" && <TaskTable refresh={refresh} />}

          {activeTab === "logs" && <ActivityLogs />}

          {activeTab === "agents" && <Agents />}
        </div>
      </div>

      {/* MEETING MODAL */}
      <AnimatePresence>
        {showMeetingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowMeetingModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <div>
                  <h2 className="font-semibold">New Meeting</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Paste transcript · AI agents extract tasks automatically</p>
                </div>
                <button
                  onClick={() => setShowMeetingModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <MeetingChat onDone={handleTasksGenerated} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
