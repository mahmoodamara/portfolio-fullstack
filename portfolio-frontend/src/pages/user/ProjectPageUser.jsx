import React, { useEffect, useState, useMemo } from "react";
import API from "../../api/axios";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaSpinner
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Tooltip from "./Tooltip";

const ProjectPageUser = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [techFilter, setTechFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get("/projects");
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Memoized tech options
  const techOptions = useMemo(() => {
    return Array.from(
      new Set(
        projects
          .flatMap((p) => (p.tech_stack || "").split(","))
          .map((t) => t.trim())
          .filter(Boolean)
      )
    ).sort();
  }, [projects]);

  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const text = searchText.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(text) ||
        (p.description || "").toLowerCase().includes(text);
      
      const matchesTech =
        techFilter === "all" ||
        (p.tech_stack || "")
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .includes(techFilter.toLowerCase());
      
      return matchesSearch && matchesTech;
    });
  }, [projects, searchText, techFilter]);

  // Pagination calculations
  const { currentProjects, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(filteredProjects.length / perPage);
    const start = (currentPage - 1) * perPage;
    const currentProjects = filteredProjects.slice(start, start + perPage);
    
    return { currentProjects, totalPages };
  }, [filteredProjects, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Helper functions
  const isNew = (dateStr) => {
    if (!dateStr) return false;
    const days = (Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
    return days <= 15;
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'Unknown date';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center p-6 max-w-md bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            My Projects Portfolio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore my collection of projects showcasing various technologies and solutions
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10 bg-gray-800 p-4 rounded-xl shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search projects by title or description..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-500" />
              </div>
              <select
                value={techFilter}
                onChange={(e) => {
                  setTechFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Technologies</option>
                {techOptions.map((tech) => (
                  <option key={tech} value={tech.toLowerCase()}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-indigo-400" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-800 rounded-xl"
          >
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500">
              {searchText || techFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "There are currently no projects to display"}
            </p>
          </motion.div>
        )}

        {/* Projects Grid */}
        <AnimatePresence>
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-shadow duration-300 border border-gray-700 hover:border-indigo-500"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gray-700 overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image Available
                      </div>
                    )}
                    {isNew(project.created_at) && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                        NEW
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white truncate">
                        {project.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDate(project.created_at)}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {project.description || "No description available"}
                    </p>

                    {/* Tech Stack */}
                    {project.tech_stack && (
                      <div className="mb-4">
                        <h4 className="text-xs text-gray-500 uppercase font-semibold mb-2">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.split(",").map((tech) => (
                            <Tooltip key={tech} content={tech.trim()}>
                              <span className="bg-indigo-900/50 text-indigo-300 text-xs px-3 py-1 rounded-full">
                                {tech.trim()}
                              </span>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                      <div className="flex space-x-3">
                        {project.github_link && (
                          <Tooltip content="View source code">
                            <a
                              href={project.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <FaGithub className="text-xl" />
                            </a>
                          </Tooltip>
                        )}
                        {project.live_demo_link && (
                          <Tooltip content="View live demo">
                            <a
                              href={project.live_demo_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <FaExternalLinkAlt className="text-xl" />
                            </a>
                          </Tooltip>
                        )}
                      </div>
                      {project.details_link && (
                        <a
                          href={project.details_link}
                          className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          View Details →
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4"
          >
            <div className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{currentPage * perPage - perPage + 1}</span> to{' '}
              <span className="text-white font-medium">
                {Math.min(currentPage * perPage, filteredProjects.length)}
              </span>{' '}
              of <span className="text-white font-medium">{filteredProjects.length}</span> projects
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={clsx(
                  "px-4 py-2 rounded-lg transition-colors flex items-center",
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-indigo-600"
                )}
              >
                <FaChevronLeft className="mr-1" /> Previous
              </motion.button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={clsx(
                        "w-10 h-10 rounded-lg transition-colors",
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={clsx(
                  "px-4 py-2 rounded-lg transition-colors flex items-center",
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-indigo-600"
                )}
              >
                Next <FaChevronRight className="ml-1" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ProjectPageUser;