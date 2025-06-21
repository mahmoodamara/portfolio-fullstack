import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FaBars, FaTimes, FaChevronRight } from "react-icons/fa";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showAllLinks, setShowAllLinks] = useState(false);

  // إضافة CSS animation للفيد إن
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .animate-fade-in {
        animation: fade-in 0.6s ease-out;
      }
      @keyframes expand-in {
        from {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .animate-expand-in {
        animation: expand-in 0.4s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const linkClass = (path) =>
    clsx(
      "relative flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 group overflow-hidden",
      pathname === path
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
        : "text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20"
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

  const primaryNavLinks = [
    ["/admin/dashboard", "Dashboard", "🏠", "bg-blue-500"],
    ["/admin/projects", "Projects", "🚀", "bg-green-500"],
    ["/admin/messages", "Messages", "💬", "bg-yellow-500"],
    ["/admin/about-us", "About Us", "ℹ️", "bg-purple-500"],
    ["/admin/gallery", "Gallery", "🎨", "bg-pink-500"],
    ["/admin/blog", "Blog System", "📰", "bg-red-500"],
  ];

  const secondaryNavLinks = [
    ["/admin/testimonials", "Testimonials", "⭐", "bg-orange-500"],
    ["/admin/skills", "Skills", "⚡", "bg-cyan-500"],
    ["/admin/experiences", "Experiences", "💼", "bg-teal-500"],
    ["/admin/educations", "Education", "🎓", "bg-indigo-500"],
    ["/admin/certifications", "Certifications", "🏆", "bg-amber-500"],
    ["/admin/roles", "Roles", "👥", "bg-violet-500"],
    ["/admin/notifications", "Notifications", "🔔", "bg-rose-500"],
    ["/admin/analytics", "Analytics", "📈", "bg-emerald-500"],
    ["/admin/settings", "Settings", "⚙️", "bg-gray-500"],
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];
  const displayedLinks = showAllLinks ? allNavLinks : primaryNavLinks;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-3 text-white fixed top-4 left-4 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-110"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar (mobile & desktop) */}
      <aside
        className={clsx(
          "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-r border-gray-700/50 min-h-screen p-6 w-72 z-40 fixed md:relative top-0 left-0 transform transition-all duration-500 ease-in-out shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:block"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="text-center mb-8 mt-12 md:mt-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl mb-4 mx-auto w-fit shadow-lg">
              <span className="text-3xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-gray-400 text-sm mt-1">Management Dashboard</p>
          </div>
          
          <nav className="space-y-3 flex-1">
            {displayedLinks.map(([path, label, icon, bgColor], index) => {
              const isPrimaryLink = index < primaryNavLinks.length;
              const isNewlyVisible = !isPrimaryLink && showAllLinks;
              
              return (
                <Link
                  key={path}
                  to={path}
                  className={clsx(
                    linkClass(path),
                    isPrimaryLink ? "animate-fade-in" : isNewlyVisible ? "animate-expand-in" : ""
                  )}
                  style={{
                    animationDelay: isPrimaryLink ? `${index * 100}ms` : `${(index - primaryNavLinks.length) * 50}ms`,
                    animationFillMode: 'both'
                  }}
                  onClick={() => handleNavClick(path)}
                  onMouseEnter={() => setHoveredItem(path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center gap-4 z-10 relative">
                    <div className={clsx(
                      "p-2 rounded-lg text-white text-sm transition-all duration-300",
                      pathname === path ? "bg-white/20" : bgColor
                    )}>
                      <span>{icon}</span>
                    </div>
                    <span className="font-medium">{label}</span>
                  </div>
                  
                  {/* Background animation effect */}
                  <div className={clsx(
                    "absolute inset-0 rounded-xl transition-all duration-300 opacity-0",
                    pathname !== path && hoveredItem === path && "opacity-10 bg-gradient-to-r from-indigo-500 to-purple-500"
                  )} />
                  
                  {pathname !== path && hoveredItem === path && (
                    <FaChevronRight className="text-gray-400 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 z-10 relative" />
                  )}
                  {pathname === path && (
                    <FaChevronRight className="text-white z-10 relative animate-pulse" />
                  )}
                </Link>
              );
            })}

            {/* Show More / Show Less Button */}
            <button
              onClick={() => setShowAllLinks(!showAllLinks)}
              className="w-full mt-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 group
                         text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 
                         border-2 border-dashed border-gray-600 hover:border-gray-500 hover:scale-105"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  {showAllLinks ? "🔼" : "🔽"}
                </span>
                <span>
                  {showAllLinks ? "Show Less" : `Show More (${secondaryNavLinks.length})`}
                </span>
              </div>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-700/50">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 text-center">
              <div className="text-gray-300 text-sm font-medium">
                Version 1.0.0
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Admin Dashboard
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay when open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-md transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;