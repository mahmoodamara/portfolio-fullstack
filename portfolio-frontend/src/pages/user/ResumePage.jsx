import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { 
  FaBriefcase, 
  FaGraduationCap, 
  FaCertificate, 
  FaSpinner, 
  FaCode, 
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaDownload,
  FaStar,
  FaTrophy,
  FaLightbulb
} from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
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

const useResumeAnalytics = () => {
  useEffect(() => {
    analytics.trackPageView('resume_page');
  }, []);

  return {
    trackCertificateClick: (certName, url) => {
      console.log('📊 Certificate clicked:', certName, url);
    },
    
    trackSkillInteraction: (skillName, level) => {
      console.log('📊 Skill interaction:', skillName, 'Level:', level);
    },

    trackSectionView: (sectionName) => {
      console.log('📊 Section viewed:', sectionName);
    }
  };
};

const TimelineItem = ({ icon: Icon, title, subtitle, description, date, location, link, onLinkClick, index, color }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, x: -60, scale: 0.8 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 100 }}
      className="relative pl-12 pb-6 last:pb-0 group"
    >
      {/* Enhanced Timeline dot */}
      <div className={`absolute left-0 top-2 w-8 h-8 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110`}>
        <Icon className="text-white text-sm" />
        <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-xl opacity-50 blur-lg -z-10`}></div>
      </div>
      
      {/* Enhanced Timeline line */}
      <div className="absolute left-4 top-12 w-0.5 h-full bg-gradient-to-b from-indigo-500/50 to-transparent"></div>
      
      {/* Enhanced Card */}
      <motion.div 
        whileHover={{ y: -4, rotateX: 2 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 shadow-lg hover:shadow-indigo-500/20 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors duration-300">{title}</h3>
              <p className="text-indigo-400 font-medium">{subtitle}</p>
              {location && (
                <p className="text-gray-400 text-sm flex items-center mt-1">
                  <FaMapMarkerAlt className="mr-1 text-indigo-400" />
                  {location}
                </p>
              )}
            </div>
            <div className="flex items-center text-gray-400 text-sm mt-2 lg:mt-0 bg-gray-900/50 px-3 py-1 rounded-full">
              <FaCalendarAlt className="mr-1 text-indigo-400" />
              {date}
            </div>
          </div>
          
          {description && (
            <p className="text-gray-300 leading-relaxed mb-3">{description}</p>
          )}
          
          {link && (
            <motion.a
              whileHover={{ x: 5 }}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onLinkClick && onLinkClick()}
              className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-medium bg-indigo-500/10 px-3 py-1 rounded-full hover:bg-indigo-500/20 transition-all duration-300"
            >
              <FaExternalLinkAlt className="mr-1" />
              View Certificate
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SkillCard = ({ skillName, level, onHover, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });

  const getLevelConfig = (level) => {
    const configs = {
      1: { color: "from-gray-500 to-gray-600", bgColor: "bg-gray-500/10", textColor: "text-gray-400", text: "Beginner", stars: 1 },
      2: { color: "from-blue-500 to-blue-600", bgColor: "bg-blue-500/10", textColor: "text-blue-400", text: "Intermediate", stars: 2 },
      3: { color: "from-green-500 to-green-600", bgColor: "bg-green-500/10", textColor: "text-green-400", text: "Advanced", stars: 3 },
      4: { color: "from-yellow-500 to-orange-500", bgColor: "bg-yellow-500/10", textColor: "text-yellow-400", text: "Expert", stars: 4 },
      5: { color: "from-purple-500 to-pink-500", bgColor: "bg-purple-500/10", textColor: "text-purple-400", text: "Master", stars: 5 }
    };
    return configs[level] || configs[1];
  };

  const config = getLevelConfig(level);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
      whileHover={{ y: -3, scale: 1.02 }}
      onHoverStart={() => onHover && onHover(skillName, level)}
      className={`${config.bgColor} backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer group relative overflow-hidden`}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">{skillName}</span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ delay: (index * 0.1) + (i * 0.05), type: "spring" }}
              >
                <FaStar 
                  className={`text-xs ${i < config.stars ? config.textColor : 'text-gray-600'} transition-colors duration-300`}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${config.textColor}`}>{config.text}</span>
          <span className="text-gray-400 text-xs">{level}/5</span>
        </div>
        
        {/* Enhanced Progress bar */}
        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${(level / 5) * 100}%` } : {}}
            transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${config.color} relative`}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle, color, children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, type: "spring" }}
      className="text-center mb-8"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${color} rounded-2xl mb-4 shadow-lg`}>
        <Icon className="text-white text-xl" />
        <div className={`absolute w-12 h-12 bg-gradient-to-br ${color} rounded-2xl opacity-50 blur-lg -z-10`}></div>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
        {subtitle}
      </p>
      {children}
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, number, label, color, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
      whileHover={{ y: -5, scale: 1.05 }}
      className="text-center p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br ${color} rounded-xl mb-2 shadow-lg`}>
          <Icon className="text-white text-sm" />
        </div>
        <motion.div 
          className="text-xl font-bold text-white mb-1"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: (index * 0.1) + 0.3, type: "spring", stiffness: 200 }}
        >
          {number}
        </motion.div>
        <div className="text-gray-400 text-xs font-medium">{label}</div>
      </div>
    </motion.div>
  );
};

