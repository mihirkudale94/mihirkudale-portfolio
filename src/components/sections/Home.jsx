
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { homeData } from "../../constants/home";
import { motion } from "framer-motion";
import { MagneticButton } from "../ui/MagneticButton";
import { TiltCard } from "../ui/TiltCard";
import { InteractiveGlow } from "../ui/InteractiveGlow";

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "30+", label: "Projects Built" },
  { value: "10+", label: "Certifications" },
];

export const Home = () => {
  return (
    <section
      id="home"
      className="relative min-h-dvh overflow-hidden bg-slate-50 text-slate-900 px-6 md:px-12 py-24 flex items-center justify-center"
    >
      {/* ── Interactive Generative Glow (2026) ── */}
      <InteractiveGlow />

      {/* ── Subtle Dot grid texture overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)",
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {homeData.roles}
            </div>

            {/* Name headline - Kinetic Typography */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 flex flex-wrap items-center gap-x-2">
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
            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
              {homeData.headline}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {homeData.badges.map((badge, index) => (
                <span
                  key={index}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 shadow-sm hover:border-blue-300 hover:text-blue-700 transition-all duration-200 cursor-default"
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
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-white font-semibold shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
                  className="inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white/50 px-7 py-3.5 text-slate-700 font-semibold backdrop-blur-sm hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
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
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_10px_20px_rgba(37,99,235,0.15)]"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href={homeData.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:text-black hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href={homeData.social.email}
                aria-label="Email Mihir"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-rose-300 hover:shadow-[0_10px_20px_rgba(244,63,94,0.15)]"
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
                  className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-blue-200/50 to-violet-200/50 blur-xl mix-blend-multiply"
                />

                <img
                  src={homeData.image.src}
                  alt={homeData.image.alt}
                  width={homeData.image.width}
                  height={homeData.image.height}
                  className="relative w-[280px] md:w-[380px] h-auto object-cover rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]"
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