import { motion } from "framer-motion";

const AGENTS = [
  {
    name: "AI Agent",
    role: "Extracts tasks from transcripts via FastAPI",
    icon: "🤖",
    color: "bg-indigo-50 text-indigo-600",
    dot: "bg-indigo-400",
  },
  {
    name: "Task Agent",
    role: "Normalizes, deduplicates, assigns tasks",
    icon: "📋",
    color: "bg-blue-50 text-blue-600",
    dot: "bg-blue-400",
  },
  {
    name: "Summary Agent",
    role: "Generates intelligent meeting summaries",
    icon: "📝",
    color: "bg-purple-50 text-purple-600",
    dot: "bg-purple-400",
  },
  {
    name: "Reminder Agent",
    role: "Detects tasks nearing deadlines",
    icon: "⏰",
    color: "bg-yellow-50 text-yellow-700",
    dot: "bg-yellow-400",
  },
  {
    name: "Escalation Agent",
    role: "Handles overdue tasks and alerts",
    icon: "🚨",
    color: "bg-red-50 text-red-600",
    dot: "bg-red-400",
  },
  {
    name: "Notification Agent",
    role: "Dispatches all system notifications",
    icon: "🔔",
    color: "bg-green-50 text-green-600",
    dot: "bg-green-400",
  },
];

export default function Agents() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="mb-4">
        <h2 className="font-semibold text-sm">Active Agents</h2>
        <p className="text-xs text-gray-400 mt-0.5">6 agents running autonomously</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AGENTS.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${a.color}`}>
              {a.icon}
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{a.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{a.role}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${a.dot}`} />
                <span className="text-xs text-green-600 font-medium">Active</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
