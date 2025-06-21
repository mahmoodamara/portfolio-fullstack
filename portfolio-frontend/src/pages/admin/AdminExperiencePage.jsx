// src/pages/admin/AdminExperiencePage.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes, FaBriefcase, FaBuilding, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";

// Schema for form validation
const schema = yup.object().shape({
  position: yup.string().required("Position is required"),
  company_name: yup.string().required("Company name is required"),
  start_date: yup.string().required("Start date is required"),
  end_date: yup.string(),
  description: yup.string(),
});

const AdminExperiencePage = () => {
  const [experiences, setExperiences] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/experience");
      setExperiences(data);
    } catch (err) {
      console.error("Error fetching experiences", err);
      toast("error", "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await API.put(`/experience/${editingId}`, data);
        toast("success", "Experience updated successfully");
        setEditingId(null);
      } else {
        await API.post("/experience", data);
        toast("success", "Experience added successfully");
      }
      reset();
      setShowForm(false);
      fetchExperiences();
    } catch (err) {
      console.error("Error saving experience", err);
      toast("error", "Failed to save experience");
    }
  };

  const handleEdit = (exp) => {
    setValue("position", exp.position);
    setValue("company_name", exp.company_name);
    setValue("start_date", exp.start_date);
    setValue("end_date", exp.end_date || "");
    setValue("description", exp.description || "");
    setEditingId(exp.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Experience",
      text: "Are you sure you want to delete this experience? This action cannot be undone.",
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
        await API.delete(`/experience/${id}`);
        toast("success", "Experience deleted successfully");
        fetchExperiences();
      } catch (err) {
        console.error("Error deleting experience", err);
        toast("error", "Failed to delete experience");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Experience Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your professional work experience
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
                  <FaTimes /> Cancel
                </>
              ) : (
                <>
                  <FaPlus /> Add New Experience
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
                <FaPlus /> New Experience
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
                  {editingId ? "Edit Experience" : "Add New Experience"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaBriefcase className="text-indigo-400" />
                      Position *
                    </label>
                    <input
                      {...register("position")}
                      placeholder="Software Engineer"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.position?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaBuilding className="text-indigo-400" />
                      Company Name *
                    </label>
                    <input
                      {...register("company_name")}
                      placeholder="Google Inc."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.company_name?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-400" />
                      Start Date *
                    </label>
                    <input
                      {...register("start_date")}
                      type="date"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.start_date?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-400" />
                      End Date
                    </label>
                    <input
                      {...register("end_date")}
                      type="date"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-gray-400 text-xs">Leave empty if currently working</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="Describe your role and achievements..."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  />
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
                        <FaSave /> {editingId ? "Update Experience" : "Save Experience"}
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
                <p className="text-gray-400">Loading experiences...</p>
              </div>
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 p-8 rounded-2xl max-w-md mx-auto">
                <FaBriefcase className="text-6xl text-gray-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Experience Found
                </h3>
                <p className="text-gray-400 mb-4">
                  {showForm
                    ? "Fill the form above to add your first experience"
                    : "Click 'Add New Experience' to get started"}
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <FaPlus /> Add Experience
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-indigo-400">
                Work Experience ({experiences.length})
              </h2>
              
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-indigo-500 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FaBriefcase className="text-indigo-400" />
                          <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <FaBuilding className="text-gray-400" />
                          <span className="text-gray-300 text-lg">{exp.company_name}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <FaCalendarAlt className="text-gray-400" />
                          <span className="text-indigo-300 font-medium">
                            {exp.start_date} - {exp.end_date || "Present"}
                          </span>
                        </div>
                        
                        {exp.description && (
                          <p className="text-gray-300 text-sm leading-relaxed mt-3 pl-6 border-l-2 border-indigo-500">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(exp)}
                          className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-gray-600 transition"
                          title="Edit experience"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(exp.id)}
                          className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-600 transition"
                          title="Delete experience"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminExperiencePage;