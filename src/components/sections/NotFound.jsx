import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="relative min-h-dvh bg-bg-secondary text-text-primary flex items-center justify-center px-6 overflow-hidden transition-colors duration-300">
      {/* Background orbs */}
      <div aria-hidden="true" className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-primary-light/5 blur-[140px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-secondary-light/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 text-center space-y-8 max-w-lg"
      >
        <p className="text-sm font-bold text-accent-primary tracking-widest uppercase">404 — Not Found</p>

        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight text-text-primary leading-none">
          404
        </h1>

        <p className="text-xl font-semibold text-text-secondary leading-relaxed">
          This page doesn't exist. You may have mistyped the URL or the page has moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary-light text-white px-8 py-4 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </section>
  );
}
