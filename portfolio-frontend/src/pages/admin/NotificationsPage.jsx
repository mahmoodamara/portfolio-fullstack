import { useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { FaBell, FaPlus, FaTrash, FaCheckCircle } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

import Select from "react-select";
import { FaEnvelope, FaBlog, FaProjectDiagram, FaStar } from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotif, setNewNotif] = useState({ type: "", content: "" });
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Error loading notifications:", err);
    }
  };

  const handleAdd = async () => {
    if (!newNotif.type || !newNotif.content) return;
    try {
      await API.post("/notifications", newNotif);
      setNewNotif({ type: "", content: "" });
      fetchNotifications();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Notification added!",
        showConfirmButton: false,
        timer: 3000,
        background: "#1f2937",
        color: "#e5e7eb",
        iconColor: "#10b981",
      });
    } catch (err) {
      Swal.fire("Error", "Failed to add notification", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete this notification?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937",
      color: "#e5e7eb",
    });

    if (confirmed.isConfirmed) {
      try {
        await API.delete(`/notifications/${id}`);
        fetchNotifications();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Notification deleted!",
          showConfirmButton: false,
          timer: 3000,
          background: "#1f2937",
          color: "#e5e7eb",
          iconColor: "#ef4444",
        });
      } catch {
        Swal.fire("Error", "Failed to delete notification", "error");
      }
    }
  };

  const toggleReadStatus = async (id, isRead) => {
    try {
      await API.put(`/notifications/${id}/${isRead ? "unread" : "read"}`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: !isRead } : n))
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: isRead ? "warning" : "info",
        title: isRead ? "Marked as unread" : "Marked as read",
        showConfirmButton: false,
        timer: 3000,
        background: "#1f2937",
        color: "#e5e7eb",
        iconColor: isRead ? "#f59e0b" : "#3b82f6",
      });
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const typeOptions = [
    { value: "message", label: "Message", icon: <FaEnvelope /> },
    { value: "blog", label: "Blog", icon: <FaBlog /> },
    { value: "project", label: "Project", icon: <FaProjectDiagram /> },
    { value: "testimonial", label: "Testimonial", icon: <FaStar /> },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#374151", // gray-700
      borderColor: "#4b5563",
      color: "#fff",
    }),
    singleValue: (base) => ({ ...base, color: "#fff" }),
    menu: (base) => ({ ...base, backgroundColor: "#1f2937" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#4f46e5" : "#1f2937",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}

      <Sidebar />

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="flex items-center gap-3 mb-8">
          <FaBell className="text-yellow-400 text-3xl" />
          <h1 className="text-3xl font-bold">Manage Notifications</h1>
        </div>

        {/* Add new */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              options={typeOptions}
              value={typeOptions.find((opt) => opt.value === newNotif.type)}
              onChange={(selected) =>
                setNewNotif({ ...newNotif, type: selected?.value || "" })
              }
              styles={customStyles}
              placeholder="Select Type..."
              formatOptionLabel={({ label, icon }) => (
                <div className="flex items-center gap-2">
                  {icon} <span>{label}</span>
                </div>
              )}
              isClearable
            />
            <input
              type="text"
              placeholder="Notification content"
              value={newNotif.content}
              onChange={(e) =>
                setNewNotif({ ...newNotif, content: e.target.value })
              }
              className="bg-gray-700 text-white rounded px-4 py-2 border border-gray-600"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg text-white flex items-center gap-2"
          >
            <FaPlus /> Add Notification
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4 flex gap-4 flex-wrap">
          {["all", "message", "blog", "project", "testimonial"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg ${
                filter === t
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        <ul className="space-y-4">
          {filteredNotifications.map((item) => (
            <li
              key={item.id}
              className={`flex justify-between items-start bg-gray-800 p-4 rounded-lg border ${
                item.is_read
                  ? "border-gray-600 opacity-60"
                  : "border-yellow-400"
              }`}
            >
              <div>
                <p className="text-white">{item.content}</p>
                <p className="text-sm text-gray-400">
                  {item.type} • {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleReadStatus(item.id, item.is_read)}
                  className={
                    item.is_read
                      ? "text-yellow-400 hover:text-yellow-300"
                      : "text-green-400 hover:text-green-300"
                  }
                  title={item.is_read ? "Mark as unread" : "Mark as read"}
                >
                  <FaCheckCircle />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-300"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default NotificationsPage;
