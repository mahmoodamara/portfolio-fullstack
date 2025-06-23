import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFilePdf,
  FaPaperPlane,
  FaCode,
  FaBlog,
  FaQuoteLeft,
  FaEnvelopeOpenText,
  FaChartLine,
  FaImage,
  FaChevronLeft,
  FaExternalLinkAlt,
  FaChevronRight,
  FaStar,
  FaGraduationCap,
  FaBriefcase,
  FaCertificate,
  FaLink,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaImages,
  FaTimes,
  FaEye,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import API from "../../api/axios";
import Tooltip from "./Tooltip";
import Swal from "sweetalert2";

const HomePage = () => {
  // Existing states
  const [projects, setProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");

  // New states for additional data
  const [aboutInfo, setAboutInfo] = useState({});
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [recommendedLinks, setRecommendedLinks] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  // New states for project gallery functionality
  const [additionalImages, setAdditionalImages] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Execute all API calls in parallel for better performance
        const [
          // Stats
          projCnt,
          blogCnt,
          msgCnt,
          testCnt,
          
          // Main content
          projList,
          testList,
          aboutData,
          blogList,
          galleryList,
          
          // Charts
          projChart,
          msgChart,
          
          // Profile data
          skillsList,
          experienceList,
          educationList,
          certificationsList,
          linksList,
          analyticsData,
        ] = await Promise.all([
          // Stats endpoints
          API.get("/stats/projects-count").catch(() => ({ data: { count: 0 } })),
          API.get("/stats/blog-count").catch(() => ({ data: { count: 0 } })),
          API.get("/stats/messages-count").catch(() => ({ data: { count: 0 } })),
          API.get("/stats/testimonials-count").catch(() => ({ data: { count: 0 } })),
          
          // Main content endpoints
          API.get("/projects").catch(() => ({ data: [] })),
          API.get("/testimonials").catch(() => ({ data: [] })),
          API.get("/about").catch(() => ({ data: {} })),
          API.get("/blog").catch(() => ({ data: [] })),
          API.get("/gallery").catch(() => ({ data: [] })),
          
          // Chart data endpoints
          API.get("/stats/projects-per-month").catch(() => ({ data: [] })),
          API.get("/stats/messages-per-month").catch(() => ({ data: [] })),
          
          // Profile data endpoints
          API.get("/skills").catch(() => ({ data: [] })),
          API.get("/experience").catch(() => ({ data: [] })),
          API.get("/education").catch(() => ({ data: [] })),
          API.get("/certifications").catch(() => ({ data: [] })),
          API.get("/links").catch(() => ({ data: [] })),
          API.get("/analytics").catch(() => ({ data: [] })),
        ]);

        // Set stats
        setProjectsCount(projCnt.data.count || 0);
        setBlogCount(blogCnt.data.count || 0);
        setMessagesCount(msgCnt.data.count || 0);
        setTestimonialsCount(testCnt.data.count || 0);

        // Set main content
        const projectsData = projList.data?.slice(0, 3) || [];
        setProjects(projectsData);
        
        // Fetch additional images for each project
        const imagesCount = {};
        for (const project of projectsData) {
          try {
            const imagesRes = await API.get(`/projects/${project.id}/images`);
            imagesCount[project.id] = imagesRes.data;
          } catch (err) {
            console.error(`Error fetching images for project ${project.id}:`, err);
            imagesCount[project.id] = [];
          }
        }
        setAdditionalImages(imagesCount);
        
        setTestimonials(testList.data?.slice(0, 3) || []);
        setAboutInfo(aboutData.data || {});
        setBlogPosts(blogList.data?.slice(0, 3) || []);
        setGallery(galleryList.data?.slice(0, 6) || []);

        // Set resume URL
        setResumeUrl(aboutData.data?.resume_url || "");

        // Build chart data
        const months = projChart.data?.map((p) => p.month) || [];
        const merged = months.map((month) => ({
          month,
          projects: +(projChart.data?.find((p) => p.month === month)?.count || 0),
          messages: +(msgChart.data?.find((m) => m.month === month)?.count || 0),
        }));
        setChartData(merged);

        // Set profile data
        setSkills(skillsList.data || []);
        setExperience(experienceList.data || []);
        setEducation(educationList.data || []);
        setCertifications(certificationsList.data || []);
        setRecommendedLinks(linksList.data || []);
        setAnalytics(analyticsData.data || []);

        console.log(galleryImages)

        console.log("✅ All data loaded successfully");
      } catch (err) {
        console.error("❌ Error loading data:", err);
        Swal.fire("Error", "Failed to load some data", "warning");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Helper function to get social links from aboutInfo
  const getSocialLinks = () => {
    return [
      {
        icon: <FaEnvelope />,
        url: aboutInfo.email ? `mailto:${aboutInfo.email}` : "mailto:mahmoud@example.com",
        tooltip: "Email Me",
      },
      {
        icon: <FaGithub />,
        url: aboutInfo.github_link || "https://github.com/mahmoud-mustafa",
        tooltip: "GitHub Profile",
      },
      {
        icon: <FaLinkedin />,
        url: aboutInfo.linkedin_link || "https://linkedin.com/in/mahmoud-mustafa",
        tooltip: "LinkedIn Profile",
      },
      {
        icon: <FaTwitter />,
        url: aboutInfo.twitter_link || "https://twitter.com/mahmoud_dev",
        tooltip: "Twitter Profile",
      },
      ...(aboutInfo.whatsapp_link ? [{
        icon: <FaWhatsapp />,
        url: aboutInfo.whatsapp_link,
        tooltip: "WhatsApp",
      }] : []),
    ];
  };

  // Gallery functions for projects
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

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Profile Image */}
        <div className="relative group">
          <img
            src={aboutInfo.profile_image || "/image_mahmood.PNG"}
            alt={aboutInfo.full_name || "Mahmoud Mustafa"}
            className="w-52 h-52 rounded-full border-4 border-indigo-500 shadow-lg mb-6 transition-all duration-500 group-hover:scale-105 group-hover:shadow-indigo-500/30"
            data-aos="zoom-in"
          />
          <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-indigo-300 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
        </div>

        {/* Name and Title */}
        <h1
          className="text-4xl font-bold mb-2 text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {aboutInfo.full_name || "Mahmoud Mustafa"}
        </h1>

        {/* Bio */}
        <p
          className="text-lg text-gray-300 max-w-xl mb-6 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {aboutInfo.bio || `Full Stack Developer with ${new Date().getFullYear() - 2015}+ years of experience | Passionate about modern web technologies, AI, and clean UI | Creating digital experiences that matter`}
        </p>

        {/* Location and Contact Info */}
        {(aboutInfo.location || aboutInfo.phone) && (
          <div className="flex items-center gap-4 mb-4 text-gray-400">
            {aboutInfo.location && (
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-indigo-400" />
                <span className="text-sm">{aboutInfo.location}</span>
              </div>
            )}
            {aboutInfo.phone && (
              <div className="flex items-center gap-1">
                <FaPhone className="text-indigo-400" />
                <span className="text-sm">{aboutInfo.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        <div
          className="flex gap-6 mt-4"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {getSocialLinks().map((item, index) => (
            <Tooltip key={index} content={item.tooltip} placement="bottom">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-white hover:bg-indigo-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                {item.icon}
              </a>
            </Tooltip>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          {resumeUrl ? (
            <motion.a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFilePdf className="text-lg" /> Download CV
            </motion.a>
          ) : (
            <span className="text-gray-500">CV not uploaded yet.</span>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-3 rounded-lg inline-block font-medium transition-all duration-300 shadow-lg hover:shadow-yellow-500/30 flex items-center"
            >
              <FaPaperPlane className="inline mr-2" /> Contact Me
            </Link>
          </motion.div>
        </div>

        {/* Enhanced Stats with Dynamic Data */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl"
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          {[
            { value: projectsCount, label: "Projects", icon: <FaCode /> },
            { value: blogCount, label: "Blog Posts", icon: <FaBlog /> },
            { value: testimonialsCount, label: "Testimonials", icon: <FaQuoteLeft /> },
            { value: messagesCount, label: "Messages", icon: <FaEnvelopeOpenText /> },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg text-center shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 border border-gray-700 hover:border-indigo-500"
              data-aos="fade-up"
              data-aos-delay={1200 + idx * 100}
              whileHover={{ y: -5 }}
            >
              <div className="text-indigo-400 text-2xl mb-2">{item.icon}</div>
              <p className="text-3xl font-bold text-indigo-400">
                {item.value}+
              </p>
              <p className="text-gray-300 text-sm mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Skills Overview */}
        {skills.length > 0 && (
          <div
            className="mt-8 w-full max-w-4xl"
            data-aos="fade-up"
            data-aos-delay="1400"
          >
            <h3 className="text-xl font-bold text-indigo-400 mb-4 text-center">
              Top Skills
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.slice(0, 8).map((skill, index) => (
                <span
                  key={skill.id}
                  className="bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-full text-sm font-medium border border-indigo-800 hover:border-indigo-600 transition-colors"
                >
                  {skill.skill_name}
                  {skill.level && (
                    <span className="ml-2 text-xs text-gray-400">
                      ({skill.level})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Activity Chart */}
        <div
          className="mt-12 w-full max-w-5xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-indigo-500 transition-all duration-300"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-indigo-400">
              <FaChartLine className="inline mr-2" /> Activity (Last 6 Months)
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                stroke="#4b5563"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                stroke="#e5e7eb"
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis stroke="#e5e7eb" tick={{ fill: "#9ca3af" }} />
              <ChartTooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#4b5563",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#e5e7eb" }}
                labelStyle={{ color: "#9ca3af", fontWeight: "bold" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#818cf8"
                name="Projects"
                strokeWidth={3}
                dot={{ r: 5, fill: "#818cf8" }}
                activeDot={{
                  r: 8,
                  stroke: "#818cf8",
                  strokeWidth: 2,
                  fill: "#1e1b4b",
                }}
              />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#6366f1"
                name="Messages"
                strokeWidth={3}
                dot={{ r: 5, fill: "#6366f1" }}
                activeDot={{
                  r: 8,
                  stroke: "#6366f1",
                  strokeWidth: 2,
                  fill: "#1e1b4b",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Tooltip id="my-tooltip" />
      </main>

      {/* Latest Projects Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              Latest Projects
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explore my latest work blending creativity and technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative h-full"
              >
                <div className="h-full flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 border border-gray-700 hover:border-indigo-500 transform group-hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
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
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openGalleryModal(project)}
                          className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <FaEye /> Gallery
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white line-clamp-2">
                          {project.title}
                        </h3>
                        {project.created_at && (
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {new Date(project.created_at).toLocaleDateString("en-US")}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {project.description || "No description available"}
                      </p>
                    </div>

                    {project.tech_stack && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack
                            .split(",")
                            .slice(0, 3)
                            .map((tech) => (
                              <span
                                key={tech.trim()}
                                className="bg-indigo-900/30 text-indigo-300 text-xs px-3 py-1 rounded-full"
                              >
                                {tech.trim()}
                              </span>
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
                      <div className="mb-3">
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

                    <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                      <div className="flex space-x-4">
                        {project.github_link && (
                          <Tooltip content="View source code">
                            <a
                              href={project.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-colors"
                              aria-label="GitHub repository"
                            >
                              <FaGithub className="text-xl" />
                            </a>
                          </Tooltip>
                        )}
                        {project.live_demo_link && (
                          <Tooltip content="View live project">
                            <a
                              href={project.live_demo_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-colors"
                              aria-label="Live demo"
                            >
                              <FaExternalLinkAlt className="text-xl" />
                            </a>
                          </Tooltip>
                        )}
                      </div>

                      {project.details_link && (
                        <a
                          href={project.details_link}
                          className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center"
                        >
                          More <FaChevronLeft className="mr-1 text-xs" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/projects"
              className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-lg font-medium transition-all duration-300"
            >
              View All Projects
              <FaChevronRight className="ml-2 text-xs" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 -right-20 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-indigo-400 text-sm font-semibold mb-3 px-3 py-1 bg-indigo-900/30 rounded-full">
              Client Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What My Clients Say
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Feedback and testimonials from satisfied clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-500 shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden">
                  <FaQuoteLeft className="absolute -top-2 -right-2 text-7xl text-indigo-900/20 z-0" />

                  <div className="relative z-10">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-lg ${
                            i < (testimonial.rating || 5)
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-300 mb-6 text-justify leading-relaxed">
                      "{testimonial.feedback}"
                    </p>

                    <div className="flex items-center">
                      {testimonial.image_url && (
                        <div className="mr-4">
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-semibold">
                          {testimonial.name}
                        </h4>
                        {testimonial.job_title && (
                          <p className="text-indigo-400 text-sm">
                            {testimonial.job_title}
                          </p>
                        )}
                        {testimonial.company && (
                          <p className="text-gray-500 text-xs">
                            {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/testimonials"
              className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-lg font-medium transition-all duration-300"
            >
              View All Testimonials
              <FaChevronRight className="ml-2 text-xs" />
            </Link>
          </motion.div>
        </div>
      </section>

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
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index
                              ? "border-indigo-500"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
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

export default HomePage;