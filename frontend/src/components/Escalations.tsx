import { motion } from "framer-motion";

type EscalatedTask = {
  id: number;
  title: string;
  owner: string;
  overdueSince: string;
  severity: "High" | "Critical";
};

// Replace with real API data when ready
const MOCK_ESCALATIONS: EscalatedTask[] = [
  { id: 1, title: "Fix production auth bug",  owner: "Dev",   overdueSince: "2 days", severity: "Critical" },
  { id: 2, title: "Submit Q1 compliance doc", owner: "Sarah", overdueSince: "1 day",  severity: "High" },
];

export default function Escalations() {
  if (!MOCK_ESCALATIONS.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-sm text-gray-400">
        <p className="text-2xl mb-2">✅</p>
        <p>No escalated tasks. Everything is on track.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <span className="text-red-500">🚨</span>
        <h2 className="font-semibold text-sm">Escalated Tasks</h2>
        <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
          {MOCK_ESCALATIONS.length} overdue
        </span>
      </div>

      <div className="divide-y divide-gray-50">
        {MOCK_ESCALATIONS.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.severity === "Critical" ? "bg-red-500" : "bg-orange-400"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">Owner: {task.owner} · Overdue by {task.overdueSince}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
              task.severity === "Critical" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
            }`}>
              {task.severity}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
