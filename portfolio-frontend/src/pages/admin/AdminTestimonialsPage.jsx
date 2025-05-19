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
  FaStar,
  FaRegStar
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");

  const [form, setForm] = useState({
    name: "",
    job_title: "",
    image_url: "",
    feedback: "",
    rating: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/testimonials");
      setTestimonials(res.data);
    } catch {
      toast("error", "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

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

  const handleSubmit = async () => {
    const { name, image_url, feedback } = form;
    if (!name || !image_url || !feedback) {
      toast("warning", "Name, image and feedback are required");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/testimonials/${editingId}`, form);
        toast("success", "Testimonial updated");
      } else {
        await API.post("/testimonials", form);
        toast("success", "Testimonial added");
      }
      setForm({ name: "", job_title: "", image_url: "", feedback: "", rating: "" });
      setEditingId(null);
      setShowForm(false);
      fetchTestimonials();
    } catch {
      toast("error", "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete this testimonial?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      background: "#1f2937",
      color: "#e5e7eb",
    });

    if (isConfirmed) {
      try {
        await API.delete(`/testimonials/${id}`);
        fetchTestimonials();
        toast("success", "Testimonial deleted");
      } catch {
        toast("error", "Delete failed");
      }
    }
  };

  const handleEdit = (t) => {
    setForm(t);
    setEditingId(t.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered list
  const filteredTestimonials = testimonials.filter((t) =>
    ratingFilter === "all" ? true : Number(t.rating) === Number(ratingFilter)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const idxFirst = (currentPage - 1) * itemsPerPage;
  const idxLast = idxFirst + itemsPerPage;
  const currentTestimonials = filteredTestimonials.slice(idxFirst, idxLast);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-70" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return <div className="flex gap-1">{stars}</div>;
  };

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
            <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              ✨ Testimonials Management
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Showcase your clients' feedback with stunning testimonials that build trust and credibility.
            </p>
          </motion.div>

          {/* Filter + Add */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl border border-gray-700">
              <label className="text-sm text-gray-300 font-medium">Filter by Rating:</label>
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-900 border border-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              >
                <option value="all">All Ratings</option>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowForm((v) => !v);
                setEditingId(null);
                setForm({ name: "", job_title: "", image_url: "", feedback: "", rating: "" });
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold w-full md:w-auto justify-center shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              <FaPlus /> {editingId ? "Edit Testimonial" : "Add New"}
            </motion.button>
          </div>

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl mb-12 space-y-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
                    {editingId ? "✏️ Edit Testimonial" : "➕ Add New Testimonial"}
                  </h2>
                  {form.image_url && (
                    <div className="relative group">
                      <img
                        src={form.image_url}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-full border-2 border-indigo-500 shadow-md transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">Name*</label>
                    <input
                      placeholder="Client name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">Job Title</label>
                    <input
                      placeholder="Client position"
                      value={form.job_title}
                      onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">Image URL*</label>
                    <input
                      placeholder="Paste image URL"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      className="w-full bg-gray-900/70 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                 
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Feedback*</label>
                  <textarea
                    placeholder="Client feedback text"
                    rows={5}
                    value={form.feedback}
                    onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                    className="w-full bg-gray-900/70 border border-gray-700 rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm({ name: "", job_title: "", image_url: "", feedback: "", rating: "" });
                    }}
                    className="flex-1 bg-gray-700/80 hover:bg-gray-600/80 px-6 py-3 rounded-xl font-semibold transition-all border border-gray-600"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                      editingId
                        ? "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    }`}
                  >
                    {editingId ? <><FaSave /> Update</> : <><FaPlus /> Add</>}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Testimonials List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xl text-gray-400">Loading testimonials...</p>
            </div>
          ) : (
            <>
              {filteredTestimonials.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                  <div className="text-6xl mb-4">😕</div>
                  <h3 className="text-2xl font-semibold text-gray-300 mb-2">No testimonials found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {ratingFilter === "all" 
                      ? "You haven't added any testimonials yet. Click 'Add New' to get started!"
                      : `No testimonials with ${ratingFilter} star rating. Try a different filter.`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentTestimonials.map((t) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-gray-700 hover:border-indigo-500/30 overflow-hidden relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="relative group">
                            <img
                              src={t.image_url}
                              alt={t.name}
                              className="w-16 h-16 object-cover rounded-full border-2 border-gray-600 group-hover:border-indigo-400 transition-all"
                            />
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{t.name}</h3>
                            <p className="text-gray-400 text-sm">{t.job_title}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(Number(t.rating))}
                              <span className="text-xs text-gray-500 ml-1">
                                ({t.rating})
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 relative z-10">
                          "{t.feedback}"
                        </p>
                        
                        <div className="flex justify-between items-center mt-6 relative z-10">
                          <p className="text-xs text-gray-500">
                            {new Date(t.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(t)}
                              title="Edit"
                              className="text-indigo-400 hover:text-indigo-300 bg-gray-700/80 p-2 rounded-lg"
                            >
                              <FaEdit />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(t.id)}
                              title="Delete"
                              className="text-red-400 hover:text-red-300 bg-gray-700/80 p-2 rounded-lg"
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {filteredTestimonials.length > itemsPerPage && (
                    <div className="flex justify-center items-center mt-12 space-x-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className={clsx(
                          "p-3 rounded-full focus:outline-none transition-all",
                          currentPage === 1
                            ? "bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-gray-700 hover:bg-indigo-600 shadow-md"
                        )}
                      >
                        <FaChevronLeft className="text-white text-lg" />
                      </motion.button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <motion.button
                            key={page}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(page)}
                            className={clsx(
                              "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all",
                              page === currentPage
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
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
                          "p-3 rounded-full focus:outline-none transition-all",
                          currentPage === totalPages
                            ? "bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-gray-700 hover:bg-indigo-600 shadow-md"
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

export default AdminTestimonialsPage;