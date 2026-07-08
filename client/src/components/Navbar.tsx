import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { name: "Home",    href: "#intro",   activeColor: "hover:text-[#00FF41] dark:hover:text-[#00FF41]" },
  { name: "Verify",  href: "#redpill", activeColor: "hover:text-red-500 dark:hover:text-[#FF3333]"   },
  { name: "History", href: "#history", activeColor: "hover:text-[#00FF41] dark:hover:text-[#00FF41]" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md
                 dark:bg-black/85 bg-white/90
                 border-b dark:border-[#00FF41]/50 border-emerald-400/60"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">

          {/* Brand */}
          <a
            href="#intro"
            className="flex items-center gap-1 no-underline"
            aria-label="Matrix·Truth — home"
          >
            <span className="text-xl font-bold dark:text-[#00FF41] text-emerald-700 matrix-text-shadow tracking-tight">
              Matrix·Truth
            </span>
            <span
              className="dark:text-white text-gray-600 animate-pulse select-none"
              aria-hidden
            >
              _
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200
                            dark:text-gray-300 text-gray-700
                            ${link.activeColor}`}
              >
                {link.name}
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="dark:text-gray-300 text-gray-700 hover:opacity-75 transition-opacity"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300
                      ${isMenuOpen ? "max-h-48 pt-4 pb-2 mt-3 border-t dark:border-[#00FF41]/30 border-emerald-300" : "max-h-0"}`}
        >
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200
                            dark:text-gray-300 text-gray-700
                            ${link.activeColor}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
