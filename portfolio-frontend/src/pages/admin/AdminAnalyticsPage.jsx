// src/pages/admin/AdminAnalyticsPage.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaTrash, FaChartBar, FaDesktop, FaGlobe, FaCalendarAlt, FaSpinner, FaEye, FaSync } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#1f2937",
      color: "#e5e7eb",
    });
  };

  const fetchAnalytics = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const res = await API.get("/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      toast("error", "Failed to load analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Analytics Entry",
      text: "Are you sure you want to delete this analytics entry? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#e5e7eb",
    });

    if (isConfirmed) {
      try {
        await API.delete(`/analytics/${id}`);
        toast("success", "Analytics entry deleted successfully");
        fetchAnalytics();
      } catch (err) {
        console.error("Delete error:", err);
        toast("error", "Failed to delete analytics entry");
      }
    }
  };

  const handleClearAll = async () => {
    if (analytics.length === 0) return;

    const { isConfirmed } = await Swal.fire({
      title: "Clear All Analytics",
      text: "Are you sure you want to delete ALL analytics data? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete All",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#e5e7eb",
    });

    if (isConfirmed) {
      try {
        // Delete all entries (assuming there's an endpoint or delete them one by one)
        await Promise.all(analytics.map(entry => API.delete(`/analytics/${entry.id}`)));
        toast("success", "All analytics data cleared successfully");
        fetchAnalytics();
      } catch (err) {
        console.error("Clear all error:", err);
        toast("error", "Failed to clear analytics data");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalViews = () => {
    return analytics.reduce((total, entry) => total + (entry.views || 0), 0);
  };

  const getUniquePages = () => {
    const uniquePages = new Set(analytics.map(entry => entry.page_name));
    return uniquePages.size;
  };

  const getMostViewedPage = () => {
    if (analytics.length === 0) return "N/A";
    const sorted = analytics.sort((a, b) => (b.views || 0) - (a.views || 0));
    return sorted[0]?.page_name || "N/A";
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Monitor website traffic and user interactions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <FaEye className="text-blue-400 text-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Views</h3>
                  <p className="text-2xl font-bold text-blue-400">{getTotalViews()}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <FaDesktop className="text-green-400 text-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Pages</h3>
                  <p className="text-2xl font-bold text-green-400">{getUniquePages()}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <FaChartBar className="text-purple-400 text-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Top Page</h3>
                  <p className="text-lg font-bold text-purple-400">{getMostViewedPage()}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all disabled:opacity-70"
            >
              <FaSync className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </motion.button>

            {analytics.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all"
              >
                <FaTrash />
                Clear All Data
              </motion.button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-400 mb-4" />
                <p className="text-gray-400">Loading analytics data...</p>
              </div>
            </div>
          ) : analytics.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 p-8 rounded-2xl max-w-md mx-auto">
                <FaChartBar className="text-6xl text-gray-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Analytics Data
                </h3>
                <p className="text-gray-400">
                  Page view analytics will appear here as users visit your website.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-indigo-400">
                  Page Analytics ({analytics.length} records)
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaDesktop className="text-indigo-400" />
                          Page Name
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-2">
                          <FaEye className="text-indigo-400" />
                          Views
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-indigo-400" />
                          Last Viewed
                        </div>
                      </th>
                      <th className="py-4 px-6 text-right text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {analytics.map((entry, i) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="hover:bg-gray-700 transition-colors"
                      >
                        <td className="py-4 px-6 text-sm text-gray-300 font-medium">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-600 text-gray-100">
                            {entry.page_name || "Unknown Page"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-center">
                          <span className="inline-flex px-2 py-1 text-sm font-bold rounded-full bg-indigo-600 text-indigo-100">
                            {entry.views || 0}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-300">
                          {formatDate(entry.last_viewed)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-600 transition"
                            title="Delete entry"
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAnalyticsPage;