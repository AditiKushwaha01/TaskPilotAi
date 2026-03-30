import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // ✅ Auth0 hooks
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  // ✅ Redirect after login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // ✅ Show loading while Auth0 initializes
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center items-center bg-black text-white p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 w-32 h-32 rounded-full border border-white" />
            <div className="absolute bottom-16 right-8 w-48 h-48 rounded-full border border-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35 }}
              className="text-center relative z-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl mx-auto mb-5">
                ✈
              </div>
              <h2 className="text-2xl font-bold mb-3">
                {isLogin ? "Welcome Back" : "Join TaskPilot"}
              </h2>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                {isLogin
                  ? "Log in to continue automating your meetings with AI agents."
                  : "Create an account and start turning meetings into action."}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["🤖 AI Agent", "⏰ Reminders", "🚨 Escalation"].map((a) => (
                  <span key={a} className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-lg">
                    {a}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 flex flex-col justify-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-gray-400 hover:text-black transition mb-6 flex items-center gap-1 w-fit"
          >
            ← Back to Home
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-form" : "signup-form"}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-1">
                {isLogin ? "Log In" : "Sign Up"}
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {isLogin ? "Continue with secure authentication." : "Create your free account securely."}
              </p>

              {/* 🔥 IMPORTANT: Inputs are now UI only */}
              <div className="space-y-3">
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                    disabled
                  />
                )}
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  disabled
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  disabled
                />

                {/* ✅ REAL AUTH BUTTON */}
                <button
                  onClick={() =>
                    loginWithRedirect({
                      authorizationParams: isLogin
                        ? {}
                        : { screen_hint: "signup" },
                    })
                  }
                  className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                >
                  {isLogin ? "Log In" : "Create Account"} →
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-5">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1.5 text-black font-semibold hover:underline"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}