const ResumePage = () => {
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { trackCertificateClick, trackSkillInteraction, trackSectionView } = useResumeAnalytics();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expRes, eduRes, certRes, skillsRes] = await Promise.all([
          API.get('/experience'),
          API.get('/education'),
          API.get('/certifications'),
          API.get('/skills')
        ]);
        
        setExperience(expRes.data);
        setEducation(eduRes.data);
        setCertifications(certRes.data);
        setSkills(skillsRes.data);
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError("Failed to load resume information");
        Swal.fire({
          title: "Error",
          text: "Unable to load resume information.",
          icon: "error",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#6366f1"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCertificateClick = (cert) => {
    trackCertificateClick(cert.name, cert.credential_url);
  };

  const handleSkillHover = (skillName, level) => {
    trackSkillInteraction(skillName, level);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-8 mx-auto"
          />
          <p className="text-gray-400 text-lg">Loading your professional journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
            >
              My Professional Journey
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Explore my career evolution, educational milestones, and technical expertise
            </motion.p>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
            >
              <FaDownload className="mr-2" />
              Download Resume
            </motion.button>
          </motion.div>

          {/* Stats Overview */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <StatCard icon={FaBriefcase} number={experience.length} label="Experience" color="from-indigo-500 to-blue-600" index={0} />
            <StatCard icon={FaGraduationCap} number={education.length} label="Education" color="from-green-500 to-emerald-600" index={1} />
            <StatCard icon={FaCertificate} number={certifications.length} label="Certificates" color="from-yellow-500 to-orange-600" index={2} />
            <StatCard icon={FaCode} number={skills.length} label="Skills" color="from-purple-500 to-pink-600" index={3} />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-12">
              {/* Experience Section */}
              <section onViewportEnter={() => trackSectionView('experience')}>
                <SectionHeader 
                  icon={FaBriefcase}
                  title="Work Experience"
                  subtitle="My professional journey and career milestones"
                  color="from-indigo-500 to-blue-600"
                />
                
                {experience.length > 0 ? (
                  <div className="space-y-8">
                    {experience.map((exp, idx) => (
                      <TimelineItem
                        key={idx}
                        index={idx}
                        icon={FaBriefcase}
                        title={exp.position}
                        subtitle={exp.company_name}
                        description={exp.description}
                        date={`${exp.start_date} - ${exp.end_date || 'Present'}`}
                        color="from-indigo-500 to-blue-600"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/50">
                    <FaBriefcase className="text-6xl text-gray-600 mb-6 mx-auto" />
                    <p className="text-gray-400 text-xl">No work experience added yet</p>
                  </div>
                )}
              </section>

              {/* Education Section */}
              <section onViewportEnter={() => trackSectionView('education')}>
                <SectionHeader 
                  icon={FaGraduationCap}
                  title="Education"
                  subtitle="Academic achievements and learning journey"
                  color="from-green-500 to-emerald-600"
                />
                
                {education.length > 0 ? (
                  <div className="space-y-8">
                    {education.map((edu, idx) => (
                      <TimelineItem
                        key={idx}
                        index={idx}
                        icon={FaGraduationCap}
                        title={edu.degree}
                        subtitle={`${edu.institution} • ${edu.field_of_study}`}
                        date={`${edu.start_year} - ${edu.end_year}`}
                        color="from-green-500 to-emerald-600"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/50">
                    <FaGraduationCap className="text-6xl text-gray-600 mb-6 mx-auto" />
                    <p className="text-gray-400 text-xl">No education records added yet</p>
                  </div>
                )}
              </section>

              {/* Certifications Section */}
              <section onViewportEnter={() => trackSectionView('certifications')}>
                <SectionHeader 
                  icon={FaTrophy}
                  title="Certifications"
                  subtitle="Professional certifications and achievements"
                  color="from-yellow-500 to-orange-600"
                />
                
                {certifications.length > 0 ? (
                  <div className="space-y-8">
                    {certifications.map((cert, idx) => (
                      <TimelineItem
                        key={idx}
                        index={idx}
                        icon={FaTrophy}
                        title={cert.name}
                        subtitle={cert.issuer}
                        date={cert.issue_date}
                        link={cert.credential_url}
                        onLinkClick={() => handleCertificateClick(cert)}
                        color="from-yellow-500 to-orange-600"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/50">
                    <FaTrophy className="text-6xl text-gray-600 mb-6 mx-auto" />
                    <p className="text-gray-400 text-xl">No certifications added yet</p>
                  </div>
                )}
              </section>
            </div>

            {/* Enhanced Sidebar */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="sticky top-8"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-3 shadow-lg">
                      <FaLightbulb className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Technical Skills</h3>
                    <p className="text-gray-400 text-sm">My expertise & proficiency levels</p>
                  </div>
                  
                  {skills.length > 0 ? (
                    <div className="space-y-3" onViewportEnter={() => trackSectionView('skills')}>
                      {skills.map((skill, idx) => (
                        <SkillCard
                          key={idx}
                          index={idx}
                          skillName={skill.skill_name}
                          level={skill.level}
                          onHover={handleSkillHover}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaCode className="text-3xl text-gray-600 mb-3 mx-auto" />
                      <p className="text-gray-400 text-sm">No skills added yet</p>
                    </div>
                  )}

                  {/* Enhanced Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-sm font-bold text-white mb-3 text-center">Portfolio Summary</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-900/50 rounded-xl">
                        <div className="text-lg font-bold text-indigo-400">{experience.length}</div>
                        <div className="text-xs text-gray-400">Experience</div>
                      </div>
                      <div className="text-center p-3 bg-gray-900/50 rounded-xl">
                        <div className="text-lg font-bold text-green-400">{education.length}</div>
                        <div className="text-xs text-gray-400">Education</div>
                      </div>
                      <div className="text-center p-3 bg-gray-900/50 rounded-xl">
                        <div className="text-lg font-bold text-yellow-400">{certifications.length}</div>
                        <div className="text-xs text-gray-400">Certificates</div>
                      </div>
                      <div className="text-center p-3 bg-gray-900/50 rounded-xl">
                        <div className="text-lg font-bold text-purple-400">{skills.length}</div>
                        <div className="text-xs text-gray-400">Skills</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;