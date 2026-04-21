import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const Navbar = ({ menuOpen, setMenuOpen }) => {
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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-white/40 backdrop-blur-md border-b border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="Mihir Kudale home"
            >
              <img
                src="https://i.postimg.cc/gjnbb9xF/80c8c743-9757-4139-b053-b2b33bce6626.png"
                alt="Mihir Kudale Logo"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
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
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                >
                  {item.label}
                  {/* Active underline indicator */}
                  <span
                    className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ${isActive(item.path) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                      }`}
                  />
                </Link>
              ))}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all focus:outline-none"
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
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-white/80 backdrop-blur-xl"
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-16 left-0 right-0 bg-white/95 border-b border-slate-200 px-6 py-6 shadow-xl transition-all duration-300 ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
        >
          <nav className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`capitalize text-base font-semibold px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                  ? "text-blue-600 bg-blue-50 border border-blue-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                style={{ animationDelay: `${index * 40}ms` }}
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