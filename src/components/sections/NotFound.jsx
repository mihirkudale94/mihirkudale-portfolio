import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="relative min-h-dvh bg-slate-50 text-slate-900 flex items-center justify-center px-6 overflow-hidden">
      {/* Background orbs */}
      <div aria-hidden="true" className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[140px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 text-center space-y-8 max-w-lg"
      >
        <p className="text-sm font-bold text-blue-600 tracking-widest uppercase">404 — Not Found</p>

        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight text-slate-900 leading-none">
          404
        </h1>

        <p className="text-xl font-semibold text-slate-600 leading-relaxed">
          This page doesn't exist. You may have mistyped the URL or the page has moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-base shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </section>
  );
}
