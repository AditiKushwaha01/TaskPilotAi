export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-gray-600">
        {/* BRAND */}
        <div>
          <h2 className="font-semibold text-black mb-2">TaskPilot AI</h2>
          <p>
            Transform meetings into execution with AI-powered agents.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="font-semibold text-black mb-2">Product</h3>
          <ul className="space-y-1">
            <li className="hover:text-black cursor-pointer">Features</li>
            <li className="hover:text-black cursor-pointer">Pricing</li>
            <li className="hover:text-black cursor-pointer">Demo</li>
          </ul>
        </div>

        {/* LEGAL / SOCIAL */}
        <div>
          <h3 className="font-semibold text-black mb-2">Company</h3>
          <ul className="space-y-1">
            <li className="hover:text-black cursor-pointer">About</li>
            <li className="hover:text-black cursor-pointer">Contact</li>
            <li className="hover:text-black cursor-pointer">Privacy</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pb-6">
        © 2026 TaskPilot AI — Built for Hackathon 🚀
      </div>
    </footer>
  );
}
