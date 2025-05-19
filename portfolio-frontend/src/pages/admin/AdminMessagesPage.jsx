import { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import {
  FaTrash,
  FaEnvelopeOpenText,
  FaEnvelope,
  FaReply,
  FaUserCircle,
  FaSearch,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [senders, setSenders] = useState([]);
  const [selectedSender, setSelectedSender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await API.get("/messages");
      const enriched = res.data.map((msg) => ({ ...msg, replyText: "" }));

      const uniqueSenders = Array.from(
        new Set(enriched.map((msg) => msg.email))
      ).map((email) => {
        const userMessages = enriched.filter((m) => m.email === email);
        const firstMsg = userMessages[0];
        const unreadCount = userMessages.filter((m) => !m.is_read).length;

        return {
          email,
          name: firstMsg.name,
          unreadCount,
          lastMessage: userMessages[0].created_at,
        };
      });

      setMessages(enriched);
      setSenders(uniqueSenders.sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage)));
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to load messages",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#fff",
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#6b7280",
    });
    if (confirm.isConfirmed) {
      await API.delete(`/messages/${id}`);
      fetchMessages();
      Swal.fire({
        title: "Deleted",
        text: "Message deleted successfully",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
      });
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/messages/${id}/read`);
      fetchMessages();
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to mark as read",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
      });
    }
  };

  const sendReply = async (id, replyText) => {
    if (!replyText.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Reply cannot be empty",
        icon: "warning",
        background: "#1f2937",
        color: "#fff",
      });
      return;
    }
    try {
      await API.put(`/messages/${id}/reply`, { admin_reply: replyText });
      Swal.fire({
        title: "Success",
        text: "Reply sent successfully",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
      });
      fetchMessages();
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to send reply",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = selectedSender
    ? messages.filter((msg) => msg.email === selectedSender)
    : [];

  const filteredSenders = senders.filter(sender =>
    sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sender.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />
      <div className="flex-1 p-6 pt-20 sm:pt-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sender List */}
          <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 h-fit border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Senders
              </h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-700/50 pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4 p-3 rounded-lg bg-gray-700/30">
                    <div className="rounded-full bg-gray-600 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
                {filteredSenders.length > 0 ? (
                  filteredSenders.map((sender) => (
                    <li
                      key={sender.email}
                      onClick={() => setSelectedSender(sender.email)}
                      className={`cursor-pointer p-3 rounded-lg transition-all duration-300 hover:bg-gray-700/50 ${
                        selectedSender === sender.email 
                          ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-l-4 border-indigo-400" 
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <FaUserCircle className="text-2xl text-indigo-300" />
                            {sender.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 py-0.5 rounded-full text-white">
                                {sender.unreadCount}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{sender.name}</p>
                            <p className="text-sm text-gray-400 truncate max-w-[180px]">{sender.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FaClock className="text-xs" />
                            {new Date(sender.lastMessage).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(sender.lastMessage).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    No senders found
                  </div>
                )}
              </ul>
            )}
          </div>

          {/* Messages Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {selectedSender 
                  ? `Conversation with ${senders.find(s => s.email === selectedSender)?.name || selectedSender}` 
                  : "Select a sender to view messages"}
              </h1>
              {selectedSender && (
                <button 
                  onClick={() => setSelectedSender(null)}
                  className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Clear selection
                </button>
              )}
            </div>

            {!selectedSender ? (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="text-center p-8 max-w-md">
                  <div className="mx-auto w-24 h-24 bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                    <FaEnvelope className="text-4xl text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No sender selected</h3>
                  <p className="text-gray-400 mb-6">
                    Select a sender from the list to view and reply to their messages
                  </p>
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="text-center p-8 max-w-md">
                  <div className="mx-auto w-24 h-24 bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                    <FaEnvelopeOpenText className="text-4xl text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No messages found</h3>
                  <p className="text-gray-400">
                    This sender hasn't sent any messages yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar pr-2">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-2xl space-y-4 transition-all duration-300 ${
                      msg.is_read 
                        ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" 
                        : "bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-l-4 border-indigo-400"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FaClock />
                        <span>{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-3">
                        {!msg.is_read && (
                          <button
                            onClick={() => markAsRead(msg.id)}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Mark as Read"
                          >
                            <FaEnvelopeOpenText />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <FaUserCircle className="text-2xl text-indigo-300" />
                          {!msg.is_read && (
                            <span className="absolute -top-1 -right-1 bg-yellow-400 w-2 h-2 rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{msg.name}</p>
                          <p className="text-sm text-gray-400">{msg.email}</p>
                        </div>
                      </div>
                      
                      <div className="pl-11">
                        <div className="bg-indigo-600/70 text-white p-4 rounded-2xl rounded-tl-none shadow-lg">
                          <p className="whitespace-pre-line">{msg.message}</p>
                          <p className="text-xs text-indigo-200 mt-2 text-right">
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Admin Reply or Reply Form */}
                    {msg.admin_reply ? (
                      <div className="flex flex-col space-y-3 pl-11">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center">
                            <span className="text-xs font-bold">AD</span>
                          </div>
                          <p className="font-semibold">Admin</p>
                        </div>
                        
                        <div className="bg-green-600/70 text-white p-4 rounded-2xl rounded-tl-none shadow-lg">
                          <p className="whitespace-pre-line">{msg.admin_reply}</p>
                          <p className="text-xs text-green-200 mt-2 text-right">
                            Replied on {new Date(msg.updated_at || msg.replied_at || msg.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pl-11">
                        <div className="flex items-center gap-2 text-sm text-yellow-400 mb-3">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                          <span>No reply yet</span>
                        </div>
                        <div className="relative">
                          <textarea
                            rows="3"
                            placeholder="Type your reply here..."
                            className="w-full bg-gray-800/70 p-4 rounded-xl text-white mb-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            value={msg.replyText}
                            onChange={(e) =>
                              setMessages((prev) =>
                                prev.map((m) =>
                                  m.id === msg.id ? { ...m, replyText: e.target.value } : m
                                )
                              )
                            }
                          />
                          <button
                            onClick={() => sendReply(msg.id, msg.replyText)}
                            disabled={!msg.replyText.trim()}
                            className={`absolute right-3 bottom-6 p-2 rounded-full ${
                              msg.replyText.trim()
                                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            } transition-colors`}
                            title="Send Reply"
                          >
                            <FaPaperPlane />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;