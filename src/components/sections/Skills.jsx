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
} from "react-icons/si";
import { DiMsqlServer } from "react-icons/di";
import { categories } from "../../constants/skills";

const iconMap = {
  python: (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
      alt="Python"
      className="w-5 h-5"
    />
  ),
  mysql: <SiMysql className="text-blue-500 text-lg" />,
  mssql: <DiMsqlServer className="text-red-500 text-lg" />,
  postgresql: <SiPostgresql className="text-sky-500 text-lg" />,
  mongodb: <SiMongodb className="text-green-600 text-lg" />,
  cassandra: <SiApachecassandra className="text-cyan-500 text-lg" />,
  powerbi: (
    <img
      src="https://img.icons8.com/color/48/power-bi.png"
      alt="Power BI"
      className="w-5 h-5 drop-shadow-sm"
    />
  ),
  tableau: (
    <img
      src="https://img.icons8.com/color/48/tableau-software.png"
      alt="Tableau"
      className="w-5 h-5 drop-shadow-sm"
    />
  ),
  excel: (
    <img
      src="https://img.icons8.com/color/48/microsoft-excel-2019--v1.png"
      alt="Excel"
      className="w-5 h-5 drop-shadow-sm"
    />
  ),
  quicksight: <FaAws className="text-orange-500 text-lg" />,
  looker: (
    <img
      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDAwMDAwIiBzdHlsZT0ib3BhY2l0eToxOyI+PHBhdGggIGQ9Ik0xMS45NDggMEEyLjEgMi4xIDAgMCAwIDkuODUgMi4xMDRhMi4xIDIuMSAwIDAgMCAuMzU2IDEuMTY2bC44OTUtLjg5NmEuODg0Ljg4NCAwIDEgMSAuNTY1LjU2NGwtLjg5NS44OTVBMi4wOTYgMi4wOTYgMCAwIDAgMTMuMTE5LjM1OUEyLjEgMi4xIDAgMCAwIDExLjk0OSAwbS0uODM2IDYuMTEzYTMuMjYgMy4yNiAwIDAgMC0uNjUyLTEuOTY1TDkuMjk1IDUuMzFhMS42NyAxLjY3IDAgMCAxLS4zMTcgMi4wMTJsLjYzMiAxLjU0NWEzLjI4IDMuMjggMCAwIDAgMS41MDMtMi43NTRtLTMuMjUgMS42NjZoLS4wM0ExLjY3IDEuNjcgMCAwIDEgNy44MyA0LjQ0YTEuNjcgMS42NyAwIDAgMSAuOTIuMjc1TDkuOSAzLjU2NGEzLjI4IDMuMjggMCAwIDAtNC4xMzMgNS4wOTRhMy4yOCAzLjI4IDAgMCAwIDIuNzI4LjY2NnptNC4xMjkgMS4zMzZjLS43MjggMC0xLjQ1Mi4xMDYtMi4xNS4zMTVsLjkyMiAyLjI1MmE1LjAyIDUuMDIgMCAxIDEtMS4xMjcuNDM1bC0uOTEtMi4yNDRhNy40NCA3LjQ0IDAgMCAwLTMuNDEgOS45NTZ2LjAwMWE3LjQ0IDcuNDQgMCAwIDAgOS45NTcgMy40MWguMDAxYTcuNDQgNy40NCAwIDAgMCAzLjQxMi05Ljk1N0E3LjQ0IDcuNDQgMCAwIDAgMTIgOS4xMTNoLS4wMDh6Ii8+PC9zdmc+"
      alt="Looker"
      className="w-5 h-5 opacity-80"
    />
  ),
  django: <SiDjango className="text-green-600 text-lg" />,
  flask: <SiFlask className="text-text-primary text-lg" />,
  streamlit: (
    <img
      src="https://streamlit.io/images/brand/streamlit-logo-primary-colormark-darktext.svg"
      alt="Streamlit"
      className="w-5 h-5 dark:brightness-125"
    />
  ),
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
    <img
      src="https://www.tigera.io/app/uploads/2023/07/MS-Azure-logo.svg"
      alt="Azure"
      className="w-5 h-5"
    />
  ),
  gcp: (
    <img
      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiICBzdHlsZT0ib3BhY2l0eToxOyI+PHBhdGggZmlsbD0iI2Y0NDMzNiIgZD0iTTE4NC4zNTEgMTAzLjgxNmg3Ljc4NmwyMi4xOTEtMjIuMTkxbDEuMDktOS40MjFhOTkuNzQz 55LjM2IDAgMCAxIDc1Ljc2LTUuNzYyeiIvPjxwYXRoIGZpbGw9IiM0NDhhZmYiIGQ9Ik0yNDUuOTQgMTIwLjg2OGExMDAgMTAwIDAgMCAwLTMwLjEzMi00OC41ODdsLTMxLjE0NiAzMS4xNDZhNTUuMzYgNTUuMzYgMCAwIDEgMjAuMzIzIDQzLjkxNHY1LjUyOWEyNy43MiAyNy43MiAwIDEgMSAwIDU1LjQzOGgtNTUuNDM5bC01LjUyOCA1LjYwNnYzMy4yNDhsNS41MjggNS41MjhoNTUuNDM5YTcyLjEwMSA3Mi4xMDEgMCAwIDAgNDAuOTU2LTEzMS44MjJ6Ii8+PHBhdGggZmlsbD0iIzQzYTA0NyIgZD0iTTk0LjAzIDI1Mi4zNzloNTUuNDM4di00NC4zODJIOTQuMDNhMjcuNiAyNy42IDAgMCAxLTExLjQ0Ni0yLjQ5MmwtNy43ODYgMi40MTRsLTIyLjM0NyAyMi4xOWwtMS45NDcgNy43ODdhNzEuNyA3MS43IDAgMCAwIDQzLjUyNiAxNC40ODMiLz48cGF0aCBmaWxsPSIjZmZjMTA3IiBkPSJNOTQuMDMgMTA4LjQxYTcyLjEwMSA3Mi4xMDEgMCAwIDAtNDMuNTI2IDEyOS4yNTJsMzIuMTU4LTMyLjE1N2EyNy43MiAyNy43MiAwIDEgMSAzNi42NzMtMzYuNjczbDMyLjE1OC0zMi4xNThBNzIuMDIgNzIuMDIgMCAwIDAgOTQuMDMgMTA4LjQxIi8+PC9zdmc+"
      alt="GCP"
      className="w-5 h-5"
    />
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