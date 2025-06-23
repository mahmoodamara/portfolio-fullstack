import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import API from "../../api/axios";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaImages,
  FaTimes,
  FaEye,
  FaCopy,
  FaImage
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Tooltip from "./Tooltip";

// Analytics utility functions
const analytics = {
  // Simple page view tracking that matches the existing analytics table structure
  trackPageView: async (pageName) => {
    try {
      // Send to analytics endpoint (fire and forget)
      API.post('/analytics', {
        page_name: pageName
      }).catch(err => {
        console.warn('Analytics tracking failed:', err);
      });
    } catch (error) {
      console.warn('Analytics error:', error);
    }
  }
};

// Custom hook for analytics tracking (simplified)
const useAnalytics = () => {
  const startTime = useRef(Date.now());

  // Track page entry
  useEffect(() => {
    analytics.trackPageView('projects_page');
  }, []);

  return {
    // Simplified tracking functions for console logging
    trackProjectView: (projectId, projectTitle) => {
      console.log('📊 Project viewed:', projectTitle);
    },
    
    trackProjectClick: (type, projectId, projectTitle, url) => {
      console.log('📊 Project click:', type, projectTitle, url);
    },

    trackSearch: (query, resultsCount) => {
      console.log('📊 Search performed:', query, 'Results:', resultsCount);
    },

    trackFilter: (filterType, filterValue, resultsCount) => {
      console.log('📊 Filter applied:', filterType, filterValue, 'Results:', resultsCount);
    },

    trackPagination: (page, totalProjects) => {
      console.log('📊 Pagination used:', 'Page', page, 'Total:', totalProjects);
    },

    trackGalleryView: (projectId, projectTitle) => {
      console.log('📊 Gallery viewed:', projectTitle);
    }
  };
};

