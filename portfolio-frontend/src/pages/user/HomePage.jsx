import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  const [projects, setProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          projCnt,
          blogCnt,
          msgCnt,
          testCnt,
          projList,
          projChart,
          msgChart,
          testList,
          aboutInfo,
        ] = await Promise.all([
          API.get("/stats/projects-count"),
          API.get("/stats/blog-count"),
          API.get("/stats/messages-count"),
          API.get("/stats/testimonials-count"),
          API.get("/projects"),
          API.get("/stats/projects-per-month"),
          API.get("/stats/messages-per-month"),
          API.get("/testimonials"),
          API.get("/about"),
        ]);

        setProjectsCount(projCnt.data.count);
        setBlogCount(blogCnt.data.count);
        setMessagesCount(msgCnt.data.count);
        setTestimonialsCount(testCnt.data.count);
        setProjects(projList.data.slice(0, 3));

        // build chart data
        const months = projChart.data.map((p) => p.month);
        const merged = months.map((month) => ({
          month,
          projects: +projChart.data.find((p) => p.month === month).count,
          messages: +msgChart.data.find((m) => m.month === month)?.count || 0,
        }));
        setChartData(merged);

        setTestimonials(testList.data.slice(0, 3));
        setResumeUrl(aboutInfo.data.resume_url || "");
      } catch (err) {
        console.error("❌ Error loading data:", err);
        Swal.fire("Error", "Failed to load data", "error");
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* الصورة الشخصية مع تأثيرات التحسين */}
        <div className="relative group">
          <img
            src="/image_mahmood.PNG"
            alt="Mahmoud Mustafa"
            className="w-52 h-52 rounded-full border-4 border-indigo-500 shadow-lg mb-6 transition-all duration-500 group-hover:scale-105 group-hover:shadow-indigo-500/30"
            data-aos="zoom-in"
          />

          <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-indigo-300 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
        </div>

        {/* العنوان والوصف المحسن */}
        <h1
          className="text-4xl font-bold mb-2 text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Mahmoud Mustafa
        </h1>

        <p
          className="text-lg text-gray-300 max-w-xl mb-6 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Full Stack Developer with {new Date().getFullYear() - 2015}+ years of
          experience | Passionate about modern web technologies, AI, and clean
          UI | Creating digital experiences that matter
        </p>

        {/* روابط التواصل الاجتماعي المحسنة */}
        <div
          className="flex gap-6 mt-4"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {[
            {
              icon: <FaEnvelope />,
              url: "mailto:mahmoud@example.com",
              tooltip: "Email Me",
            },
            {
              icon: <FaGithub />,
              url: "https://github.com/mahmoud-mustafa",
              tooltip: "GitHub Profile",
            },
            {
              icon: <FaLinkedin />,
              url: "https://linkedin.com/in/mahmoud-mustafa",
              tooltip: "LinkedIn Profile",
            },
            {
              icon: <FaTwitter />,
              url: "https://twitter.com/mahmoud_dev",
              tooltip: "Twitter Profile",
            },
          ].map((item, index) => (
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

        {/* الأزرار المحسنة */}
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

        {/* الإحصائيات السريعة المحسنة */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl"
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          {[
            { value: projectsCount, label: "Projects", icon: <FaCode /> },
            { value: blogCount, label: "Blog Posts", icon: <FaBlog /> },
            {
              value: testimonialsCount,
              label: "Testimonials",
              icon: <FaQuoteLeft />,
            },
            {
              value: messagesCount,
              label: "Messages",
              icon: <FaEnvelopeOpenText />,
            },
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

        {/* مخطط النشاط المحسن */}
        <div
          className="mt-12 w-full max-w-5xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-indigo-500 transition-all duration-300"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-indigo-400">
              <FaChartLine className="inline mr-2" /> Activity (Last 6 Months)
            </h2>
            <select className="bg-gray-700 text-gray-200 text-sm rounded px-3 py-1 border border-gray-600 focus:border-indigo-500 focus:outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
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

      {/* Latest Projects */}
      {/* Latest Projects Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
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

          {/* Projects Grid */}
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
                {/* Project Card */}
                <div className="h-full flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 border border-gray-700 hover:border-indigo-500 transform group-hover:-translate-y-2">
                  {/* Project Image */}
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
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <button className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      {/* Title and Date */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white line-clamp-2">
                          {project.title}
                        </h3>
                        {project.created_at && (
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {new Date(project.created_at).toLocaleDateString(
                              "en-US"
                            )}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {project.description || "No description available"}
                      </p>
                    </div>

                    {/* Tech Stack */}
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

                    {/* Project Links */}
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

          {/* View All Button */}
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

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 -right-20 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
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

          {/* Testimonials Grid */}
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
                {/* Testimonial Card */}
                <div className="h-full bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-500 shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden">
                  {/* Decorative Quote */}
                  <FaQuoteLeft className="absolute -top-2 -right-2 text-7xl text-indigo-900/20 z-0" />

                  {/* Testimonial Content */}
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-lg ${
                            i < testimonial.rating
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Feedback */}
                    <p className="text-gray-300 mb-6 text-justify leading-relaxed">
                      "{testimonial.feedback}"
                    </p>

                    {/* Client Info */}
                    <div className="flex items-center">
                      {testimonial.avatar && (
                        <div className="mr-4">
                          <img
                            src={testimonial.avatar}
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
    </div>
  );
};

export default HomePage;
