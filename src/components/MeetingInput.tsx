import { useState } from "react";

export default function MeetingInput() {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  const handleGenerate = () => {
    setLoading(true);

    setTimeout(() => {
      setTasks([
        { name: "Finalize UI", owner: "You", status: "Pending" },
        { name: "Deploy app", owner: "Team", status: "In Progress" },
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100">
      <textarea
        className="w-full border p-3 rounded mb-4"
        placeholder="Paste your meeting transcript here..."
      />

      <button
        onClick={handleGenerate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "AI is analyzing..." : "Generate Tasks"}
      </button>

      {/* Show generated tasks */}
      {tasks.length > 0 && (
        <div className="mt-4 space-y-2">
          {tasks.map((t, i) => (
            <div key={i} className="p-2 border rounded">
              {t.name} - {t.owner} ({t.status})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}