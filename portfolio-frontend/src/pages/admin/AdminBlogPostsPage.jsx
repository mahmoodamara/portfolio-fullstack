import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const AdminBlogPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const [form, setForm] = useState({
    title: "",
    content: "",
    cover_image: "",
    tags: "",
    author: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/blog");
      setPosts(res.data);
    } catch {
      toast("error", "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      background: "#1f2937",
      color: "#e5e7eb",
    });
  };

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await API.post("/upload", formData); // ← endpoint الموجود في server
    setForm({ ...form, cover_image: res.data.imageUrl }); // ← نضع الرابط تلقائيًا
    Swal.fire({
      title: "Uploaded!",
      text: "Image uploaded successfully.",
      icon: "success",
      background: "#1f2937",
      color: "#fff",
      confirmButtonColor: "#6366f1",
    });
  } catch (err) {
    console.error("Upload error:", err);
    Swal.fire({
      title: "Error!",
      text: "Failed to upload image.",
      icon: "error",
      background: "#1f2937",
      color: "#fff",
      confirmButtonColor: "#6366f1",
    });
  }
};


  const handleSubmit = async () => {
    const { title, content } = form;
    if (!title || !content) {
      toast("warning", "Title and content are required");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/blog/${editingId}`, form);
        toast("success", "Post updated");
      } else {
        await API.post("/blog", form);
        toast("success", "Post created");
      }
      setForm({ title: "", content: "", cover_image: "", tags: "", author: "" });
      setEditingId(null);
      setShowForm(false);
      fetchPosts();
    } catch {
      toast("error", "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      background: "#1f2937",
      color: "#e5e7eb",
    });
    if (isConfirmed) {
      try {
        await API.delete(`/blog/${id}`);
        fetchPosts();
        toast("success", "Post deleted");
      } catch {
        toast("error", "Delete failed");
      }
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      content: p.content,
      cover_image: p.cover_image,
      tags: p.tags,
      author: p.author,
    });
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get all unique tags
  const allTags = ["all", ...new Set(posts.flatMap(post => 
    post.tags ? post.tags.split(",").map(tag => tag.trim()) : []
  ))];

  // Filter and pagination logic
 const filteredPosts = posts.filter(post => {
  const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        post.content.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesTag = selectedTag === "all" || 
                     (post.tags && post.tags.split(",").map(t => t.trim()).includes(selectedTag));
  return matchesSearch && matchesTag;
});


  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const idxFirst = (currentPage - 1) * itemsPerPage;
  const idxLast = idxFirst + itemsPerPage;
  const currentPosts = filteredPosts.slice(idxFirst, idxLast);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600"
          >
            ✨ Blog Management Dashboard
          </motion.h1>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <FaFilter className="text-indigo-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag === "all" ? "All Tags" : tag}
                  </option>
                ))}
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowForm(v => !v);
                  setEditingId(null);
                  setForm({ title: "", content: "", cover_image: "", tags: "", author: "" });
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg"
              >
                <FaPlus /> {editingId ? "Edit Post" : "New Post"}
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 p-8 rounded-2xl shadow-2xl mb-12 space-y-6 border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    {editingId ? "✏️ Edit Post" : "✨ Create New Post"}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Title*</label>
                      <input
                        placeholder="Enter post title"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                   <div>
  <label className="block text-sm font-medium text-gray-300 mb-1">Upload Cover Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
  />
</div>

                    
           {form.cover_image && (
  <div className="mt-2">
    <label className="block text-sm font-medium text-gray-300 mb-1">Image Preview</label>
    <div className="relative h-48 w-full rounded-xl overflow-hidden border-2 border-gray-600">
      <img
        src={form.cover_image}
        alt="Cover preview"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/800x400?text=Image+not+found")
        }
      />
    </div>
  </div>
)}

                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Content*</label>
                      <textarea
                        placeholder="Write your post content here..."
                        rows={6}
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
                    <input
                      placeholder="technology, design, business"
                      value={form.tags}
                      onChange={e => setForm({ ...form, tags: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                    <input
                      placeholder="Post author name"
                      value={form.author}
                      onChange={e => setForm({ ...form, author: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm({ title: "", content: "", cover_image: "", tags: "", author: "" });
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold text-white transition-colors ${
                      editingId 
                        ? "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700" 
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    }`}
                  >
                    {editingId ? <><FaSave /> Update Post</> : <><FaPlus /> Create Post</>}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">😕</div>
                  <h3 className="text-2xl font-bold text-gray-300 mb-2">No posts found</h3>
                  <p className="text-gray-400">Try adjusting your search or create a new post</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentPosts.map(post => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700"
                      >
            {post.cover_image && post.cover_image.trim() !== "" ? (
  <div className="h-48 bg-gray-900 overflow-hidden relative">
    <img
      src={post.cover_image}
      alt={post.title}
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      onError={(e) => {
        e.target.onerror = null; // لمنع التكرار اللانهائي
        e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Found";
      }}
    />
  </div>
) : (
  <div className="h-48 bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center">
    <span className="text-4xl">📝</span>
  </div>
)}

                        
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-white line-clamp-2">{post.title}</h3>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEdit(post)} 
                                className="text-indigo-400 hover:text-indigo-300 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                aria-label="Edit post"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDelete(post.id)} 
                                className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                aria-label="Delete post"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm line-clamp-3 mb-4">{post.content}</p>
                          
                          {post.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.split(",").map(tag => (
                                <span 
                                  key={tag} 
                                  className="text-xs px-2 py-1 bg-gray-700 rounded-full text-indigo-300"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>
                              By <span className="font-medium text-white">{post.author || "Unknown"}</span>
                            </span>
                            <span>
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {filteredPosts.length > itemsPerPage && (
                    <div className="flex justify-center items-center mt-12 space-x-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className={clsx(
                          "p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors",
                          currentPage === 1
                            ? "bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-gray-700 hover:bg-indigo-600"
                        )}
                      >
                        <FaChevronLeft className="text-white text-lg" />
                      </motion.button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentPage(pageNum)}
                              className={clsx(
                                "w-10 h-10 rounded-full focus:outline-none transition-colors",
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
                                  : "bg-gray-700 hover:bg-gray-600"
                              )}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        })}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <span className="mx-1">...</span>
                        )}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(totalPages)}
                            className={clsx(
                              "w-10 h-10 rounded-full focus:outline-none transition-colors",
                              currentPage === totalPages
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
                                : "bg-gray-700 hover:bg-gray-600"
                            )}
                          >
                            {totalPages}
                          </motion.button>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={clsx(
                          "p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors",
                          currentPage === totalPages
                            ? "bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-gray-700 hover:bg-indigo-600"
                        )}
                      >
                        <FaChevronRight className="text-white text-lg" />
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminBlogPostsPage;