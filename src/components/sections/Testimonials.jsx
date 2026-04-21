// src/components/sections/Testimonials.jsx
import { motion } from "framer-motion";
import { FaLinkedin, FaQuoteLeft } from "react-icons/fa";
import { testimonials, getInitials } from "../../constants/testimonials";

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="relative py-28 px-6 bg-white text-slate-900 overflow-hidden"
    >
      {/* Light Background Orbs */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-50/80 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-slate-50/80 blur-[100px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold text-blue-600 tracking-widest uppercase">
              Social Proof
            </p>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Testimonials
            </h2>
          </div>

          <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className="group relative overflow-hidden glass-card bg-slate-50/40 hover:bg-white flex flex-col transition-all duration-300 transform hover:-translate-y-1"
                aria-label={`Testimonial by ${t.name}`}
              >
                {/* Accent top bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity" />

                <div className="p-8 flex flex-col flex-1">
                  {/* Subtle quote icon */}
                  <FaQuoteLeft
                    aria-hidden="true"
                    className="absolute right-6 top-8 text-5xl text-blue-500/10 pointer-events-none"
                  />

                  {/* Author Header */}
                  <header className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-base font-extrabold shadow-md">
                      {getInitials(t.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-extrabold text-slate-900 text-lg">
                        {t.name}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500">
                        {t.role}
                      </p>
                    </div>

                    {t.linkedin && (
                      <a
                        href={t.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center justify-center rounded-full p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:-translate-y-0.5"
                        aria-label={`Open ${t.name}'s LinkedIn profile`}
                      >
                        <FaLinkedin className="text-xl" />
                      </a>
                    )}
                  </header>

                  {/* Quote Body */}
                  <div className="relative flex-1">
                    <p className="text-base leading-relaxed text-slate-600 font-medium italic relative z-10">
                      "{t.quote}"
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;