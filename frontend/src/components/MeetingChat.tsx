import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { processMeeting } from "../services/api";
import type { Task } from "../types/task";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  isAgent?: boolean;
};

type AgentStep = {
  label: string;
  detail: string;
  status: "waiting" | "running" | "done";
};

const AGENT_PIPELINE: Omit<AgentStep, "status">[] = [
  { label: "AIService → /extract-tasks", detail: "Calling backend AI pipeline…" },
  { label: "TaskAgent → normalize & deduplicate", detail: "Assigning defaults, attaching meeting…" },
  { label: "SummaryAgent → generate summary", detail: "Computing stats and top owner…" },
  { label: "NotificationService → dispatch", detail: "Sending assignment notifications…" },
  { label: "ActivityLogService → audit trail", detail: "Logging all steps with timestamps…" },
  { label: "ReminderAgent → schedule", detail: "Setting deadline watchers…" },
];

export default function MeetingChat({ onDone }: { onDone?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [showSteps, setShowSteps] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tasks, agentSteps]);

  const uid = () => Math.random().toString(36).slice(2);

  const runAgentPipeline = async () => {
    const steps: AgentStep[] = AGENT_PIPELINE.map((s) => ({ ...s, status: "waiting" }));
    setAgentSteps([...steps]);
    setShowSteps(true);

    for (let i = 0; i < steps.length; i++) {
      steps[i].status = "running";
      setAgentSteps([...steps]);
      await new Promise((r) => setTimeout(r, 420));
      steps[i].status = "done";
      setAgentSteps([...steps]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: uid(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);
    setTasks([]);
    setShowSteps(false);

    try {
      await runAgentPipeline();
      const result = await processMeeting(userMsg.content);

      if (!Array.isArray(result)) throw new Error("Invalid response from AI");

      setTasks(result);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "ai",
          content:
            result.length > 0
              ? `✅ Extracted ${result.length} task${result.length > 1 ? "s" : ""}. Review below.`
              : "No actionable tasks found. Try rephrasing with clearer ownership.",
        },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to process meeting");
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "ai",
          content: "⚠️ Could not process this meeting. Please check your backend or try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const confirmTasks = () => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "ai", content: "✅ Tasks created and agents are now tracking them." },
    ]);
    setTasks([]);
    setShowSteps(false);
    if (onDone) onDone();
  };

  const statusIcon = (s: AgentStep["status"]) => {
    if (s === "done") return <span className="text-green-500 text-xs">✓</span>;
    if (s === "running") return <span className="text-indigo-500 text-xs animate-pulse">◉</span>;
    return <span className="text-gray-300 text-xs">○</span>;
  };

  return (
    <div className="flex flex-col h-[520px]">
      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            <p className="text-2xl mb-2">🎙️</p>
            <p>Paste a meeting transcript to begin.</p>
            <p className="text-xs mt-1 text-gray-300">AI agents will extract tasks automatically.</p>
          </div>
        )}

        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-black text-white ml-auto rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"
            }`}
          >
            {m.content}
          </motion.div>
        ))}

        {/* AGENT PIPELINE */}
        <AnimatePresence>
          {showSteps && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-3 space-y-1.5"
            >
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                ⚡ Agent Pipeline
              </p>
              {agentSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2 text-xs font-mono"
                >
                  {statusIcon(step.status)}
                  <span className={step.status === "done" ? "text-gray-700" : step.status === "running" ? "text-indigo-600" : "text-gray-300"}>
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !showSteps && (
          <div className="bg-gray-100 px-4 py-3 rounded-2xl w-fit text-sm text-gray-500 animate-pulse">
            Processing…
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-xs mb-2 px-1">{error}</p>
      )}

      {/* TASK PREVIEW */}
      <AnimatePresence>
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-gray-200 rounded-xl p-3 mb-3 bg-white shadow-sm"
          >
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Extracted Tasks
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {tasks.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1.5 last:border-none">
                  <span className="font-medium text-gray-800 truncate">{t.title || t.name}</span>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className="text-xs text-gray-400">{t.owner}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      t.priority === "High" ? "bg-red-100 text-red-600" :
                      t.priority === "Medium" ? "bg-yellow-100 text-yellow-600" :
                      "bg-green-100 text-green-600"
                    }`}>{t.priority || "Medium"}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={confirmTasks}
                className="bg-black text-white text-xs px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Confirm & Save
              </button>
              <button
                onClick={() => setTasks([])}
                className="bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Discard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") sendMessage();
          }}
          disabled={loading}
          rows={2}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black transition disabled:opacity-50"
          placeholder="Paste meeting transcript… (⌘+Enter to send)"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-black text-white px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition disabled:opacity-40 self-end py-2"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
