import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import logo from "../assets/logo.png";

export const Navbar = ({ menuOpen, setMenuOpen, theme, setTheme }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, setMenuOpen]);

  const menuItems = [
    { label: "home", path: "/" },
    { label: "about", path: "/about" },
    { label: "skills", path: "/skills" },
    { label: "experience", path: "/experience" },
    { label: "projects", path: "/projects" },
    { label: "education", path: "/education" },
    { label: "certifications", path: "/certifications" },
    { label: "testimonials", path: "/testimonials" },
    { label: "contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className={`fixed z-50 transition-all duration-500 ${scrolled
          ? "top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl rounded-full border border-glass-border bg-glass-bg backdrop-blur-xl shadow-lg px-2 md:px-6 py-1"
          : "top-0 left-0 w-full border-b border-transparent bg-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? "h-12" : "h-16"}`}>
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="Mihir Kudale home"
            >
              <img
                src={logo}
                alt="Mihir Kudale Logo"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105 dark:brightness-110"
              />
              <span className="sr-only">Mihir Kudale</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative capitalize text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 group ${isActive(item.path)
                    ? "text-accent-primary bg-accent-primary-light/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                    }`}
                >
                  {item.label}
                  {/* Active underline indicator */}
                  <span
                    className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300 ${isActive(item.path) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                      }`}
                  />
                </Link>
              ))}

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="ml-2 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4.5 h-4.5 text-amber-500" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-text-secondary" />
                  )}
                </motion.div>
              </motion.button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {/* Theme Toggle for Mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors focus:outline-none"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4.5 h-4.5 text-amber-500" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-text-secondary" />
                  )}
                </motion.div>
              </motion.button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span
                    className={`block h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""
                      }`}
                  />
                  <span
                    className={`block h-[2px] bg-current rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""
                      }`}
                  />
                  <span
                    className={`block h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-bg-secondary/40 backdrop-blur-xl"
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-20 left-4 right-4 bg-bg-primary/95 border border-glass-border rounded-2xl px-6 py-6 shadow-xl transition-all duration-300 ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
        >
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`capitalize text-base font-semibold px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                  ? "text-accent-primary bg-accent-primary-light/10 border border-accent-primary-light/25"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};