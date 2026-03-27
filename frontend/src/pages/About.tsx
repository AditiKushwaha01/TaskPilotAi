import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const FEATURES = [
  { title: "AI Task Extraction",  desc: "Converts meeting conversations into structured, assignable tasks instantly.", icon: "🤖" },
  { title: "Smart Reminders",     desc: "Ensures deadlines are never missed with intelligent, timely nudges.",         icon: "⏰" },
  { title: "Auto Escalation",     desc: "Escalates delayed tasks automatically to maintain full accountability.",       icon: "🚨" },
];

const AGENTS = [
  { name: "AI Agent",           role: "Task extraction via FastAPI",       icon: "🤖", color: "bg-indigo-50 text-indigo-600" },
  { name: "Task Agent",         role: "Normalise, deduplicate, save",      icon: "📋", color: "bg-blue-50 text-blue-600" },
  { name: "Summary Agent",      role: "Generate intelligent summaries",    icon: "📝", color: "bg-purple-50 text-purple-600" },
  { name: "Reminder Agent",     role: "Detect and fire deadline alerts",   icon: "⏰", color: "bg-yellow-50 text-yellow-700" },
  { name: "Escalation Agent",   role: "Handle overdue task escalations",   icon: "🚨", color: "bg-red-50 text-red-600" },
  { name: "Notification Agent", role: "Dispatch all system notifications", icon: "🔔", color: "bg-green-50 text-green-600" },
];

const TESTIMONIALS = [
  { quote: "Saved us hours every week!", user: "Product Lead" },
  { quote: "Finally meetings lead to execution.", user: "Engineering Manager" },
  { quote: "Best productivity tool we've used.", user: "Startup Founder" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full mb-5 border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            ET AI Hackathon 2026 · Track 2
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            About TaskPilot AI
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            TaskPilot AI transforms meetings into execution. Six specialised AI agents
            extract tasks, assign owners, track progress, send reminders, and escalate
            delays — all autonomously.
          </p>
        </motion.div>

        {/* HOW IT WORKS */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold">AI-Powered Workflow Automation</h2>
            <p className="text-gray-500 leading-relaxed">
              Convert long meetings into clear, actionable tasks with zero manual effort.
              Our multi-agent architecture handles the full lifecycle — from extraction to
              escalation — while maintaining a complete audit trail.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Multi-Agent", "Audit Trail", "Real-time", "Enterprise Ready"].map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 space-y-3"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Live AI Output</p>
            {[
              { icon: "🎯", text: "Design new dashboard UI", owner: "Priya",  status: "PENDING",   color: "text-yellow-600 bg-yellow-50" },
              { icon: "🚀", text: "Deploy API to production",  owner: "Dev",    status: "COMPLETED", color: "text-green-600 bg-green-50" },
              { icon: "⏰", text: "Send weekly report",        owner: "Sarah",  status: "DELAYED",   color: "text-red-600 bg-red-50" },
            ].map((item) => (
              <div key={item.text} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-gray-400">{item.owner}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-5 mb-24">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-semibold mt-3 mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* AGENTS */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-center mb-8">The Agent Team</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {AGENTS.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${a.color}`}>
                  {a.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">Loved by Teams</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <p className="text-gray-700 text-sm leading-relaxed">"{t.quote}"</p>
                <p className="mt-3 text-xs text-gray-400 font-medium">— {t.user}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
