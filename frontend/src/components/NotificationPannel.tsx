import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
  onClose: () => void;
};

const TYPE_CONFIG = {
  PENDING:   { icon: "📌", bg: "bg-yellow-50",  text: "text-yellow-700", label: "Assigned" },
  COMPLETED: { icon: "✅", bg: "bg-green-50",   text: "text-green-700",  label: "Done" },
  REJECTED:  { icon: "❌", bg: "bg-red-50",     text: "text-red-600",    label: "Rejected" },
  DELAYED:   { icon: "⚠️", bg: "bg-orange-50",  text: "text-orange-600", label: "Delayed" },
};

export default function NotificationPanel({ tasks, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const unread = tasks.filter((t) => t.status === "PENDING").length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 w-80 overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Notifications</span>
          {unread > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full leading-none">
              {unread}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
      </div>

      {/* LIST */}
      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
        {!tasks.length ? (
          <div className="text-center py-10 text-sm text-gray-400">
            <p className="text-2xl mb-2">🔔</p>
            <p>No notifications yet</p>
          </div>
        ) : (
          tasks.map((t) => {
            const cfg = TYPE_CONFIG[t.status] || TYPE_CONFIG["PENDING"];
            return (
              <div
                key={t.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${cfg.bg}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate font-medium">
                    {t.title || t.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
                    {t.owner && <span className="text-xs text-gray-400">· {t.owner}</span>}
                  </div>
                  {t.deadline && (
                    <p className="text-xs text-gray-300 mt-0.5 font-mono">Due: {t.deadline}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {tasks.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100">
          <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition">
            Mark all as read
          </button>
        </div>
      )}
    </motion.div>
  );
}
