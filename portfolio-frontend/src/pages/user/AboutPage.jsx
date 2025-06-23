  import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaDownload, 
  FaSpinner,
  FaUser,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

// Analytics utility functions
const analytics = {
  trackPageView: async (pageName) => {
    try {
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

const useAboutAnalytics = () => {
  useEffect(() => {
    analytics.trackPageView('about_page');
  }, []);

  return {
    trackResumeDownload: () => {
      console.log('📊 Resume downloaded');
    },
    
    trackSocialClick: (platform, url) => {
      console.log('📊 Social link clicked:', platform, url);
    },

    trackContactClick: (type, value) => {
      console.log('📊 Contact clicked:', type, value);
    }
  };
};

const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { trackResumeDownload, trackSocialClick, trackContactClick } = useAboutAnalytics();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const res = await API.get("/about");
        setAbout(res.data);
      } catch (err) {
        console.error('Error fetching about info:', err);
        setError("Failed to load profile information");
        Swal.fire({
          title: "Error",
          text: "Unable to load profile information.",
          icon: "error",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#6366f1"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleSocialClick = (platform, url) => {
    trackSocialClick(platform, url);
  };

  const handleContactClick = (type, value) => {
    trackContactClick(type, value);
  };

  const handleResumeDownload = () => {
    trackResumeDownload();
  };


  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile information...</p>
        </div>
      </div>
    );
  }
  if (error || !about) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
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
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            About Me
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get to know more about my background, skills, and professional journey
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto relative">
                  <img
                    src={about.profile_image || "/image_mahmood.PNG"}
                    alt={about.full_name || "Profile"}
                    className="w-full h-full rounded-full object-cover border-4 border-indigo-500 shadow-xl"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-indigo-500/20 to-transparent"></div>
                </div>
              </div>

              {/* Name */}
              <h2 className="text-2xl font-bold mb-2">{about.full_name}</h2>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {about.location && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-center text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer"
                    onClick={() => handleContactClick('location', about.location)}
                  >
                    <FaMapMarkerAlt className="mr-2 text-indigo-400" />
                    <span>{about.location}</span>
                  </motion.div>
                )}
                
                {about.email && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    href={`mailto:${about.email}`}
                    onClick={() => handleContactClick('email', about.email)}
                    className="flex items-center justify-center text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    <MdEmail className="mr-2 text-indigo-400" />
                    <span>{about.email}</span>
                  </motion.a>
                )}
                
                {about.phone && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    href={`tel:${about.phone}`}
                    onClick={() => handleContactClick('phone', about.phone)}
                    className="flex items-center justify-center text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    <FaPhoneAlt className="mr-2 text-indigo-400" />
                    <span>{about.phone}</span>
                  </motion.a>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4 mb-6">
                {about.github_link && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={about.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick('github', about.github_link)}
                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors group"
                  >
                    <FaGithub className="text-xl group-hover:text-indigo-400 transition-colors" />
                  </motion.a>
                )}
                
                {about.linkedin_link && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={about.linkedin_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick('linkedin', about.linkedin_link)}
                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors group"
                  >
                    <FaLinkedin className="text-xl group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                )}
                
                {about.twitter_link && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={about.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick('twitter', about.twitter_link)}
                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors group"
                  >
                    <FaTwitter className="text-xl group-hover:text-blue-400 transition-colors" />
                  </motion.a>
                )}
                
                {about.whatsapp_link && (
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={about.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick('whatsapp', about.whatsapp_link)}
                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors group"
                  >
                    <FaWhatsapp className="text-xl group-hover:text-green-400 transition-colors" />
                  </motion.a>
                )}
              </div>

              {/* Resume Download */}
              {about.resume_url && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={about.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleResumeDownload}
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  <FaDownload className="mr-2" />
                  Download Resume
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-full">
              <div className="flex items-center mb-6">
                <FaUser className="text-2xl text-indigo-400 mr-3" />
                <h2 className="text-2xl font-bold">About Me</h2>
              </div>
              
              {about.bio ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                    {about.bio}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <FaUser className="text-4xl mx-auto mb-2 opacity-50" />
                  </div>
                  <p className="text-gray-400">No bio information available</p>
                </div>
              )}

              {/* Stats Section */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-400 mb-1">5+</div>
                    <div className="text-sm text-gray-400">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">50+</div>
                    <div className="text-sm text-gray-400">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">24/7</div>
                    <div className="text-sm text-gray-400">Available</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-center">Let's Connect</h3>
            <p className="text-gray-300 text-center max-w-2xl mx-auto">
              I'm always interested in hearing about new opportunities and connecting with fellow developers. 
              Feel free to reach out if you'd like to collaborate or just have a chat about technology!
            </p>
            
            <div className="flex justify-center mt-6">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Get In Touch
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;