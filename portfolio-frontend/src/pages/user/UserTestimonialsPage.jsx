import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaRegStar,
  FaQuoteLeft,
  FaPlus
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const UserTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [showForm, setShowForm] = useState(false);
  const [newForm, setNewForm] = useState({
    name: "",
    job_title: "",
    image_url: "",
    feedback: "",
    rating: ""
  });
  const [uploading, setUploading] = useState(false);

  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000
    });
  };

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/testimonials");
      setTestimonials(res.data);
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
      toast("error", "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const filteredTestimonials = testimonials.filter((t) =>
    ratingFilter === "all" ? true : Number(t.rating) === Number(ratingFilter)
  );

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const currentTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderInteractiveStars = (t) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          onClick={async () => {
            try {
              await API.put(`/testimonials/${t.id}`, { ...t, rating: i });
              toast("success", "Rating updated");
              fetchTestimonials();
            } catch (err) {
              console.error("Rating update failed", err);
              toast("error", "Failed to update rating");
            }
          }}
          className={clsx(
            "cursor-pointer text-lg",
            i <= t.rating ? "text-yellow-400" : "text-gray-500"
          )}
        />
      ))}
    </div>
  );

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate type and size (max 2MB)
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast("warning", "Only JPG/PNG allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast("warning", "Max file size is 2MB");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setNewForm({ ...newForm, image_url: res.data.imageUrl });
      toast("success", "Image uploaded");
    } catch (err) {
      console.error("Upload failed", err);
      toast("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const { name, image_url, feedback, rating } = newForm;
    if (!name || !image_url || !feedback || !rating) {
      toast("warning", "All fields are required");
      return;
    }
    try {
      await API.post("/testimonials", newForm);
      toast("success", "Testimonial added");
      setShowForm(false);
      setNewForm({
        name: "",
        job_title: "",
        image_url: "",
        feedback: "",
        rating: ""
      });
      fetchTestimonials();
    } catch (err) {
      console.error("Submit failed", err);
      toast("error", "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-xl blur-lg"></div>
              <h1 className="relative text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Client Testimonials
              </h1>
            </div>
          </motion.div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover what our valued clients say about their experiences with our services
          </p>
        </motion.div>

        {/* Add Testimonial Button */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2"
          >
            <FaPlus /> Add Testimonial
          </motion.button>
        </div>

        {/* Submission Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 mb-12 max-w-3xl mx-auto"
            >
              <h2 className="text-xl font-bold mb-4 text-indigo-400">
                Add Your Testimonial
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Your Name"
                  value={newForm.name}
                  onChange={(e) =>
                    setNewForm({ ...newForm, name: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  placeholder="Job Title"
                  value={newForm.job_title}
                  onChange={(e) =>
                    setNewForm({ ...newForm, job_title: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">
                    Upload Image:
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="w-full text-gray-200"
                  />
                  {uploading && (
                    <p className="text-gray-400 text-sm mt-1">Uploading...</p>
                  )}
                  {newForm.image_url && (
                    <img
                      src={newForm.image_url}
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover rounded-full border-2 border-indigo-500"
                    />
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Rating (1–5)"
                  min="1"
                  max="5"
                  value={newForm.rating}
                  onChange={(e) =>
                    setNewForm({ ...newForm, rating: e.target.value })
                  }
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <textarea
                rows={4}
                placeholder="Your feedback..."
                value={newForm.feedback}
                onChange={(e) =>
                  setNewForm({ ...newForm, feedback: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white mt-4"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-4 bg-gray-800/30 p-3 rounded-xl border border-gray-700 backdrop-blur-sm">
            <label className="text-sm text-gray-300 font-medium">
              Filter by Rating:
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            >
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}  
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-xl text-gray-400">Loading testimonials...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700 backdrop-blur-sm"
          >
            <div className="text-7xl mb-6">😕</div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-3">
              No testimonials found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try a different filter or add one below
            </p>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-${ratingFilter}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentTestimonials.map((t) => (
                  <motion.div
                    key={t.id}
                    whileHover={{ y: -8 }}
                    className="bg-gray-800/40 p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:border-indigo-500/30 backdrop-blur-sm transition-all"
                  >
                    <div className="relative mb-6">
                      <FaQuoteLeft className="absolute -top-2 -left-2 text-indigo-500/20 text-4xl" />
                      <p className="text-gray-300 leading-relaxed relative z-10">
                        "{t.feedback}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <img
                        src={t.image_url}
                        alt={t.name}
                        className="w-14 h-14 rounded-full border-2 border-indigo-500 object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-bold">{t.name}</h3>
                        <p className="text-sm text-gray-400 mb-1">
                          {t.job_title}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {renderInteractiveStars(t)}
                          <span className="text-xs text-gray-500 ml-1">
                            ({t.rating})
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {filteredTestimonials.length > itemsPerPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center items-center mt-16 gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentPage((p) => Math.max(p - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={clsx(
                    "p-3 rounded-full flex items-center justify-center transition-all",
                    currentPage === 1
                      ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-indigo-600 text-white"
                  )}
                >
                  <FaChevronLeft />
                </motion.button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={clsx(
                          "w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all",
                          page === currentPage
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        )}
                      >
                        {page}
                      </motion.button>
                    )
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={clsx(
                    "p-3 rounded-full flex items-center justify-center transition-all",
                    currentPage === totalPages
                      ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-indigo-600 text-white"
                  )}
                >
                  <FaChevronRight />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserTestimonialsPage;
