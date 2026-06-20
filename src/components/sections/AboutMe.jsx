import React from "react";
import { motion } from "framer-motion";
import { aboutMeData } from "../../constants/aboutme";

const AboutMe = () => {
  return (
    <section
      id="about"
      className="relative py-28 px-6 bg-bg-primary text-text-primary overflow-hidden transition-colors duration-300"
    >
      {/* Subtle background blob */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-bg-tertiary/20 blur-[100px] pointer-events-none"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.2 }}
        className="max-w-5xl mx-auto space-y-16 relative z-10"
      >
        {/* Heading */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
          }}
          className="text-center space-y-4"
        >
          <p className="text-sm font-bold text-accent-primary tracking-widest uppercase">
            Get to know me
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
            {aboutMeData.heading}
          </h2>

          <p className="text-lg md:text-xl leading-[1.85] text-text-secondary max-w-3xl mx-auto font-medium">
            I'm{" "}
            <span className="font-bold text-accent-primary animated-underline cursor-default">
              {aboutMeData.intro.name}
            </span>
            , a {aboutMeData.intro.location}{" "}
            <span className="font-bold text-text-primary animated-underline cursor-default">
              {aboutMeData.intro.title}
            </span>{" "}
            with a strong focus on{" "}
            <span className="font-bold text-accent-secondary animated-underline cursor-default">
              {aboutMeData.intro.focus}
            </span>
            . {aboutMeData.intro.description}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {aboutMeData.sections.map((section, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 30 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
              }}
              whileHover={{ y: -5 }}
              className={`glass-card p-8 space-y-4 border border-glass-border bg-bg-secondary/45 group ${
                index === aboutMeData.sections.length - 1 && aboutMeData.sections.length % 2 !== 0
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              {/* Accent bar */}
              <div className="h-1 w-12 rounded-full bg-accent-primary mb-2 group-hover:w-20 transition-all duration-500" />
              <h3 className="text-2xl font-bold text-text-primary">
                {section.title}
              </h3>
              <p className="text-base leading-[1.8] text-text-secondary font-medium">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutMe;