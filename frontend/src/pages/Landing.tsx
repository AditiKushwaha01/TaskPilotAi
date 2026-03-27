import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FEATURES = [
  { icon: "🤖", title: "AI Task Extraction",  desc: "Agents parse transcripts and produce structured, assignable tasks instantly." },
  { icon: "⏰", title: "Smart Reminders",      desc: "Reminder Agent monitors deadlines and fires notifications before it's too late." },
  { icon: "🚨", title: "Auto Escalation",      desc: "Overdue tasks get escalated automatically — no manual follow-up required." },
  { icon: "📜", title: "Full Audit Trail",     desc: "Every agent action is logged with timestamps for complete accountability." },
  { icon: "📝", title: "Meeting Summaries",    desc: "Summary Agent generates concise briefs with top owners and key stats." },
  { icon: "⚡", title: "Multi-Agent Pipeline", desc: "6 specialised agents collaborate to execute the full workflow autonomously." },
];

const STEPS = [
  { step: "01", label: "Paste Transcript", desc: "Drop in any meeting transcript." },
  { step: "02", label: "Agents Process",   desc: "AI pipeline extracts & assigns tasks." },
  { step: "03", label: "Track & Execute",  desc: "Monitor, remind, escalate automatically." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full mb-6 border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            ET AI Hackathon 2026 · Track 2: Autonomous Workflows
          </span>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
            Turn Meetings into<br />
            <span className="text-indigo-600">Action — Automatically</span>
          </h1>

          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            6 AI agents extract tasks, assign owners, send reminders, escalate delays,
            and maintain a full audit trail — with zero manual effort.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
            >
              Try Demo →
            </button>
            <button
              onClick={() => navigate("/about")}
              className="border border-gray-200 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition text-gray-600"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* AGENT BADGES */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-10"
        >
          {["🤖 AI Agent", "📋 Task Agent", "📝 Summary Agent", "⏰ Reminder Agent", "🚨 Escalation Agent", "🔔 Notification Agent"].map((a) => (
            <span key={a} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {a}
            </span>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition"
            >
              <span className="text-3xl font-bold text-indigo-100">{s.step}</span>
              <h3 className="font-semibold mt-2 mb-1">{s.label}</h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">Everything Automated</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="font-semibold mt-3 mb-1 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to automate your meetings?</h2>
        <p className="text-gray-400 mb-6 text-sm">No setup needed. Paste a transcript and watch the agents work.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-black text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
        >
          Open Dashboard →
        </button>
      </section>

      <Footer />
    </div>
  );
}
