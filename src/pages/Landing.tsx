import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <section className="text-center mt-20 px-10 ">
        <h1 className="text-5xl font-bold mb-4">
          Turn Meetings into Action — Automatically
        </h1>
        <p className="text-gray-500 mb-6">
          AI agents extract tasks, assign owners, and track execution.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="bg-black text-white px-6 py-3 rounded-xl">
            Try Demo
          </button>
          <button onClick={() => navigate("/dashboard")} className="border px-6 py-3 rounded-xl">
            View Dashboard
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