const ProjectPageUser = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadStartTime = useRef(Date.now());

  // Filters
  const [searchText, setSearchText] = useState("");
  const [techFilter, setTechFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  // Gallery states
  const [additionalImages, setAdditionalImages] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Analytics
  const { trackProjectView, trackProjectClick, trackSearch, trackFilter, trackPagination, trackGalleryView } = useAnalytics();
  const searchTimeout = useRef(null);
  const projectViewTimeouts = useRef({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get("/projects");
        setProjects(data);
        
        // Fetch additional images for each project
        const imagesCount = {};
        for (const project of data) {
          try {
            const imagesRes = await API.get(`/projects/${project.id}/images`);
            imagesCount[project.id] = imagesRes.data;
          } catch (err) {
            console.error(`Error fetching images for project ${project.id}:`, err);
            imagesCount[project.id] = [];
          }
        }
        setAdditionalImages(imagesCount);
        
        // Track loading performance
        const loadTime = Date.now() - loadStartTime.current;
        console.log('📊 Projects loaded:', loadTime + 'ms', data.length + ' projects');
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
        
        console.log('📊 Projects load error:', err.message);
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

  // Gallery functions
  const fetchProjectImages = async (projectId) => {
    try {
      const res = await API.get(`/projects/${projectId}/images`);
      return res.data;
    } catch (err) {
      console.error("Error fetching project images:", err);
      return [];
    }
  };

  const openGalleryModal = async (project) => {
    setSelectedProject(project);
    setShowGalleryModal(true);
    
    // Track gallery view
    trackGalleryView(project.id, project.title);
    
    // Fetch all images for the project
    const images = await fetchProjectImages(project.id);
    const allImages = [];
    
    // Add main image first
    if (project.image_url) {
      allImages.push({
        id: 'main',
        image_url: project.image_url,
        isMain: true,
        created_at: project.created_at
      });
    }
    
    // Add additional images
    images.forEach(img => {
      allImages.push({
        ...img,
        isMain: false
      });
    });
    
    setGalleryImages(allImages);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setSelectedProject(null);
    setGalleryImages([]);
    setCurrentImageIndex(0);
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    // Could add a toast notification here
    console.log('Image URL copied:', url);
  };

  // Analytics handlers
  const handleSearchChange = useCallback((value) => {
    setSearchText(value);
    setCurrentPage(1);

    // Debounced search tracking
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (value.trim()) {
        const resultsCount = projects.filter(p => 
          p.title.toLowerCase().includes(value.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(value.toLowerCase())
        ).length;
        trackSearch(value.trim(), resultsCount);
      }
    }, 1000);
  }, [projects, trackSearch]);

  const handleTechFilterChange = useCallback((value) => {
    setTechFilter(value);
    setCurrentPage(1);
    
    const resultsCount = value === "all" ? projects.length : 
      projects.filter(p => 
        (p.tech_stack || "")
          .split(",")
          .map(t => t.trim().toLowerCase())
          .includes(value.toLowerCase())
      ).length;
    
    trackFilter('technology', value, resultsCount);
  }, [projects, trackFilter]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    trackPagination(newPage, filteredProjects.length);
  }, [filteredProjects.length, trackPagination]);

  const handleProjectMouseEnter = useCallback((project) => {
    // Track project view after 2 seconds of hover
    projectViewTimeouts.current[project.id] = setTimeout(() => {
      trackProjectView(project.id, project.title);
    }, 2000);
  }, [trackProjectView]);

  const handleProjectMouseLeave = useCallback((project) => {
    // Cancel the view tracking if mouse leaves quickly
    if (projectViewTimeouts.current[project.id]) {
      clearTimeout(projectViewTimeouts.current[project.id]);
      delete projectViewTimeouts.current[project.id];
    }
  }, []);

  const handleProjectLinkClick = useCallback((type, project, url) => {
    trackProjectClick(type, project.id, project.title, url);
  }, [trackProjectClick]);

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

  // Track no results found
  useEffect(() => {
    if (!loading && filteredProjects.length === 0 && (searchText || techFilter !== "all")) {
      console.log('📊 No results found:', 'Search:', searchText, 'Filter:', techFilter);
    }
  }, [loading, filteredProjects.length, searchText, techFilter]);

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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-500" />
              </div>
              <select
                value={techFilter}
                onChange={(e) => handleTechFilterChange(e.target.value)}
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
                  onMouseEnter={() => handleProjectMouseEnter(project)}
                  onMouseLeave={() => handleProjectMouseLeave(project)}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-shadow duration-300 border border-gray-700 hover:border-indigo-500"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gray-700 overflow-hidden group">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <FaImage className="text-4xl" />
                      </div>
                    )}
                    
                    {/* Gallery indicator */}
                    {additionalImages[project.id] && additionalImages[project.id].length > 0 && (
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <FaImages />
                        {additionalImages[project.id].length + 1}
                      </div>
                    )}
                    
                    {isNew(project.created_at) && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                        NEW
                      </div>
                    )}
                    
                    {/* Gallery overlay button */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => openGalleryModal(project)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <FaEye /> View Gallery
                      </button>
                    </div>
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
                          {project.tech_stack.split(",").slice(0, 3).map((tech) => (
                            <Tooltip key={tech} content={tech.trim()}>
                              <span 
                                className="bg-indigo-900/50 text-indigo-300 text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-800/50"
                                onClick={() => handleTechFilterChange(tech.trim().toLowerCase())}
                              >
                                {tech.trim()}
                              </span>
                            </Tooltip>
                          ))}
                          {project.tech_stack.split(",").length > 3 && (
                            <span className="bg-gray-700 text-gray-400 text-xs px-3 py-1 rounded-full">
                              +{project.tech_stack.split(",").length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional images preview */}
                    {additionalImages[project.id] && additionalImages[project.id].length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs text-gray-500 uppercase font-semibold mb-2">
                          Gallery Preview
                        </h4>
                        <div className="flex gap-1 mb-2">
                          {additionalImages[project.id].slice(0, 4).map((img, idx) => (
                            <div
                              key={img.id}
                              className="w-8 h-8 rounded border border-gray-600 overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => openGalleryModal(project)}
                            >
                              <img
                                src={img.image_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {additionalImages[project.id].length > 4 && (
                            <div 
                              className="w-8 h-8 rounded border border-gray-600 bg-gray-700 flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:bg-gray-600"
                              onClick={() => openGalleryModal(project)}
                            >
                              +{additionalImages[project.id].length - 4}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {additionalImages[project.id].length} additional image{additionalImages[project.id].length !== 1 ? 's' : ''}
                        </p>
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
                              onClick={() => handleProjectLinkClick('github', project, project.github_link)}
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
                              onClick={() => handleProjectLinkClick('demo', project, project.live_demo_link)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <FaExternalLinkAlt className="text-xl" />
                            </a>
                          </Tooltip>
                        )}
                        <Tooltip content="View gallery">
                          <button
                            onClick={() => openGalleryModal(project)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <FaImages className="text-xl" />
                          </button>
                        </Tooltip>
                      </div>
                      {project.details_link && (
                        <a
                          href={project.details_link}
                          onClick={() => handleProjectLinkClick('details', project, project.details_link)}
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
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
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
                      onClick={() => handlePageChange(pageNum)}
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
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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

      {/* Project Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
            onClick={closeGalleryModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
                  <p className="text-gray-400 text-sm">Project Gallery</p>
                </div>
                <button
                  onClick={closeGalleryModal}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex h-[600px]">
                {/* Main Image Display */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
                    {galleryImages.length > 0 && (
                      <>
                        <img
                          src={galleryImages[currentImageIndex]?.image_url}
                          alt={`${selectedProject.title} ${currentImageIndex + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                        
                        {/* Navigation arrows */}
                        {galleryImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                            >
                              <FaChevronLeft />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                            >
                              <FaChevronRight />
                            </button>
                          </>
                        )}
                        
                        {/* Image counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                          {currentImageIndex + 1} / {galleryImages.length}
                          {galleryImages[currentImageIndex]?.isMain && (
                            <span className="ml-2 text-yellow-400">(Main)</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Current Image Actions */}
                  {galleryImages[currentImageIndex] && (
                    <div className="p-4 bg-gray-900 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => copyImageUrl(galleryImages[currentImageIndex].image_url)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                        >
                          <FaCopy /> Copy URL
                        </button>
                        
                        <div className="text-gray-400 text-sm">
                          {galleryImages[currentImageIndex]?.isMain ? 'Main Project Image' : 'Additional Image'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar with thumbnails */}
                <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      All Images ({galleryImages.length})
                    </h3>
                    <div className="space-y-2">
                      {galleryImages.map((img, index) => (
                        <div
                          key={img.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={clsx(
                            "relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                            currentImageIndex === index
                              ? "border-indigo-500"
                              : "border-gray-600 hover:border-gray-500"
                          )}
                        >
                          <div className="aspect-video">
                            <img
                              src={img.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {img.isMain && (
                            <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                              MAIN
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPageUser;