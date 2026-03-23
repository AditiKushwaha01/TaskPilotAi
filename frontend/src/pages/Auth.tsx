import { useState } from "react";
import { motion } from "framer-motion";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center items-center bg-black text-white p-10">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              {isLogin ? "Welcome Back" : "Join TaskPilot"}
            </h2>
            <p className="text-sm text-gray-300">
              {isLogin
                ? "Login to continue automating your meetings"
                : "Create an account and start automating tasks"}
            </p>
          </motion.div>
        </div>

        {/* RIGHT PANEL (FORM) */}
        <div className="p-8 flex flex-col justify-center">
          <motion.div
            key={isLogin ? "login-form" : "signup-form"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>

            <form className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 border rounded-xl"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-xl"
              />

              <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
                {isLogin ? "Login" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-semibold"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}