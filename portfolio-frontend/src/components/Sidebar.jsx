import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FaBars, FaTimes, FaChevronRight } from "react-icons/fa";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const linkClass = (path) =>
    clsx(
      "flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all group",
      pathname === path
        ? "bg-indigo-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    );

  const handleNavClick = (path) => {
    localStorage.setItem("lastVisitedTab", path);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    const last = localStorage.getItem("lastVisitedTab");
    if (last && pathname === "/admin") {
      navigate(last);
    }
  }, [pathname, navigate]);

  const navLinks = [
    ["/admin/dashboard", "Dashboard", "🧭"],
    ["/admin/projects", "Projects", "📁"],
    ["/admin/messages", "Messages", "✉️"],
    ["/admin/about-us", "About Us", "👥"],
    ["/admin/gallery", "Gallery", "🖼️"],
    ["/admin/testimonials", "Testimonials", "🌟"],
    ["/admin/blog", "Blog System", "📝"],
    ["/admin/settings", "Settings", "⚙️"],
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-3 text-white fixed top-4 left-4 z-50 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition-all"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar (mobile & desktop) */}
      <aside
        className={clsx(
          "bg-gray-800 border-r border-gray-700 min-h-screen p-5 w-64 z-40 fixed md:relative top-0 left-0 transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:block"
        )}
      >
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold text-indigo-400 mb-8 mt-12 md:mt-0 flex items-center gap-2">
            <span className="bg-indigo-600 p-2 rounded-lg">⚙️</span>
            <span>Admin Panel</span>
          </h2>
          
          <nav className="space-y-2 flex-1">
            {navLinks.map(([path, label, icon]) => (
              <Link
                key={path}
                to={path}
                className={linkClass(path)}
                onClick={() => handleNavClick(path)}
                onMouseEnter={() => setHoveredItem(path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </div>
                {pathname !== path && hoveredItem === path && (
                  <FaChevronRight className="text-gray-400 group-hover:text-white transition-all" />
                )}
                {pathname === path && (
                  <FaChevronRight className="text-white" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="text-gray-400 text-sm px-4 py-2">
              v1.0.0
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay when open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;