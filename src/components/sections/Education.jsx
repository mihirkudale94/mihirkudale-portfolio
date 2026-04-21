import React from "react";
import { motion } from "framer-motion";
import { educationList } from "../../constants/education";
import { LuGraduationCap } from "react-icons/lu";

const Education = () => {
  return (
    <section
      id="education"
      className="relative py-28 px-6 md:px-12 bg-white text-slate-900 overflow-hidden"
    >
      {/* Soft background blob */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-50/80 blur-[100px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <p className="text-sm font-bold text-blue-600 tracking-widest uppercase">
              Academic Background
            </p>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Education
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {educationList.map((edu, index) => (
              <div
                key={index}
                className="glass-card p-8 flex flex-col md:flex-row items-start gap-6 group hover:-translate-y-1 transition-all duration-300 bg-slate-50/50"
              >
                {/* Icon box */}
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <LuGraduationCap className="h-7 w-7" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="text-lg text-slate-700 font-semibold mb-1">
                    {edu.institution}
                  </p>

                  {/* University & Location block */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
                    {edu.university && (
                      <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
                        {edu.university}
                      </span>
                    )}
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {edu.location}
                    </span>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="mt-4 md:mt-0 md:text-right">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-blue-700 whitespace-nowrap">
                    {edu.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Education;