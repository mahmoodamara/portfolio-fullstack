import { FaPlus, FaPen, FaCog, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const actions = [
  { 
    label: 'Add Project', 
    icon: FaPlus, 
    to: '/admin/projects/add', 
    color: 'bg-gradient-to-br from-indigo-600 to-indigo-500',
    hoverColor: 'from-indigo-700 to-indigo-600'
  },
  { 
    label: 'New Blog Post', 
    icon: FaPen, 
    to: '/admin/blog/add', 
    color: 'bg-gradient-to-br from-purple-600 to-purple-500',
    hoverColor: 'from-purple-700 to-purple-600'
  },
  { 
    label: 'Settings', 
    icon: FaCog, 
    to: '/admin/settings', 
    color: 'bg-gradient-to-br from-gray-700 to-gray-600',
    hoverColor: 'from-gray-800 to-gray-700'
  },
];

const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-10"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        <span className="text-sm text-gray-400">Shortcuts to common tasks</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden"
          >
            <Link
              to={action.to}
              className={`flex items-center justify-between p-5 rounded-xl ${action.color} hover:${action.hoverColor} transition-all duration-300 group`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <action.icon className="text-xl text-white" />
                </div>
                <span className="text-white font-semibold">{action.label}</span>
              </div>
              
              <motion.div
                initial={{ x: 5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-transform"
              >
                <FaArrowRight />
              </motion.div>
            </Link>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute -inset-1 bg-white/10 blur-md group-hover:opacity-50 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;