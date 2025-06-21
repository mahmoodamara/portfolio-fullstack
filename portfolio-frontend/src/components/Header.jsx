import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome, FaUser, FaFileAlt, FaCode, FaBlog, FaStar, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('header')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const navigationItems = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/about-us", label: "About", icon: FaUser },
    { path: "/resumes", label: "Resume", icon: FaFileAlt },
    { path: "/projects", label: "Projects", icon: FaCode },
    { path: "/blog", label: "Blog", icon: FaBlog },
    { path: "/testimonials", label: "Reviews", icon: FaStar },
    { path: "/contact", label: "Contact", icon: FaEnvelope },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg shadow-black/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/" 
                className="group flex items-center space-x-2"
                onClick={handleLinkClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    Portfolio
                  </span>
                  <div className="h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      pathname === item.path
                        ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                    onClick={handleLinkClick}
                  >
                    <item.icon className={`text-sm transition-transform duration-300 ${
                      pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Active indicator */}
                    {pathname === item.path && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden relative w-10 h-10 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaTimes className="text-white text-lg" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaBars className="text-white text-lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.nav
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-sm bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                      Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 py-6">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className={`group flex items-center space-x-4 px-6 py-4 transition-all duration-300 ${
                          pathname === item.path
                            ? 'text-white bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-r-4 border-indigo-500'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                        }`}
                        onClick={handleLinkClick}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          pathname === item.path
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg'
                            : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                        }`}>
                          <item.icon className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-lg">{item.label}</span>
                          {pathname === item.path && (
                            <div className="text-xs text-indigo-400 mt-0.5">Current page</div>
                          )}
                        </div>
                        {pathname === item.path && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t border-gray-700/50">
                  <div className="text-center text-gray-400 text-sm">
                    <p className="mb-2">© 2024 My Portfolio</p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs">Available for work</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;