import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { contactConfig } from "../../constants/contacts";

export const Contact = () => {
  return (
    <section
      id="contact"
      className="relative min-h-dvh bg-bg-secondary text-text-primary py-28 px-6 flex items-center justify-center overflow-hidden transition-colors duration-300"
    >
      {/* Background Orbs */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-accent-primary-light/5 blur-[140px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-secondary-light/5 blur-[120px] pointer-events-none"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.2 }}
        className="w-full max-w-5xl space-y-12 relative z-10"
      >
        {/* Hire Me Hero Card */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.95, y: 30 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
          }}
          className="relative glass-card gradient-border bg-bg-primary text-center p-12 md:p-16 space-y-8 overflow-hidden border-glass-border"
        >
          <div className="relative z-10 space-y-4">
            <p className="text-sm font-bold text-accent-primary tracking-widest uppercase">
              Let's Connect
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
              {contactConfig.heading}
            </h2>
            <p className="text-lg font-medium text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {contactConfig.description}
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href={contactConfig.ctaLink}
              className="inline-flex items-center gap-3 bg-accent-primary hover:bg-accent-primary-light text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-primary/45"
            >
              {contactConfig.ctaText}
              <span className="text-xl">☀️</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Office + Map */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
          }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Office Info */}
          <div className="glass-card gradient-border bg-bg-primary p-10 space-y-6 border-glass-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 rounded-full bg-accent-primary" />
              <h3 className="text-xl font-bold text-text-primary">
                {contactConfig.locationTitle}
              </h3>
            </div>
            <p className="text-text-secondary text-lg font-bold">{contactConfig.locationText}</p>
            <p className="text-base text-text-secondary leading-relaxed font-medium">
              Available for{" "}
              <span className="text-accent-primary font-bold bg-accent-primary/10 px-2 py-0.5 rounded-md">on-site</span>,{" "}
              <span className="text-accent-secondary font-bold bg-accent-secondary/10 px-2 py-0.5 rounded-md">remote</span>, and{" "}
              <span className="text-accent-primary font-bold bg-accent-primary/10 px-2 py-0.5 rounded-md">freelance</span>{" "}
              roles globally.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href={contactConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex items-center justify-center h-12 w-12 rounded-full bg-bg-primary border-2 border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-primary-light hover:shadow-md transition-colors focus-visible:ring-4 focus-visible:ring-accent-primary/30"
              >
                <FaGithub className="text-xl" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href={contactConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center h-12 w-12 rounded-full bg-bg-primary border-2 border-glass-border text-accent-primary hover:text-accent-primary-light hover:border-accent-primary hover:shadow-md transition-colors focus-visible:ring-4 focus-visible:ring-accent-primary/45"
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href={contactConfig.socials.email}
                aria-label="Email"
                className="flex items-center justify-center h-12 w-12 rounded-full bg-bg-primary border-2 border-glass-border text-rose-500 hover:text-rose-600 hover:border-rose-300 hover:shadow-md transition-colors focus-visible:ring-4 focus-visible:ring-accent-primary/30"
              >
                <HiOutlineMail className="text-2xl" />
              </motion.a>
            </div>
          </div>

          {/* Google Map */}
          <div className="h-[300px] md:h-full rounded-[1.5rem] overflow-hidden border-2 border-glass-border shadow-xl">
            <iframe
              title="Google Map - Kothrud, Pune"
              src={contactConfig.mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        {/* Footer */}
        <div className="pt-10 border-t-2 border-glass-border text-center text-sm font-semibold text-text-secondary">
          <div className="flex items-center justify-center gap-3">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-glass-border" />
            {contactConfig.footer.text}{" "}
            <span className="font-bold text-text-primary">
              {contactConfig.footer.name}
            </span>
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-glass-border" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
