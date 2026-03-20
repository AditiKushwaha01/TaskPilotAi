import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between p-4 border-b">
      <h1 className="font-semibold">Dashboard</h1>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-black text-white px-4 py-2 rounded"
      >
        New Meeting
      </button>
    </div>
  );
}