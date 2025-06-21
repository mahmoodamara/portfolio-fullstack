// src/pages/admin/AdminEducationPage.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes, FaGraduationCap, FaUniversity, FaBook, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";

// Schema for form validation
const schema = yup.object().shape({
  institution: yup.string().required("Institution is required"),
  degree: yup.string().required("Degree is required"),
  field_of_study: yup.string().required("Field of study is required"),
  start_year: yup.number().required("Start year is required").min(1900).max(new Date().getFullYear() + 10),
  end_year: yup.number().required("End year is required").min(1900).max(new Date().getFullYear() + 10),
});

const AdminEducationPage = () => {
  const [educationList, setEducationList] = useState([]);
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

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await API.get("/education");
      setEducationList(res.data);
    } catch (err) {
      console.error("Failed to fetch education:", err);
      toast("error", "Failed to load education records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await API.put(`/education/${editingId}`, data);
        toast("success", "Education updated successfully");
        setEditingId(null);
      } else {
        await API.post("/education", data);
        toast("success", "Education added successfully");
      }
      reset();
      setShowForm(false);
      fetchEducation();
    } catch (err) {
      console.error("Error saving education:", err);
      toast("error", "Failed to save education");
    }
  };

  const handleEdit = (edu) => {
    setValue("institution", edu.institution);
    setValue("degree", edu.degree);
    setValue("field_of_study", edu.field_of_study);
    setValue("start_year", edu.start_year);
    setValue("end_year", edu.end_year);
    setEditingId(edu.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Education",
      text: "Are you sure you want to delete this education record? This action cannot be undone.",
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
        await API.delete(`/education/${id}`);
        toast("success", "Education deleted successfully");
        fetchEducation();
      } catch (err) {
        console.error("Error deleting education:", err);
        toast("error", "Failed to delete education");
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
              Education Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your educational background and qualifications
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
                  <FaPlus /> Add New Education
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
                <FaPlus /> New Education
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
                  {editingId ? "Edit Education" : "Add New Education"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaUniversity className="text-indigo-400" />
                      Institution *
                    </label>
                    <input
                      {...register("institution")}
                      placeholder="Harvard University"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.institution?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaGraduationCap className="text-indigo-400" />
                      Degree *
                    </label>
                    <input
                      {...register("degree")}
                      placeholder="Bachelor of Science"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.degree?.message}</p>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaBook className="text-indigo-400" />
                      Field of Study *
                    </label>
                    <input
                      {...register("field_of_study")}
                      placeholder="Computer Science"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.field_of_study?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-400" />
                      Start Year *
                    </label>
                    <input
                      {...register("start_year", { valueAsNumber: true })}
                      type="number"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear() + 10}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.start_year?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-400" />
                      End Year *
                    </label>
                    <input
                      {...register("end_year", { valueAsNumber: true })}
                      type="number"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 10}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.end_year?.message}</p>
                  </div>
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
                        <FaSave /> {editingId ? "Update Education" : "Save Education"}
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
                <p className="text-gray-400">Loading education records...</p>
              </div>
            </div>
          ) : educationList.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 p-8 rounded-2xl max-w-md mx-auto">
                <FaGraduationCap className="text-6xl text-gray-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Education Records Found
                </h3>
                <p className="text-gray-400 mb-4">
                  {showForm
                    ? "Fill the form above to add your first education record"
                    : "Click 'Add New Education' to get started"}
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <FaPlus /> Add Education
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-indigo-400">
                Education Background ({educationList.length})
              </h2>
              
              <div className="space-y-4">
                {educationList.map((edu, i) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-indigo-500 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FaUniversity className="text-indigo-400" />
                          <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <FaGraduationCap className="text-gray-400" />
                          <span className="text-gray-300 text-lg">{edu.degree}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <FaBook className="text-gray-400" />
                          <span className="text-green-300 font-medium">{edu.field_of_study}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FaCalendarAlt className="text-gray-400" />
                          <span className="text-indigo-300 font-medium">
                            {edu.start_year} - {edu.end_year}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(edu)}
                          className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-gray-600 transition"
                          title="Edit education"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(edu.id)}
                          className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-600 transition"
                          title="Delete education"
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

export default AdminEducationPage;