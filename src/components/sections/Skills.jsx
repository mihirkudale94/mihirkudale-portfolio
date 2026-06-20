import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "../ui/TiltCard";
import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaDocker,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiApachecassandra,
  SiDjango,
  SiFlask,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiFastapi,
  SiApachespark,
  SiApachehive,
  SiApachehadoop,
  SiApachekafka,
  SiPython,
  SiTableau,
  SiStreamlit,
} from "react-icons/si";
import { DiMsqlServer } from "react-icons/di";
import { categories } from "../../constants/skills";

const iconMap = {
  python: <SiPython className="text-blue-500 text-lg" />,
  mysql: <SiMysql className="text-blue-500 text-lg" />,
  mssql: <DiMsqlServer className="text-red-500 text-lg" />,
  postgresql: <SiPostgresql className="text-sky-500 text-lg" />,
  mongodb: <SiMongodb className="text-green-600 text-lg" />,
  cassandra: <SiApachecassandra className="text-cyan-500 text-lg" />,
  powerbi: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Power BI">
      <path d="M18.8 6H20.4C21.28 6 22 6.72 22 7.6V20.4C22 21.28 21.28 22 20.4 22H18.8C17.92 22 17.2 21.28 17.2 20.4V7.6C17.2 6.72 17.92 6 18.8 6Z" fill="#F2C811"/>
      <path d="M10.8 11.5H12.4C13.28 11.5 14 12.22 14 13.1V20.4C14 21.28 13.28 22 12.4 22H10.8C9.92 22 9.2 21.28 9.2 20.4V13.1C9.2 12.22 9.92 11.5 10.8 11.5Z" fill="#F2A512"/>
      <path d="M2.8 16.5H4.4C5.28 16.5 6 17.22 6 18.1V20.4C6 21.28 5.28 22 4.4 22H2.8C1.92 22 1.2 21.28 1.2 20.4V18.1C1.2 17.22 1.92 16.5 2.8 16.5Z" fill="#F28B12"/>
    </svg>
  ),
  tableau: <SiTableau className="text-sky-600 text-lg" />,
  excel: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft Excel">
      <path d="M16.2 2H7.8C4.6 2 2 4.6 2 7.8V16.2C2 19.4 4.6 22 7.8 22H16.2C19.4 22 22 19.4 22 16.2V7.8C22 4.6 19.4 2 16.2 2Z" fill="#107C41"/>
      <path d="M7.5 7.5L10.5 12L7.5 16.5H9.5L11.5 13.5L13.5 16.5H15.5L12.5 12L15.5 7.5H13.5L11.5 10.5L9.5 7.5H7.5Z" fill="white"/>
    </svg>
  ),
  quicksight: <FaAws className="text-orange-500 text-lg" />,
  looker: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current opacity-80" aria-label="Looker">
      <path d="M11.948 0A2.1 2.1 0 0 0 9.85 2.104a2.1 2.1 0 0 0 .356 1.166l.895-.896a.884.884 0 1 1 .565.564l-.895.895A2.096 2.096 0 0 0 13.119.359A2.1 2.1 0 0 0 11.949 0m-.836 6.113a3.26 3.26 0 0 0-.652-1.965L9.295 5.31a1.67 1.67 0 0 1-.317 2.012l.632 1.545a3.28 3.28 0 0 0 1.503-2.754m-3.25 1.666h-.03A1.67 1.67 0 0 1 7.83 4.44a1.67 1.67 0 0 1 .92.275l1.07 1.549a3.28 3.28 0 0 0-4.133 5.094a3.28 3.28 0 0 0 2.728.666zm4.129 1.333c-.728 0-1.452.106-2.15.355l.922 2.252a5.02 5.02 0 1 1-1.127.435l-.91-2.244a7.44 7.44 0 0 0-3.41 9.956v.001a7.44 7.44 0 0 0 9.957 3.41h.001a7.44 7.44 0 0 0 3.412-9.957A7.44 7.44 0 0 0 12 9.113h-.008z"/>
    </svg>
  ),
  django: <SiDjango className="text-green-600 text-lg" />,
  flask: <SiFlask className="text-text-primary text-lg" />,
  streamlit: <SiStreamlit className="text-rose-500 text-lg" />,
  fastapi: <SiFastapi className="text-green-500 text-lg" />,
  rest: <span className="text-text-secondary text-xs font-bold tracking-tight">REST</span>,
  html: <SiHtml5 className="text-orange-600 text-lg" />,
  css: <SiCss3 className="text-blue-500 text-lg" />,
  javascript: <SiJavascript className="text-yellow-500 text-lg" />,
  react: <FaReact className="text-cyan-500 text-lg" />,
  node: <FaNodeJs className="text-green-600 text-lg" />,
  tailwind: <SiTailwindcss className="text-teal-400 text-lg" />,
  aws: <FaAws className="text-orange-500 text-lg" />,
  azure: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft Azure">
      <path d="M12.48 2L1.2 19.86H7.98L13.74 10.74L12.48 2Z" fill="#0078D4"/>
      <path d="M13.74 10.74L7.98 19.86H22.8L12.48 2L13.74 10.74Z" fill="#50E6FF"/>
      <path d="M1.2 19.86H22.8L13.74 10.74H7.98L1.2 19.86Z" fill="#00BCF2"/>
    </svg>
  ),
  gcp: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" className="w-5 h-5" aria-label="GCP">
      <path fill="#f44336" d="M184.351 103.816h7.786l22.191-22.191l1.09-9.421a99.743 55.36 0 0 1 75.76-5.762z"/>
      <path fill="#448aff" d="M245.94 120.868a100 100 0 0 0-30.132-48.587l-31.146 31.146a55.36 55.36 0 0 1 20.323 43.914v5.529a27.72 27.72 0 1 1 0 55.438h-55.439l-5.528 5.606v33.248l5.528 5.528h55.439a72.101 72.101 0 0 0 40.956-131.822z"/>
      <path fill="#43a047" d="M94.03 252.379h55.438v-44.382H94.03a27.6 27.6 0 0 1-11.446-2.492l-7.786 2.414l-22.347 22.19l-1.947 7.787a71.7 71.7 0 0 0 43.526 14.483"/>
      <path fill="#ffc107" d="M94.03 108.41a72.101 72.101 0 0 0-43.526 129.252l32.158-32.157a27.72 27.72 0 1 1 36.673-36.673l32.158-32.158A72.02 72.02 0 0 0 94.03 108.41"/>
    </svg>
  ),
  spark: <SiApachespark className="text-orange-500 text-lg" />,
  hive: <SiApachehive className="text-amber-500 text-lg" />,
  hadoop: <SiApachehadoop className="text-yellow-600 text-lg" />,
  kafka: <SiApachekafka className="text-text-primary text-lg" />,
  docker: <FaDocker className="text-blue-500 text-lg" />,
  git: <FaGitAlt className="text-orange-600 text-lg" />,
};

