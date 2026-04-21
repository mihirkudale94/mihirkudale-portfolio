// src/components/sections/Projects.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { allProjects, techFilters, techDescriptions } from "../../constants/projects";
import { TiltCard } from "../ui/TiltCard";

const MAX_VISIBLE_TAGS = 4;

const FallbackReveal = ({ children }) => <>{children}</>;
FallbackReveal.propTypes = { children: PropTypes.node.isRequired };

export const Projects = () => {
  const [activeTech, setActiveTech] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = allProjects.filter((project) => {
    const stack = project.stack ?? [];
    const matchesTech = activeTech === "All" || stack.includes(activeTech);
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query);
    return matchesTech && matchesSearch;
  });

  // Show live demo link for any project that has a valid demo URL
  const shouldShowLiveDemo = (demoUrl) => Boolean(demoUrl && demoUrl.trim() !== "");

  return (
    <section
      id="projects"
      className="relative py-28 bg-white text-slate-900 overflow-hidden"
    >
      {/* Soft Light Orbs */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-50 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-slate-100 blur-[100px] pointer-events-none"
      />

      <FallbackReveal>
        <div className="mx-auto w-full px-5 sm:px-6 lg:px-8 max-w-screen-xl relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold text-blue-600 tracking-widest uppercase">
              Portfolio
            </p>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Projects
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mb-10 flex justify-center">
            <div className="relative w-full md:w-[600px] group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-14 pe-12 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 shadow-sm transition-all duration-300"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 font-bold transition-all"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Tech Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {techFilters.map((tech) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                key={tech}
                onClick={() => setActiveTech(tech)}
                className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border-2 ${activeTech === tech
                  ? "bg-blue-600 text-white border-blue-600 shadow-[0_8px_16px_rgba(37,99,235,0.25)] -translate-y-0.5"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-700 hover:bg-blue-50"
                  }`}
              >
                {tech}
              </motion.button>
            ))}
          </div>

          {/* Result count */}
          <p className="text-center font-medium text-slate-500 mb-10">
            Showing <span className="text-slate-900 font-bold">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? "s" : ""}
            {activeTech !== "All" && ` matching `}<span className="text-blue-600">{activeTech !== "All" ? activeTech : ""}</span>
          </p>

          {/* Project Cards */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const stack = project.stack ?? [];
                const showLive = shouldShowLiveDemo(project.demo);
                const hasGithub = Boolean(project.github && project.github.trim() !== "");

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: (index % 3) * 0.1, type: "spring" }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={`${project.title}-${index}`}
                    className="group relative flex flex-col h-full"
                  >
                    <TiltCard className="flex flex-col flex-1 h-full glass-card overflow-hidden bg-slate-50/50 hover:bg-white @container has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-blue-500 transition-all duration-300">
                      {/* Colorful subtle top bar */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />

                      {/* Card body */}
                      <div className="p-6 @sm:p-8 flex flex-col flex-1 gap-y-1">
                        <h3 className="text-xl @sm:text-2xl font-extrabold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-base font-medium text-slate-600 mb-6 leading-relaxed flex-1">
                          {project.description}
                        </p>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-2 mb-8 items-center">
                          {stack.slice(0, MAX_VISIBLE_TAGS).map((tech, i) => (
                            <span
                              key={`${project.title}-tag-${tech}-${i}`}
                              title={techDescriptions?.[tech] ?? tech}
                              className="bg-blue-50 text-blue-700 border border-blue-100 py-1 px-3 rounded-lg text-xs font-bold"
                            >
                              {tech}
                            </span>
                          ))}
                          {stack.length > MAX_VISIBLE_TAGS && (
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 py-1 px-2.5 rounded-lg border border-slate-200">
                              +{stack.length - MAX_VISIBLE_TAGS} more
                            </span>
                          )}
                        </div>

                        {/* Links — relative + z-10 so gradient-border ::before pseudo-element doesn't intercept clicks */}
                        <div className="relative z-10 flex gap-5 items-center text-sm font-bold mt-auto pt-5 border-t-2 border-slate-100">
                          {hasGithub ? (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaGithub className="text-lg shrink-0" />
                              View Code
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-slate-300 cursor-not-allowed text-xs font-medium">
                              <FaGithub className="text-base shrink-0" />
                              Private Repo
                            </span>
                          )}
                          {showLive && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer ms-auto outline-none"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaExternalLinkAlt className="text-xs shrink-0" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* GitHub CTA */}
          <div className="mt-16 text-center">
            <a
              href="https://github.com/mihirkudale"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-700 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:shadow-md transition-all duration-300 font-bold text-base group"
            >
              <FaGithub className="text-xl" />
              View all projects on GitHub
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </FallbackReveal>
    </section>
  );
};