import { useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { allProjects, techFilters, techDescriptions } from "../../constants/projects";
import { TiltCard } from "../ui/TiltCard";

const MAX_VISIBLE_TAGS = 4;

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

  return (
    <section
      id="projects"
      className="relative py-28 bg-bg-primary text-text-primary overflow-hidden transition-colors duration-300"
    >
      {/* Soft Light Orbs */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent-primary-light/5 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-bg-secondary blur-[100px] pointer-events-none"
      />

      <>
        <div className="mx-auto w-full px-5 sm:px-6 lg:px-8 max-w-screen-xl relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold text-accent-primary tracking-widest uppercase">
              Portfolio
            </p>
            <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">
              Featured Projects
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mb-10 flex justify-center">
            <div className="relative w-full md:w-[600px] group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-14 pe-12 py-4 bg-bg-primary border-2 border-glass-border rounded-2xl text-text-primary font-semibold placeholder-text-tertiary/75 focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary-light/20 shadow-sm transition-all duration-300"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary font-bold transition-all"
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
                  ? "bg-accent-primary text-white border-accent-primary shadow-[0_8px_16px_rgba(37,99,235,0.15)] -translate-y-0.5"
                  : "bg-bg-primary text-text-secondary border-glass-border hover:border-accent-primary-light hover:text-accent-primary hover:bg-accent-primary-light/5"
                  }`}
              >
                {tech}
              </motion.button>
            ))}
          </div>

          {/* Result count */}
          <p className="text-center font-semibold text-text-secondary mb-10">
            Showing <span className="text-text-primary font-bold">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? "s" : ""}
            {activeTech !== "All" && ` matching `}<span className="text-accent-primary">{activeTech !== "All" ? activeTech : ""}</span>
          </p>

          {/* Project Cards */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const stack = project.stack ?? [];
                const showLive = Boolean(project.demo?.trim());
                const hasGithub = Boolean(project.github?.trim());

                // Metrics highlight helper
                const highlightMetrics = (text) => {
                  if (!text) return "";
                  const regex = /(\b\d+(?:\.\d+)?%?\s*(?:more|less|greater|fewer|increase|decrease|reduction|performance|improvement|gain|latency|speedup|accuracy|boost|efficiency|faster|slower|x)?\b|Amazon|Power BI|SQL|Python|Generative AI|Tableau|Excel|Blinkit)/gi;
                  const parts = text.split(regex);
                  return parts.map((part, i) =>
                    regex.test(part) ? (
                      <strong key={i} className="font-extrabold text-text-primary underline decoration-accent-primary/20 decoration-2 underline-offset-2">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  );
                };

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
                    <TiltCard className="flex flex-col flex-1 h-full glass-card overflow-hidden bg-bg-secondary/45 hover:bg-bg-primary border-glass-border @container focus-within:ring-4 focus-within:ring-accent-primary/40 transition-all duration-300">
                      {/* Colorful subtle top bar */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-accent-primary to-accent-secondary opacity-80 group-hover:opacity-100 transition-opacity" />

                      {/* Card body */}
                      <div className="p-6 @sm:p-8 flex flex-col flex-1 gap-y-1">
                        <h3 className="text-xl @sm:text-2xl font-extrabold mb-2 text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-base font-medium text-text-secondary mb-6 leading-relaxed flex-1">
                          {highlightMetrics(project.description)}
                        </p>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-2 mb-8 items-center">
                          {stack.slice(0, MAX_VISIBLE_TAGS).map((tech, i) => (
                            <span
                              key={`${project.title}-tag-${tech}-${i}`}
                              title={techDescriptions?.[tech] ?? tech}
                              className="bg-accent-primary/10 text-accent-primary border border-accent-primary-light/10 py-1 px-3 rounded-lg text-xs font-bold"
                            >
                              {tech}
                            </span>
                          ))}
                          {stack.length > MAX_VISIBLE_TAGS && (
                            <span className="text-xs font-bold text-text-tertiary bg-bg-secondary py-1 px-2.5 rounded-lg border border-glass-border">
                              +{stack.length - MAX_VISIBLE_TAGS} more
                            </span>
                          )}
                        </div>

                        {/* Links — relative + z-10 so gradient-border ::before pseudo-element doesn't intercept clicks */}
                        <div className="relative z-10 flex gap-5 items-center text-sm font-bold mt-auto pt-5 border-t-2 border-glass-border">
                          {hasGithub ? (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary hover:underline transition-colors cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaGithub className="text-lg shrink-0" />
                              View Code
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-text-tertiary/40 cursor-not-allowed text-xs font-medium">
                              <FaGithub className="text-base shrink-0" />
                              Private Repo
                            </span>
                          )}
                          {showLive && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary-light hover:underline transition-colors cursor-pointer ms-auto outline-none"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaExternalLinkAlt className="text-xs shrink-0" />
                              Live Dashboard
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
              href="https://github.com/mihirkudale94"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-glass-border text-text-secondary bg-bg-primary hover:bg-accent-primary-light/5 hover:border-accent-primary-light hover:text-accent-primary hover:shadow-md transition-all duration-300 font-bold text-base group"
            >
              <FaGithub className="text-xl" />
              View all projects on GitHub
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </>
    </section>
  );
};