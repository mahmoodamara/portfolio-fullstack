import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change = 0, // Percentage change (positive or negative)
  color = 'bg-indigo-600', 
  delay = 0.2,
  prefix = '',
  suffix = '' 
}) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ 
        duration: 0.5, 
        delay,
        hover: { duration: 0.2 }
      }}
      className={`${color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden relative group`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <Icon className="text-2xl text-white" />
          </div>
          <div>
            <p className="text-sm text-white/80 font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {prefix}
              <CountUp 
                end={value} 
                duration={1.5} 
                decimals={value % 1 !== 0 ? 2 : 0}
                separator=","
              />
              {suffix}
            </h3>
          </div>
        </div>
        
        {change !== 0 && (
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
            {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
            <span className="text-sm font-medium">
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Animated progress bar */}
      {change !== 0 && (
        <div className="h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(change), 100)}%` }}
            transition={{ delay: delay + 0.3, duration: 1 }}
            className={`h-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}
          />
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
