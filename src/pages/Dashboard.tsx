import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MeetingInput from "../components/MeetingInput";
import TaskTable from "../components/TaskTable";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
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

          <button
            onClick={() => setActiveTab("meeting")}
            className="bg-black text-white px-4 py-2 rounded-xl hover:scale-105 transition"
          >
            + New Meeting
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === "dashboard" && (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Meetings" value="12" />
                <Card title="Upcoming" value="3" />
                <Card title="Tasks Pending" value="5" />
                <Card title="Completed" value="20" />
              </div>

              {/* PERFORMANCE */}
              <Performance />

              {/* TASK TABLE */}
              <TaskTable />
            </>
          )}

          {activeTab === "meeting" && <MeetingInput />}

          {activeTab === "tasks" && <TaskTable />}

          {activeTab === "logs" && <ActivityLogs />}
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function Card({ title, value }) {
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
