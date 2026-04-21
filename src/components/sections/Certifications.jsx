import React from "react";
import { motion } from "framer-motion";
import { BsPatchCheckFill } from "react-icons/bs";
import { certifications } from "../../constants/certifications";

const Certifications = () => {
  return (
    <section
      id="certifications"
      className="relative py-28 px-6 bg-slate-50 text-slate-900 overflow-hidden"
    >
      {/* Soft Background Orbs */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-100/60 blur-[100px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full bg-violet-100/60 blur-[80px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="max-w-6xl w-full mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold text-blue-600 tracking-widest uppercase">
              Credentials
            </p>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <a
                key={index}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${cert.title} by ${cert.issuer}`}
                className="flex items-center gap-5 glass-card bg-white p-6 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Logo wrapper */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white border-2 border-slate-100 p-2 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={cert.img}
                    alt={`${cert.issuer} logo`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                    {cert.title}
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-blue-50 border border-blue-100 text-blue-700">
                    <BsPatchCheckFill className="text-blue-500 text-sm" />
                    {cert.issuer}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Certifications;