import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-gray-500">
        <div>
          <h2 className="font-semibold text-black mb-2 tracking-tight">
            TaskPilot <span className="text-indigo-600">AI</span>
          </h2>
          <p className="text-sm leading-relaxed">
            Transform meetings into execution with AI-powered agents.
          </p>
          <div className="flex gap-2 mt-3">
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg border border-green-100">6 Agents Active</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100">Agentic AI</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-black mb-3">Product</h3>
          <ul className="space-y-2 text-sm">
            {["Features", "Pricing", "Demo"].map((item) => (
              <li key={item}>
                <button className="hover:text-black transition">{item}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-black mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => navigate("/about")} className="hover:text-black transition">About</button></li>
            <li><button className="hover:text-black transition">Contact</button></li>
            <li><button className="hover:text-black transition">Privacy</button></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © 2026 TaskPilot AI — Built for ET AI Hackathon 🚀
      </div>
    </footer>
  );
}
