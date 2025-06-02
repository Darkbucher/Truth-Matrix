import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { name: "Intro", href: "#intro", color: "text-white hover:text-[#00FF41]" },
  { name: "Red Pill", href: "#redpill", color: "text-white hover:text-[#FF0000]" },
  { name: "Blue Pill", href: "#bluepill", color: "text-white hover:text-[#0000FF]" },
  { name: "Navigate", href: "#navigate", color: "text-white hover:text-[#00FF41]" },
  { name: "Verification", href: "#verification", color: "text-white hover:text-[#00FF41]" },
  { name: "History", href: "#history", color: "text-white hover:text-[#00FF41]" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 dark:bg-black/80 light:bg-white/90 border-b border-[#00FF41] dark:border-[#00FF41] light:border-emerald-400 matrix-box-shadow">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-[#00FF41] dark:text-[#00FF41] light:text-emerald-600 matrix-text-shadow">
              Matrix·Truth<span className="text-white dark:text-white light:text-gray-800 animate-pulse">_</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className={`${link.color} transition-colors duration-300 hover:scale-105`}
              >
                {link.name}
              </a>
            ))}
            <ThemeToggle />
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button 
              className="text-white dark:text-white light:text-gray-800" 
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden pt-4 pb-2 border-t border-[#00FF41] dark:border-[#00FF41] light:border-emerald-400 mt-3 
          ${isMenuOpen ? 'block animate-fadeIn' : 'hidden'}`}
        >
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className={`${link.color} transition-colors duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
