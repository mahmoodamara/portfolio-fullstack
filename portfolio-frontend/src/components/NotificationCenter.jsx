import { useEffect, useState } from 'react';
import API from '../api/axios';
import {
  FaEnvelope,
  FaProjectDiagram,
  FaBlog,
  FaStar,
  FaCheckCircle,
} from 'react-icons/fa';

const iconMap = {
  message: <FaEnvelope className="text-emerald-400 text-xl" />,
  project: <FaProjectDiagram className="text-indigo-400 text-xl" />,
  blog: <FaBlog className="text-purple-400 text-xl" />,
  testimonial: <FaStar className="text-yellow-400 text-xl" />,
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications(); // reload
    } catch (err) {
      console.error('❌ Failed to mark as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">🔔 Notification Center</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications to show.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((item) => (
            <li key={item.id} className="flex items-start gap-4 justify-between">
              <div className="flex gap-4">
                <div className="pt-1">
                  {iconMap[item.type] || <FaStar className="text-gray-400 text-xl" />}
                </div>
                <div>
                  <p className={`text-gray-200 ${item.is_read ? 'opacity-60' : ''}`}>
                    {item.content}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              </div>
              {!item.is_read && (
                <button
                  onClick={() => markAsRead(item.id)}
                  className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                >
                  <FaCheckCircle /> Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;
