import React from "react";
import { motion } from "framer-motion";
import { BsPatchCheckFill } from "react-icons/bs";
import { certifications } from "../../constants/certifications";

const Certifications = () => {
  return (
    <section
      id="certifications"
      className="relative py-28 px-6 bg-bg-secondary text-text-primary overflow-hidden transition-colors duration-300"
    >
      {/* Soft Background Orbs */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent-primary-light/5 blur-[100px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full bg-accent-secondary-light/5 blur-[80px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="max-w-6xl w-full mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold text-accent-primary tracking-widest uppercase">
              Credentials
            </p>
            <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">
              Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const isMicrosoft = cert.issuer?.toLowerCase().includes("microsoft");
              const CardComponent = cert.link ? "a" : "div";
              return (
                <CardComponent
                  key={index}
                  href={cert.link || undefined}
                  target={cert.link ? "_blank" : undefined}
                  rel={cert.link ? "noopener noreferrer" : undefined}
                  aria-label={cert.link ? `Open ${cert.title} by ${cert.issuer}` : undefined}
                  className={`flex items-center gap-5 glass-card p-6 transition-all duration-300 group ${
                    cert.link ? "hover:-translate-y-1 cursor-pointer" : "cursor-default"
                  } ${
                    isMicrosoft 
                      ? "border-accent-primary bg-accent-primary-light/5 hover:border-accent-primary hover:shadow-[0_10px_35px_rgba(59,130,246,0.12)]" 
                      : "bg-bg-primary border-glass-border"
                  }`}
                >
                  {/* Logo wrapper */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-bg-primary border-2 border-glass-border p-2 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={cert.img}
                      alt={`${cert.issuer} logo`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors leading-tight mb-2">
                      {cert.title}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-accent-primary/10 border border-accent-primary-light/10 text-accent-primary">
                      <BsPatchCheckFill className="text-accent-primary text-sm" />
                      {cert.issuer}
                    </span>
                  </div>
                </CardComponent>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Certifications;