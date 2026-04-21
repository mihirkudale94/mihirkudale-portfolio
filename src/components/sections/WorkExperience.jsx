import React from "react";
import { motion } from "framer-motion";
import { LuBriefcase, LuMapPin, LuBuilding2 } from "react-icons/lu";
import { experiences } from "../../constants/workexperience";

const WorkExperience = () => {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative py-28 px-6 bg-white text-slate-900 overflow-hidden"
    >
      {/* Background orb */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-50 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-50 blur-[100px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold text-blue-600 tracking-widest uppercase">
              Career
            </p>
            <h2
              id="experience-heading"
              className="text-4xl font-extrabold text-slate-900 tracking-tight"
            >
              Work Experience
            </h2>
          </div>

          {/* Timeline */}
          <ol className="relative space-y-12">
            {/* Elegant thin timeline line */}
            <div
              aria-hidden="true"
              className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-slate-200 rounded-full"
            />

            {experiences.map((exp, index) => (
              <li key={index} className="group relative ps-10 md:ps-12">
                {/* Clean timeline dot */}
                <span
                  aria-hidden="true"
                  className="absolute left-[2px] top-6 h-3 w-3 rounded-full bg-blue-500 ring-[6px] ring-white z-10 pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:bg-blue-600"
                />

                {/* Card */}
                <article className="glass-card gradient-border p-8 bg-slate-50/50 hover:bg-white transition-colors duration-300">
                  {/* Company header */}
                  <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-5">
                      {/* Company icon */}
                      <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-[0_8px_16px_rgba(37,99,235,0.12)] transition-shadow duration-300">
                        <LuBuilding2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                          {exp.company}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mt-1">
                          <LuMapPin className="h-4 w-4 text-blue-500" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Roles */}
                  <div className="space-y-8">
                    {exp.roles.map((role, rIndex) => (
                      <div
                        key={rIndex}
                        className={`relative ${rIndex !== exp.roles.length - 1
                          ? "pb-8 border-b border-slate-200"
                          : ""
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <LuBriefcase className="h-5 w-5 text-blue-500" />
                            {role.role}
                          </h4>
                          <span className="inline-flex px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-700">
                            {role.display}
                          </span>
                        </div>

                        {/* Tech Stack Chips */}
                        {role.tech && (
                          <div className="flex flex-wrap gap-2 mt-4 pt-2">
                            {role.tech.map((tech, tIndex) => (
                              <span
                                key={tIndex}
                                className="px-3 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm hover:border-blue-300 hover:text-blue-700 cursor-default transition-colors duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  );
};

export default WorkExperience;
