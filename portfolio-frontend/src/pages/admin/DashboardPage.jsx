import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { showConfirmAlert, showSuccessAlert } from "../../utils/swal";
import {
  FaProjectDiagram,
  FaEnvelope,
  FaBlog,
  FaSignOutAlt,
  FaStar,
} from "react-icons/fa";
import StatCard from "../../components/StatCard";
import QuickActions from "../../components/QuickActions";
import ProjectChart from "../../components/ProjectChart";
import MessagesChart from "../../components/MessagesChart";
import RecentActivity from "../../components/RecentActivity";
import AdminCalendar from "../../components/AdminCalendar";
import NotificationCenter from "../../components/NotificationCenter";
import Sidebar from '../../components/Sidebar';
import API from "../../api/axios";

function DashboardPage() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  const handleLogout = async () => {
    const result = await showConfirmAlert({
      title: "Are you sure?",
      text: "You will be logged out!",
      confirmText: "Yes, logout",
      cancelText: "Cancel",
    });

    if (result.isConfirmed) {
      logout();
      showSuccessAlert("Logged out", "You have been logged out successfully.");
      navigate("/admin/login");
    }
  };

  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    blog: 0,
    testimonials: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, m, b, t] = await Promise.all([
          API.get("/stats/projects-count"),
          API.get("/stats/messages-count"),
          API.get("/stats/blog-count"),
          API.get("/stats/testimonials-count"),
        ]);
        setStats({
          projects: p.data.count,
          messages: m.data.count,
          blog: b.data.count,
          testimonials: t.data.count,
        });
      } catch (err) {
        console.error("❌ Failed to load stats:", err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 pt-16 sm:pt-6">
      {/* Header */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
  <div className="flex-1 min-w-0">
    <h1 className="text-2xl sm:text-3xl font-bold text-white">
      Welcome back, <span className="text-indigo-400">Admin</span>
    </h1>
    <p 
      className="text-indigo-300 font-medium mt-2 truncate"
      title={admin?.email}
    >
      {admin?.email}
    </p>
  </div>
  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white flex items-center gap-2 transition-all 
              hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
    aria-label="Logout"
  >
    <FaSignOutAlt className="flex-shrink-0" /> 
    <span className="hidden sm:inline">Sign Out</span>
    <span className="inline sm:hidden">Logout</span>
  </button>
</div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            icon={FaProjectDiagram}
            label="Projects"
            value={stats.projects}
            color="bg-indigo-600"
            delay={0.1}
          />
          <StatCard
            icon={FaEnvelope}
            label="Messages"
            value={stats.messages}
            color="bg-emerald-500"
            delay={0.2}
          />
          <StatCard
            icon={FaBlog}
            label="Blog Posts"
            value={stats.blog}
            color="bg-purple-500"
            delay={0.3}
          />
          <StatCard
            icon={FaStar}
            label="Testimonials"
            value={stats.testimonials}
            color="bg-yellow-500"
            delay={0.4}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <ProjectChart />
          <MessagesChart />
        </div>

        <div className="mt-8">
          <RecentActivity />
        </div>

        <div className="mt-8">
          <AdminCalendar />
        </div>

        <div className="mt-8">
          <NotificationCenter />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;