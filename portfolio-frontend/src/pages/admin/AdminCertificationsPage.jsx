// src/pages/admin/AdminCertificationsPage.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes, FaCertificate, FaBuilding, FaCalendarAlt, FaLink, FaSpinner, FaAward } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";

// Schema for form validation
const schema = yup.object().shape({
  name: yup.string().required("Certification name is required"),
  issuer: yup.string().required("Issuer is required"),
  issue_date: yup.string().required("Issue date is required"),
  credential_url: yup.string().url("Must be a valid URL"),
});

const AdminCertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
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

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/certifications");
      setCertifications(res.data);
    } catch (err) {
      console.error("Error fetching certifications", err);
      toast("error", "Failed to load certifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await API.put(`/certifications/${editingId}`, data);
        toast("success", "Certification updated successfully");
        setEditingId(null);
      } else {
        await API.post("/certifications", data);
        toast("success", "Certification added successfully");
      }
      reset();
      setShowForm(false);
      fetchCertifications();
    } catch (err) {
      console.error("Error saving certification:", err);
      toast("error", "Failed to save certification");
    }
  };

  const handleEdit = (cert) => {
    setValue("name", cert.name);
    setValue("issuer", cert.issuer);
    setValue("issue_date", cert.issue_date);
    setValue("credential_url", cert.credential_url || "");
    setEditingId(cert.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Certification",
      text: "Are you sure you want to delete this certification? This action cannot be undone.",
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
        await API.delete(`/certifications/${id}`);
        toast("success", "Certification deleted successfully");
        fetchCertifications();
      } catch (err) {
        console.error("Error deleting certification:", err);
        toast("error", "Failed to delete certification");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Certifications Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your professional certifications and credentials
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
                  <FaPlus /> Add New Certification
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
                <FaPlus /> New Certification
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
                  {editingId ? "Edit Certification" : "Add New Certification"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaCertificate className="text-indigo-400" />
                      Certification Name *
                    </label>
                    <input
                      {...register("name")}
                      placeholder="AWS Certified Solutions Architect"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.name?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaBuilding className="text-indigo-400" />
                      Issuer *
                    </label>
                    <input
                      {...register("issuer")}
                      placeholder="Amazon Web Services"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.issuer?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-400" />
                      Issue Date *
                    </label>
                    <input
                      {...register("issue_date")}
                      type="date"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.issue_date?.message}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FaLink className="text-indigo-400" />
                      Credential URL
                    </label>
                    <input
                      {...register("credential_url")}
                      placeholder="https://example.com/verify/123"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                    />
                    <p className="text-red-400 text-sm">{errors.credential_url?.message}</p>
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
                        <FaSave /> {editingId ? "Update Certification" : "Save Certification"}
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
                <p className="text-gray-400">Loading certifications...</p>
              </div>
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 p-8 rounded-2xl max-w-md mx-auto">
                <FaAward className="text-6xl text-gray-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Certifications Found
                </h3>
                <p className="text-gray-400 mb-4">
                  {showForm
                    ? "Fill the form above to add your first certification"
                    : "Click 'Add New Certification' to get started"}
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <FaPlus /> Add Certification
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-indigo-400">
                Professional Certifications ({certifications.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-indigo-500 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <FaCertificate className="text-yellow-400 text-xl" />
                        <h3 className="text-lg font-bold text-white leading-tight">{cert.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <FaBuilding className="text-gray-400" />
                        <span className="text-gray-300">{cert.issuer}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="text-indigo-300 font-medium">
                          {formatDate(cert.issue_date)}
                        </span>
                      </div>
                      
                      {cert.credential_url && (
                        <div className="mb-3">
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 flex items-center gap-2 text-sm"
                          >
                            <FaLink /> View Credential
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-600">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(cert)}
                        className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-gray-600 transition"
                        title="Edit certification"
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(cert.id)}
                        className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-600 transition"
                        title="Delete certification"
                      >
                        <FaTrash />
                      </motion.button>
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

export default AdminCertificationsPage;