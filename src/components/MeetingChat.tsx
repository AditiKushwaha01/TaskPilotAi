import { useEffect, useRef, useState } from "react";
import { processMeeting } from "../services/api";

type Message = {
  role: "user" | "ai";
  content: string;
};

type Task = {
  id?: number;
  title?: string;
  name?: string;
  owner: string;
  status: string;
};

export default function MeetingChat({ onDone }: { onDone?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tasks]);

  // 🔥 Send Message
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);
    setTasks([]);

    try {
      const result = await processMeeting(input);

      // 🔥 Validate response
      if (!Array.isArray(result)) {
        throw new Error("Invalid response from AI");
      }

      setTasks(result);

      const aiMsg: Message = {
        role: "ai",
        content:
          result.length > 0
            ? `I found ${result.length} tasks. Please review below.`
            : "No actionable tasks found. Try rephrasing.",
      };

      setMessages((prev) => [...prev, aiMsg]);

    } catch (err: any) {
      console.error(err);

      setError(err.message || "Failed to process meeting");

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "⚠️ I couldn’t process this meeting. Please try again with clearer details.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Confirm Tasks
  const confirmTasks = () => {
    setMessages((prev) => [
      ...prev,
      { role: "ai", content: "✅ Tasks created successfully." },
    ]);

    if (onDone) onDone();
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px]">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-3 rounded-xl text-sm ${
              m.role === "user"
                ? "bg-black text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}

        {/* 🔥 Typing Indicator */}
        {loading && (
          <div className="bg-gray-200 p-3 rounded-xl w-fit text-sm">
            AI is thinking...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 🔥 ERROR */}
      {error && (
        <p className="text-red-500 text-xs mb-2">{error}</p>
      )}

      {/* 🔥 TASK PREVIEW */}
      {tasks.length > 0 && (
        <div className="border rounded-xl p-3 mb-3 bg-gray-50">
          <h4 className="text-sm font-semibold mb-2">
            Suggested Tasks
          </h4>

          <div className="space-y-2">
            {tasks.map((t, i) => (
              <div
                key={i}
                className="text-sm flex justify-between border-b pb-1"
              >
                <span>{t.title || t.name}</span>
                <span className="text-gray-500">{t.owner}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={confirmTasks}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Confirm
            </button>

            <button
              onClick={() => setTasks([])}
              className="bg-gray-300 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Type meeting discussion..."
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-4 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}