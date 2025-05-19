import { useEffect, useState } from 'react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope,
  FaProjectDiagram,
  FaBlog,
  FaClock,
  FaSpinner
} from 'react-icons/fa';
import { FiAlertCircle } from 'react-icons/fi';

const iconMap = {
  message: <FaEnvelope className="text-emerald-500" />,
  project: <FaProjectDiagram className="text-indigo-500" />,
  blog: <FaBlog className="text-purple-500" />,
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await API.get('/activity');
        setActivities(res.data.activities || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load recent activity:', err);
        setError('Failed to load activity data');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
    
    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-indigo-400">🔄</span> Recent Activity
        </h2>
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
          Auto-refresh every 30s
        </span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-gray-400 py-8"
          >
            <FaSpinner className="animate-spin" />
            <span>Loading activity...</span>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 bg-red-900/30 p-4 rounded-lg text-red-400"
          >
            <FiAlertCircle className="text-lg" />
            <span>{error}</span>
          </motion.div>
        ) : activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-2 text-gray-500 py-8"
          >
            <FaClock className="text-2xl" />
            <span>No recent activity</span>
          </motion.div>
        ) : (
          <AnimatePresence>
            <ul className="space-y-3">
              {activities.map((item, index) => (
                <motion.li
                  key={item.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-3 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-gray-700 rounded-lg">
                    {iconMap[item.type] || <FaProjectDiagram className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 font-medium truncate">{item.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(item.time).toLocaleString()}
                      </span>
                      {item.user && (
                        <span className="text-xs px-2 py-0.5 bg-indigo-900/30 text-indigo-400 rounded-full">
                          {item.user}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;