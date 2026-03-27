import { useState } from "react";
import { motion } from "framer-motion";

type LogEntry = {
  id: string;
  agent: string;
  action: string;
  detail: string;
  status: "success" | "error" | "info" | "warn";
  timeStr: string;
};

const AGENT_ICONS: Record<string, string> = {
  AI: "🤖", Task: "📋", Summary: "📝",
  Reminder: "⏰", Escalation: "🚨", Notification: "🔔", Audit: "📜",
};

const STATUS_DOT: Record<string, string> = {
  success: "bg-green-400",
  error: "bg-red-400",
  info: "bg-indigo-400",
  warn: "bg-yellow-400",
};

const STATUS_TEXT: Record<string, string> = {
  success: "text-green-600",
  error: "text-red-500",
  warn: "text-yellow-600",
  info: "text-indigo-600",
};

// Mock logs — replace with real API call when backend is ready
const MOCK_LOGS: LogEntry[] = [
  { id: "1", agent: "AI",           action: "Task extraction complete",       detail: "5 tasks extracted via AIService",                    status: "success", timeStr: "09:42:11" },
  { id: "2", agent: "Task",         action: "Tasks saved to database",        detail: "Deduplicated & normalized 5 tasks",                  status: "success", timeStr: "09:42:13" },
  { id: "3", agent: "Summary",      action: "Summary generated",              detail: "Top owner: Priya · 2 high-priority tasks",           status: "success", timeStr: "09:42:14" },
  { id: "4", agent: "Notification", action: "Notifications dispatched",       detail: "5 assignment notifications sent",                    status: "info",    timeStr: "09:42:15" },
  { id: "5", agent: "Reminder",     action: "Deadline watchers scheduled",    detail: "Watchers set for 5 tasks",                          status: "success", timeStr: "09:42:16" },
  { id: "6", agent: "Escalation",   action: "Escalation check ran",          detail: "No overdue tasks found",                            status: "info",    timeStr: "09:43:00" },
  { id: "7", agent: "Reminder",     action: "Reminder fired",                detail: "Task 'Deploy API' due in 24h — reminder sent",      status: "warn",    timeStr: "10:00:00" },
  { id: "8", agent: "Escalation",   action: "Task escalated",                detail: "Task 'Fix auth bug' overdue — escalated to manager", status: "error",   timeStr: "11:30:00" },
];

const FILTER_OPTIONS = ["All", "AI", "Task", "Reminder", "Escalation", "Notification"];

export default function ActivityLogs() {
  const [filter, setFilter] = useState("All");

  const logs = filter === "All" ? MOCK_LOGS : MOCK_LOGS.filter((l) => l.agent === filter);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-sm">Activity Log</h2>
            <p className="text-xs text-gray-400 mt-0.5">Full audit trail · every agent action logged</p>
          </div>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">{logs.length} entries</span>
        </div>

        {/* FILTERS */}
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                filter === f ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f !== "All" && (AGENT_ICONS[f] || "")} {f}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE */}
      <div className="p-5 space-y-2 max-h-[520px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No log entries found.</p>
        ) : (
          <div className="relative pl-5">
            {/* Vertical line */}
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-200 to-gray-100" />

            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="relative mb-3 last:mb-0"
              >
                {/* Dot */}
                <span className={`absolute -left-[13px] top-3 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_DOT[log.status]}`} />

                <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 hover:border-gray-200 transition">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-mono">
                      {AGENT_ICONS[log.agent] || "⚙"} {log.agent}Agent
                    </span>
                    <span className="text-xs font-semibold text-gray-700 flex-1">{log.action}</span>
                    <span className="text-xs text-gray-400 font-mono">{log.timeStr}</span>
                  </div>
                  <p className={`text-xs ${STATUS_TEXT[log.status] || "text-gray-500"}`}>
                    {log.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