const SkillBadge = ({ iconKey, name }) => (
  <div className="flex items-center gap-2 bg-bg-primary border border-glass-border text-text-secondary px-3 py-1.5 rounded-full text-sm font-semibold transition-colors hover:border-accent-primary-light hover:text-accent-primary hover:bg-accent-primary-light/5 cursor-default">
    {iconMap[iconKey]}
    <span>{name}</span>
  </div>
);

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categoryTitles = ["All", ...categories.map((c) => c.title)];

  const filteredCategories =
    activeCategory === "All"
      ? categories
      : categories.filter((c) => c.title === activeCategory);

  return (
    <section
      id="skills"
      className="relative py-28 px-6 bg-bg-secondary text-text-primary overflow-hidden transition-colors duration-300"
    >
      {/* Light Orbs */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent-primary-light/5 blur-[120px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-sm font-bold text-accent-primary tracking-widest uppercase">
            Arsenal
          </p>
          <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">
            My Tech Stack
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categoryTitles.map((title) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              key={title}
              onClick={() => setActiveCategory(title)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${activeCategory === title
                ? "bg-accent-primary text-white border-accent-primary shadow-[0_8px_16px_rgba(37,99,235,0.15)] -translate-y-0.5"
                : "bg-bg-primary text-text-secondary border-glass-border hover:border-accent-primary-light hover:text-accent-primary hover:bg-accent-primary-light/5 hover:shadow-sm"
                }`}
            >
              {title}
            </motion.button>
          ))}
        </div>

        {/* Skill Category Cards */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (index % 2) * 0.1, type: "spring" }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={category.title}
                className="group h-full"
              >
                <TiltCard className="h-full glass-card gradient-border p-8 bg-bg-primary/80 border-glass-border grid grid-rows-[auto_1fr] gap-6">
                  {/* Title with accent */}
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-accent-primary to-accent-secondary" />
                    <h3 className="text-xl font-bold text-text-primary">
                      {category.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {category.skills.map((skill, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <SkillBadge iconKey={skill.icon} name={skill.name} />
                      </motion.div>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;