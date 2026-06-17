
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { homeData } from "../../constants/home";
import { motion } from "framer-motion";
import { MagneticButton } from "../ui/MagneticButton";
import { TiltCard } from "../ui/TiltCard";
import { InteractiveGlow } from "../ui/InteractiveGlow";

export const Home = () => {
  return (
    <section
      id="home"
      className="relative min-h-dvh overflow-hidden bg-bg-secondary text-text-primary px-6 md:px-12 py-24 flex items-center justify-center transition-colors duration-300"
    >
      {/* ── Interactive Generative Glow (2026) ── */}
      <InteractiveGlow />

      {/* ── Subtle Dot grid texture overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full max-w-7xl gap-y-16 md:gap-x-20 relative z-10">
          {/* ── Left: Intro ── */}
          <div className="space-y-7">
            {/* Role tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary-light/20 text-accent-primary text-sm font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              {homeData.roles}
            </div>

            {/* Name headline - Kinetic Typography */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-text-primary flex flex-wrap items-center gap-x-2">
              <span className="mr-2">Hi, I'm</span>
              <div className="flex space-x-[0.05em]">
                {homeData.name.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.05,
                      type: "spring",
                      stiffness: 150,
                      damping: 10
                    }}
                    className="gradient-text inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed font-medium">
              {homeData.headline}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {homeData.badges.map((badge, index) => (
                <span
                  key={index}
                  className="rounded-full border border-glass-border bg-bg-primary px-3.5 py-1.5 text-sm font-semibold text-text-secondary shadow-sm hover:border-accent-primary-light hover:text-accent-primary hover:bg-accent-primary-light/5 transition-all duration-200 cursor-default"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <MagneticButton strength={0.2}>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  href={homeData.cta.primary.href}
                  className="inline-flex items-center justify-center rounded-xl bg-accent-primary px-7 py-3.5 text-white font-bold shadow-[0_10px_20px_rgba(37,99,235,0.15)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.25)] hover:bg-accent-primary-light transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-primary/45"
                >
                  {homeData.cta.primary.label}
                </motion.a>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  href={homeData.cta.secondary.href}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-glass-border bg-bg-primary/50 px-7 py-3.5 text-text-secondary font-bold backdrop-blur-sm hover:border-accent-primary hover:bg-bg-tertiary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-primary/30"
                >
                  {homeData.cta.secondary.label}
                </motion.a>
              </MagneticButton>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href={homeData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-bg-primary text-accent-primary shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent-primary-light hover:shadow-md focus-visible:ring-4 focus-visible:ring-accent-primary/45"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href={homeData.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-bg-primary text-text-secondary shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-text-primary hover:text-text-primary hover:shadow-md focus-visible:ring-4 focus-visible:ring-accent-primary/30"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href={homeData.social.email}
                aria-label="Email Mihir"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-bg-primary text-rose-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-rose-300 hover:shadow-md focus-visible:ring-4 focus-visible:ring-accent-primary/30"
              >
                <HiOutlineMail className="text-2xl" />
              </a>
            </div>
          </div>

          {/* ── Right: Image + Stats ── */}
          <div className="flex flex-col items-center md:items-end gap-10">
            {/* Profile Image with refined shadow */}
            <TiltCard>
              <div className="relative">
                {/* Soft decorative background blob */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-blue-200/50 to-violet-200/50 dark:from-accent-primary-light/10 dark:to-accent-secondary-light/10 blur-xl mix-blend-multiply dark:mix-blend-screen"
                />

                <img
                  src={homeData.image.src}
                  alt={homeData.image.alt}
                  width={homeData.image.width}
                  height={homeData.image.height}
                  className="relative w-[280px] md:w-[380px] h-auto object-cover rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)]"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            </TiltCard>


          </div>
        </div>
      </motion.div>
    </section>
  );
};