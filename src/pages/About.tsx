import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="flex-1 max-w-6xl mx-auto px-6 py-16">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About TaskPilot AI
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            TaskPilot AI transforms meetings into execution. Our AI agents
            automatically extract tasks, assign owners, track progress,
            send reminders, and escalate delays.
          </p>
        </motion.div>

        {/* INTERACTIVE DEMO SECTION */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">
              AI-Powered Workflow Automation
            </h2>
            <p className="text-gray-600">
              Convert long meetings into clear, actionable tasks with zero
              manual effort. Let AI handle execution while you focus on impact.
            </p>
          </motion.div>

          {/* INTERACTIVE CARD */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white shadow-xl rounded-2xl p-6 space-y-4"
          >
            <p className="text-sm text-gray-500">Live AI Output</p>

            <div className="p-3 border rounded-lg hover:bg-gray-50 transition">
              🎯 Design UI → Assigned to You
            </div>

            <div className="p-3 border rounded-lg hover:bg-gray-50 transition">
              🚀 Deploy App → Team
            </div>

            <div className="p-3 border rounded-lg hover:bg-gray-50 transition">
              ⏰ Send Report → Tomorrow
            </div>
          </motion.div>
        </div>

        {/* FEATURES SECTION */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            {
              title: "AI Task Extraction",
              desc: "Automatically converts conversations into structured tasks.",
            },
            {
              title: "Smart Reminders",
              desc: "Ensures deadlines are never missed with intelligent nudges.",
            },
            {
              title: "Auto Escalation",
              desc: "Escalates delayed tasks to maintain accountability.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -6 }}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* TESTIMONIALS */}
        <div className="mb-24">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Loved by Teams
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Saved us hours every week!",
              "Finally meetings lead to execution.",
              "Best productivity tool we’ve used.",
            ].map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-white rounded-xl shadow text-gray-600"
              >
                “{t}”
                <p className="mt-2 text-sm text-gray-400">— User {i + 1}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AGENTS SECTION */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Task Agent",
            "Reminder Agent",
            "Escalation Agent",
          ].map((a) => (
            <div
              key={a}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{a}</h3>
              <p className="text-green-500 text-sm">Active & Monitoring</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
