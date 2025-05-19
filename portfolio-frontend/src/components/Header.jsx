import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path) =>
    `block md:inline-block px-3 py-2 rounded transition ${
      pathname === path
        ? "text-indigo-400 font-semibold"
        : "text-white hover:text-indigo-300"
    }`;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false); // ✅ يغلق القائمة بعد النقر على رابط
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo or Site Name */}
        {/* Logo or Site Name */}
        <Link to="/" className="text-xl font-bold text-indigo-400">
          My Portfolio
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="text-white md:hidden text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation */}
        <nav
          className={`absolute md:static top-full left-0 w-full md:w-auto bg-gray-900 md:bg-transparent md:flex md:items-center md:space-x-6 transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 px-6 py-4 md:p-0 space-y-2 md:space-y-0">
            <Link to="/" className={linkClass("/")} onClick={handleLinkClick}>
              Home
            </Link>
            <Link
              to="/projects"
              className={linkClass("/projects")}
              onClick={handleLinkClick}
            >
              Projects
            </Link>
            <Link
              to="/contact"
              className={linkClass("/contact")}
              onClick={handleLinkClick}
            >
              Contact
            </Link>
            <Link
              to="/blog"
              className={linkClass("/blog")}
              onClick={handleLinkClick}
            >
              Blog
            </Link>
            <Link
              to="/testimonials"
              className={linkClass("/testimonials")}
              onClick={handleLinkClick}
            >
              Testimonials
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
