import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MeetingChat from "../components/MeetingChat";
import TaskTable from "../components/TaskTable";
import NotificationPanel from "../components/NotificationPannel";
import ActivityLogs from "../components/ActivityLogs";
import Agents from "../components/Agents";
import MeetingList from "../components/MeetingList";
import type { Task } from "../types/task";
import { useAuth0 } from "@auth0/auth0-react";
import { createApi } from "../services/api";

const STATS = [
  { label: "Total Meetings", value: "12", icon: "🗓", color: "text-indigo-600" },
  { label: "Upcoming", value: "3", icon: "⏳", color: "text-yellow-600" },
  { label: "Tasks Pending", value: "8", icon: "📋", color: "text-blue-600" },
  { label: "Completed", value: "47", icon: "✅", color: "text-green-600" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // ✅ FIX: Tasks state (centralized)
  const [tasks, setTasks] = useState<Task[]>([]);

  const { getAccessTokenSilently } = useAuth0();
  const api = createApi(getAccessTokenSilently);


  // ✅ FETCH TASKS
  const loadTasks = async () => {
  try {
    const data = await api.getTasks();

    setTasks((prev) => {
      // prevent unnecessary re-renders
      if (JSON.stringify(prev) === JSON.stringify(data)) {
        return prev;
      }
      return data;
    });
  } catch (err) {
    console.error(err);
  }
};

 // ✅ AUTO LOAD TASKS
  useEffect(() => {
    loadTasks();
  }, [refresh]);

 
  const triggerRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleTasksGenerated = () => {
    triggerRefresh();
    setShowMeetingModal(false);
    setActiveTab("dashboard");
  };

  const tabLabel: Record<string, string> = {
    dashboard: "Dashboard",
    meeting: "New Meeting",
    tasks: "Tasks",
    logs: "Activity Logs",
    agents: "Agents",
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div className="w-64 bg-white shadow-2xl">
              <Sidebar
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
                activeTab={activeTab}
              />
            </motion.div>
            <div
              className="flex-1 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 bg-white shadow-sm">
        <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <div className="flex justify-between items-center px-5 py-3 bg-white border-b">

          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden">
              ☰
            </button>
            <h1 className="text-sm font-semibold">
              {tabLabel[activeTab]}
            </h1>
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={() => setShowNotifications((p) => !p)}
            >
              🔔
            </button>

            <button
              onClick={() => setShowMeetingModal(true)}
              className="bg-black text-white px-3 py-1 rounded"
            >
              + New Meeting
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-white p-4 rounded-xl">
                    <p className={`text-xl font-bold ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-sm font-semibold mb-2">
                  Recent Meetings
                </h2>
                <MeetingList key={refresh} />
              </div>
            </>
          )}

          {activeTab === "meeting" && (
            <MeetingChat onDone={handleTasksGenerated} />
          )}

          {/* ✅ PASS TASKS */}
          {activeTab === "tasks" && (
            <TaskTable
              tasks={tasks}
              refresh={refresh}
              onUpdate={triggerRefresh}
            />
          )}

          {activeTab === "logs" && <ActivityLogs />}
          {activeTab === "agents" && <Agents />}
        </div>
      </div>

      {/* ✅ NOTIFICATION PANEL FIX */}
      <AnimatePresence>
        {showNotifications && (
          <div className="absolute right-5 top-16 z-50">
            <NotificationPanel
              tasks={tasks}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      <AnimatePresence>
        {showMeetingModal && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
              <h2 className="mb-3 font-semibold">New Meeting</h2>
              <MeetingChat onDone={handleTasksGenerated} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}