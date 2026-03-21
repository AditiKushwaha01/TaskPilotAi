import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MeetingChat from "../components/MeetingChat";
import TaskTable from "../components/TaskTable";
import NotificationPanel from "../components/NotificationPannel";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [tasks, setTasks] = useState([]);

  const handleTasksGenerated = () => {
    setRefresh((prev) => prev + 1);
    setShowMeetingModal(false);
    setActiveTab("dashboard");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="fixed inset-0 z-50 flex"
        >
          <div className="w-64 bg-white shadow-xl p-4">
            <Sidebar setActiveTab={setActiveTab} />
          </div>

          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </motion.div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 bg-white shadow-md">
        <Sidebar setActiveTab={setActiveTab} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>

            <h1
              onClick={() => setActiveTab("dashboard")}
              className="text-xl font-bold cursor-pointer"
            >
              TaskPilot
            </h1>
          </div>

    <div className="relative">
  <button
    onClick={() => setShowNotifications((prev) => !prev)}
    className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition relative"
  >
    🔔

    {/* 🔥 Badge (optional but powerful) */}
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
      {tasks?.length || 0}
    </span>
  </button>

  {/* 🔥 Dropdown panel */}
  {showNotifications && (
    <div className="absolute right-0 mt-2 z-50">
      <NotificationPanel tasks={tasks} />
    </div>
  )}
</div>


          {/* 🔥 FIXED BUTTON */}
          <button
            onClick={() => setShowMeetingModal(true)}
            className="bg-black text-white px-4 py-2 rounded-xl hover:scale-105 transition"
          >
            + New Meeting
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 overflow-y-auto">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Meetings" value="12" />
                <Card title="Upcoming" value="3" />
                <Card title="Tasks Pending" value="--" />
                <Card title="Completed" value="--" />
              </div>

              <Performance />

              {/* 🔥 EMPTY STATE (VERY IMPORTANT UX) */}
              <EmptyState onCreate={() => setShowMeetingModal(true)} />

              <TaskTable refresh={refresh} />
            </>
          )}

          {/* KEEP TAB FLOW */}
          {activeTab === "meeting" && (
            <MeetingChat onDone={handleTasksGenerated} />
          )}

          {activeTab === "tasks" && (
            <TaskTable refresh={refresh} />
          )}

          {activeTab === "logs" && <ActivityLogs />}
        </div>
      </div>

      {/* 🔥 MODAL (PRIMARY UX) */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">New Meeting</h2>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <MeetingChat onDone={handleTasksGenerated} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* 🔥 NEW EMPTY STATE COMPONENT */
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
      <p className="text-gray-600 mb-4">
        No recent meetings processed
      </p>
      <button
        onClick={onCreate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create New Meeting
      </button>
    </div>
  );
}

/* EXISTING COMPONENTS */

function Card({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition"
    >
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}

function Performance() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="font-semibold mb-4">Performance Overview</h2>
      <div className="space-y-2 text-sm text-gray-600">
        <p>✔ Tasks completed this year: 120</p>
        <p>⏳ Pending tasks: 8</p>
        <p>⚠ Delayed tasks: 2</p>
      </div>
    </div>
  );
}

function ActivityLogs() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="font-semibold mb-4">Activity Logs</h2>
      <div className="space-y-3 text-sm text-gray-600">
        <div>✅ Task completed: Design UI</div>
        <div>📅 Meeting created: Sprint Planning</div>
        <div>⚠ Task delayed: API Integration</div>
      </div>
    </div>
  );
}