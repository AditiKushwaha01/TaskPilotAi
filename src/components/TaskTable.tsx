import type { Task } from "../types/task";
import { motion } from "framer-motion";

export default function TaskTable() {
  const tasks: Task[] = [
    { name: "Design UI", owner: "You", status: "Pending" },
    { name: "API Integration", owner: "Alex", status: "Completed" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Delayed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Tasks</h2>
        <span className="text-sm text-gray-500">
          {tasks.length} total
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="text-left py-3">Task</th>
              <th className="text-left py-3">Owner</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t, i) => (
              <motion.tr
                key={i}
                whileHover={{ scale: 1.01 }}
                className="border-b last:border-none"
              >
                <td className="py-4 font-medium">{t.name}</td>
                <td className="py-4 text-gray-600">{t.owner}</td>

                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}