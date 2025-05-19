import { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaTrash, FaPlus, FaEdit, FaSave, FaChevronLeft, FaChevronRight, FaSearch, FaTimes } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useCallback } from "react";

const AdminGalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    image_url: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [isHovering, setIsHovering] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 3; // Increased for better grid layout
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const idxLast = currentPage * imagesPerPage;
  const idxFirst = idxLast - imagesPerPage;
  const currentImages = images.slice(idxFirst, idxLast);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/gallery");
      setImages(res.data);
    } catch (err) {
      toast("error", "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Toast helper
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

  const handleSubmit = async () => {
    const { title, image_url } = form;
    if (!title || !image_url) {
      toast("warning", "Title and image URL are required");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/gallery/${editingId}`, form);
        toast("success", "Image updated");
        setEditingId(null);
      } else {
        await API.post("/gallery", form);
        toast("success", "Image added");
      }
      setForm({ title: "", image_url: "", description: "" });
      fetchGallery();
      setShowForm(false);
    } catch {
      toast("error", "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete this image?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#e5e7eb",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4b5563",
    });

    if (isConfirmed) {
      try {
        await API.delete(`/gallery/${id}`);
        if (currentImages.length === 1 && currentPage > 1) {
          setCurrentPage(p => p - 1);
        }
        fetchGallery();
        toast("success", "Image deleted");
      } catch {
        toast("error", "Delete failed");
      }
    }
  };

  const handleEdit = (img) => {
    setForm(img);
    setEditingId(img.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredImages = images.filter(img =>
    img.title.toLowerCase().includes(search.toLowerCase()) ||
    (img.description && img.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              🎨 Gallery Masterpiece
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Curate your visual collection with elegance and style
            </p>
          </motion.div>

          {/* Search and Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="relative w-full md:w-1/2">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search masterpieces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-900 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowForm(v => !v);
                setEditingId(null);
                setForm({ title: "", image_url: "", description: "" });
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all w-full md:w-auto justify-center"
            >
              <FaPlus className="text-lg" /> 
              {editingId ? "Edit Masterpiece" : "Add New Masterpiece"}
            </motion.button>
          </div>

          {/* Animated Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl mb-16 space-y-8 border border-gray-700/50"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    {editingId ? "✏️ Edit Masterpiece" : "🎨 Create Masterpiece"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm({ title: "", image_url: "", description: "" });
                    }}
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Title*</label>
                      <input
                        name="title"
                        placeholder="My Awesome Artwork"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-5 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-900 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Image URL*</label>
                      <input
                        name="image_url"
                        placeholder="https://example.com/image.jpg"
                        value={form.image_url}
                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                        className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-5 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-900 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Description</label>
                      <textarea
                        name="description"
                        placeholder="Tell the story behind this artwork..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-5 py-3 h-32 resize-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-900 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="block text-gray-300 mb-2">Preview</label>
                    <div className="flex-1 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center overflow-hidden">
                      {form.image_url ? (
                        <img
                          src={form.image_url}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-xl"
                        />
                      ) : (
                        <div className="text-gray-500 text-center p-8">
                          <p className="text-lg">Image preview will appear here</p>
                          <p className="text-sm mt-2">Enter a valid image URL above</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm({ title: "", image_url: "", description: "" });
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-xl font-semibold text-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-colors ${
                      editingId
                        ? "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    }`}
                  >
                    {editingId ? (
                      <>
                        <FaSave /> Update Masterpiece
                      </>
                    ) : (
                      <>
                        <FaPlus /> Add to Gallery
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentImages.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    onMouseEnter={() => setIsHovering(img.id)}
                    onMouseLeave={() => setIsHovering(null)}
                    className="relative bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-700/50"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={img.image_url}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      
                      {/* Hover overlay with buttons */}
                      <AnimatePresence>
                        {isHovering === img.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4"
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(img)}
                              className="bg-yellow-600 hover:bg-yellow-700 p-3 rounded-full text-white shadow-lg"
                              title="Edit"
                            >
                              <FaEdit className="text-lg" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(img.id)}
                              className="bg-red-600 hover:bg-red-700 p-3 rounded-full text-white shadow-lg"
                              title="Delete"
                            >
                              <FaTrash className="text-lg" />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 truncate">{img.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{img.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(img.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(img)}
                            className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-gray-700 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(img.id)}
                            className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-gray-700 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {filteredImages.length > imagesPerPage && (
                <div className="flex justify-center items-center mt-8 mb-12 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={clsx(
                      "p-3 rounded-full focus:outline-none transition-colors flex items-center gap-2",
                      currentPage === 1
                        ? "bg-gray-700 cursor-not-allowed opacity-50"
                        : "bg-gray-700 hover:bg-indigo-600"
                    )}
                  >
                    <FaChevronLeft className="text-white" />
                    <span className="hidden sm:inline">Previous</span>
                  </motion.button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center font-medium",
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        )}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={clsx(
                      "p-3 rounded-full focus:outline-none transition-colors flex items-center gap-2",
                      currentPage === totalPages
                        ? "bg-gray-700 cursor-not-allowed opacity-50"
                        : "bg-gray-700 hover:bg-indigo-600"
                    )}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FaChevronRight className="text-white" />
                  </motion.button>
                </div>
              )}
            </>
          )}

          {!loading && filteredImages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="text-8xl mb-6">🖼️</div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">
                  {search ? "No masterpieces found" : "Your gallery is empty"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {search 
                    ? "Try different search terms" 
                    : "Start by adding your first masterpiece"}
                </p>
                {search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-medium"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto"
                  >
                    <FaPlus /> Add First Masterpiece
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminGalleryPage;