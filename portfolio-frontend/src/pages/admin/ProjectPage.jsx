import { useEffect, useState, useMemo } from "react";
import API from "../../api/axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaGithub,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaImage,
  FaSave,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";

// Schema for form validation
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  tech_stack: yup.string().required("Tech stack is required"),
  image_url: yup.string().url().required("Image URL is required"),
  github_link: yup.string().url().required("GitHub URL is required"),
  live_demo_link: yup.string().url().required("Live Demo URL is required"),
});

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageUploading, setImageUploading] = useState(false);
  const projectsPerPage = 3;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const imageUrl = watch("image_url");

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const currentProjects = useMemo(() => {
    const idxLast = currentPage * projectsPerPage;
    const idxFirst = idxLast - projectsPerPage;
    return projects.slice(idxFirst, idxLast);
  }, [currentPage, projects]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      toast("error", "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await API.put(`/projects/${editingId}`, data);
        toast("success", "Project updated successfully");
        setEditingId(null);
      } else {
        await API.post("/projects", data);
        toast("success", "Project added successfully");
      }
      reset();
      setShowForm(false);
      fetchProjects();
    } catch {
      toast("error", "Failed to save project");
    }
  };

  const handleEdit = (proj) => {
    for (const key in proj) {
      if (proj.hasOwnProperty(key)) {
        setValue(key, proj[key]);
      }
    }
    setEditingId(proj.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Project",
      text: "Are you sure you want to delete this project? This action cannot be undone.",
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
        await API.delete(`/projects/${id}`);
        if (currentProjects.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        }
        fetchProjects();
        toast("success", "Project deleted successfully");
      } catch {
        toast("error", "Failed to delete project");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    
    try {
      const res = await API.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValue("image_url", res.data.imageUrl);
      toast("success", "Image uploaded successfully");
    } catch {
      toast("error", "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Project Portfolio
            </h1>
            <p className="text-gray-400 mt-2">
              Manage and showcase your development projects
            </p>
          </div>

          <div className="flex justify-center mb-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowForm((v) => !v);
                if (!showForm && !editingId) reset();
                if (editingId && showForm) setEditingId(null);
              }}
              className={clsx(
                "px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all",
                showForm
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {showForm ? (
                <>
                  <FaChevronLeft /> Cancel
                </>
              ) : (
                <>
                  <FaPlus /> Add New Project
                </>
              )}
            </motion.button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  reset();
                }}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <FaPlus /> New Project
              </button>
            )}
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-12 border border-gray-700"
              >
                <h2 className="text-xl font-bold mb-6 text-indigo-400">
                  {editingId ? "Edit Project" : "Add New Project"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Project Title *
                    </label>
                    <input
                      {...register("title")}
                      placeholder="My Awesome Project"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-red-400 text-sm">{errors.title?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Tech Stack *
                    </label>
                    <input
                      {...register("tech_stack")}
                      placeholder="React, Node.js, MongoDB"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-red-400 text-sm">{errors.tech_stack?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      GitHub URL *
                    </label>
                    <input
                      {...register("github_link")}
                      placeholder="https://github.com/user/project"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-red-400 text-sm">{errors.github_link?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Live Demo URL *
                    </label>
                    <input
                      {...register("live_demo_link")}
                      placeholder="https://myproject.demo"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-red-400 text-sm">
                      {errors.live_demo_link?.message}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Description *
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="A brief description of your project..."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-red-400 text-sm">{errors.description?.message}</p>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Project Image *
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        {...register("image_url")}
                        placeholder="Image URL or upload below"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="text-red-400 text-sm">{errors.image_url?.message}</p>
                    </div>
                    <div className="relative">
                      <label className="inline-flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600">
                        <FaImage className="mr-2" />
                        {imageUploading ? "Uploading..." : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={imageUploading}
                        />
                      </label>
                      {imageUploading && (
                        <FaSpinner className="absolute right-3 top-3 animate-spin" />
                      )}
                    </div>
                  </div>
                  
                  {imageUrl && (
                    <div className="mt-2">
                      <div className="w-full h-40 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Image Preview</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting}
                    className={clsx(
                      "px-6 py-3 rounded-xl font-semibold flex items-center gap-2",
                      editingId
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-indigo-600 hover:bg-indigo-700",
                      isSubmitting && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaSave /> {editingId ? "Update Project" : "Save Project"}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-400 mb-4" />
                <p className="text-gray-400">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 p-8 rounded-2xl max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Projects Found
                </h3>
                <p className="text-gray-400 mb-4">
                  {showForm
                    ? "Fill the form above to add your first project"
                    : "Click 'Add New Project' to get started"}
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <FaPlus /> Add Project
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-700"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex justify-center items-center">
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="max-w-full max-h-full object-contain p-4"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-indigo-400 truncate">
                          {p.title}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-yellow-400 hover:text-yellow-300 p-1"
                            aria-label="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            aria-label="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {p.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tech_stack.split(",").map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                        <a
                          href={p.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                        >
                          <FaGithub /> Code
                        </a>
                        <a
                          href={p.live_demo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
                        >
                          <FaExternalLinkAlt /> Live Demo
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={clsx(
                      "p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors",
                      currentPage === 1
                        ? "bg-gray-700 cursor-not-allowed opacity-50"
                        : "bg-gray-700 hover:bg-indigo-600"
                    )}
                    aria-label="Previous page"
                  >
                    <FaChevronLeft />
                  </motion.button>
                  
                  <div className="mx-6 flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            currentPage === page
                              ? "bg-indigo-600 font-bold"
                              : "bg-gray-700 hover:bg-gray-600"
                          )}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={clsx(
                      "p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors",
                      currentPage === totalPages
                        ? "bg-gray-700 cursor-not-allowed opacity-50"
                        : "bg-gray-700 hover:bg-indigo-600"
                    )}
                    aria-label="Next page"
                  >
                    <FaChevronRight />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectPage;