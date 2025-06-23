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
  FaImages,
  FaTimes,
  FaEye,
  FaCopy,
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
  
  // New states for gallery functionality
  const [selectedProject, setSelectedProject] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [additionalImages, setAdditionalImages] = useState({});
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [addingImage, setAddingImage] = useState(false);
  
  // New project form - additional images
  const [formAdditionalImages, setFormAdditionalImages] = useState([]);
  const [formNewImageUrl, setFormNewImageUrl] = useState("");
  
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
      
      // Fetch additional images count for each project
      const imagesCount = {};
      for (const project of res.data) {
        try {
          const imagesRes = await API.get(`/projects/${project.id}/images`);
          imagesCount[project.id] = imagesRes.data;
        } catch (err) {
          imagesCount[project.id] = [];
        }
      }
      setAdditionalImages(imagesCount);
    } catch (err) {
      console.error(err);
      toast("error", "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectImages = async (projectId) => {
    try {
      const res = await API.get(`/projects/${projectId}/images`);
      return res.data;
    } catch (err) {
      console.error("Error fetching project images:", err);
      return [];
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await API.put(`/projects/${editingId}`, data);
        toast("success", "Project updated successfully");
        setEditingId(null);
      } else {
        // Create new project
        const projectRes = await API.post("/projects", data);
        const newProject = projectRes.data;
        
        // Add additional images if any
        if (formAdditionalImages.length > 0) {
          for (const imageUrl of formAdditionalImages) {
            try {
              await API.post(`/projects/${newProject.id}/images`, {
                image_url: imageUrl
              });
            } catch (err) {
              console.error('Error adding additional image:', err);
            }
          }
        }
        
        toast("success", "Project added successfully");
        setFormAdditionalImages([]); // Clear additional images
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
    // Clear form additional images when editing (they're not needed for edit mode)
    clearFormImages();
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

  // New gallery functions
  const openGalleryModal = async (project) => {
    setSelectedProject(project);
    setShowGalleryModal(true);
    
    // Fetch all images for the project
    const images = await fetchProjectImages(project.id);
    const allImages = [];
    
    // Add main image first
    if (project.image_url) {
      allImages.push({
        id: 'main',
        image_url: project.image_url,
        isMain: true,
        created_at: project.created_at
      });
    }
    
    // Add additional images
    images.forEach(img => {
      allImages.push({
        ...img,
        isMain: false
      });
    });
    
    setGalleryImages(allImages);
    setCurrentImageIndex(0);
  };

  const addAdditionalImage = async () => {
    if (!newImageUrl || !selectedProject) return;
    
    setAddingImage(true);
    try {
      await API.post(`/projects/${selectedProject.id}/images`, {
        image_url: newImageUrl
      });
      
      setNewImageUrl("");
      toast("success", "Image added successfully");
      
      // Refresh gallery
      const images = await fetchProjectImages(selectedProject.id);
      const allImages = [];
      
      if (selectedProject.image_url) {
        allImages.push({
          id: 'main',
          image_url: selectedProject.image_url,
          isMain: true,
          created_at: selectedProject.created_at
        });
      }
      
      images.forEach(img => {
        allImages.push({
          ...img,
          isMain: false
        });
      });
      
      setGalleryImages(allImages);
      
      // Update additional images count
      setAdditionalImages(prev => ({
        ...prev,
        [selectedProject.id]: images
      }));
      
    } catch (err) {
      toast("error", "Failed to add image");
    } finally {
      setAddingImage(false);
    }
  };

  const deleteAdditionalImage = async (imageId) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Image",
      text: "Are you sure you want to delete this image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      background: "#1f2937",
      color: "#e5e7eb",
    });

    if (isConfirmed) {
      try {
        await API.delete(`/images/${imageId}`);
        toast("success", "Image deleted successfully");
        
        // Refresh gallery
        const images = await fetchProjectImages(selectedProject.id);
        const allImages = [];
        
        if (selectedProject.image_url) {
          allImages.push({
            id: 'main',
            image_url: selectedProject.image_url,
            isMain: true,
            created_at: selectedProject.created_at
          });
        }
        
        images.forEach(img => {
          allImages.push({
            ...img,
            isMain: false
          });
        });
        
        setGalleryImages(allImages);
        setCurrentImageIndex(0);
        
        // Update additional images count
        setAdditionalImages(prev => ({
          ...prev,
          [selectedProject.id]: images
        }));
        
      } catch (err) {
        toast("error", "Failed to delete image");
      }
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast("success", "Image URL copied to clipboard");
  };

  // Form additional images management
  const addFormImage = () => {
    if (!formNewImageUrl.trim()) {
      toast("error", "Please enter a valid image URL");
      return;
    }
    
    if (formAdditionalImages.includes(formNewImageUrl)) {
      toast("error", "This image URL is already added");
      return;
    }
    
    setFormAdditionalImages(prev => [...prev, formNewImageUrl]);
    setFormNewImageUrl("");
    toast("success", "Image added to project");
  };

  const removeFormImage = (imageUrl) => {
    setFormAdditionalImages(prev => prev.filter(url => url !== imageUrl));
    toast("success", "Image removed");
  };

  const clearFormImages = () => {
    setFormAdditionalImages([]);
    setFormNewImageUrl("");
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
              Manage and showcase your development projects with image galleries
            </p>
          </div>

          <div className="flex justify-center mb-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowForm((v) => !v);
                if (!showForm && !editingId) {
                  reset();
                  clearFormImages();
                }
                if (editingId && showForm) {
                  setEditingId(null);
                  clearFormImages();
                }
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
                  clearFormImages();
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
                    Main Project Image *
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
                      <p className="text-xs text-gray-400 mt-1">Main Image Preview</p>
                    </div>
                  )}
                  
                  {editingId && (
                    <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-300 text-sm">
                        💡 <strong>Tip:</strong> After saving, click the gallery icon to add more images to this project.
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Images Section - Only for new projects */}
                {!editingId && (
                  <div className="mt-6 space-y-4">
                    <div className="border-t border-gray-700 pt-6">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Additional Images (Optional)
                      </label>
                      
                      {/* Add new image input */}
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={formNewImageUrl}
                          onChange={(e) => setFormNewImageUrl(e.target.value)}
                          placeholder="Enter additional image URL"
                          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFormImage();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addFormImage}
                          disabled={!formNewImageUrl.trim()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                          <FaPlus /> Add
                        </button>
                      </div>

                      {/* Additional images preview */}
                      {formAdditionalImages.length > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-400">
                              {formAdditionalImages.length} additional image{formAdditionalImages.length !== 1 ? 's' : ''}
                            </span>
                            <button
                              type="button"
                              onClick={clearFormImages}
                              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                            >
                              <FaTrash /> Clear All
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {formAdditionalImages.map((imageUrl, index) => (
                              <div
                                key={index}
                                className="relative group bg-gray-700 rounded-lg overflow-hidden border border-gray-600"
                              >
                                <div className="aspect-video">
                                  <img
                                    src={imageUrl}
                                    alt={`Additional ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "https://via.placeholder.com/200x120?text=Invalid+URL";
                                    }}
                                  />
                                </div>
                                
                                {/* Remove button */}
                                <button
                                  type="button"
                                  onClick={() => removeFormImage(imageUrl)}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTimes />
                                </button>
                                
                                {/* Image index */}
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            💡 These images will be added to your project gallery after saving
                          </p>
                        </div>
                      )}
                      
                      {formAdditionalImages.length === 0 && (
                        <div className="text-center py-6 border-2 border-dashed border-gray-600 rounded-lg">
                          <FaImages className="mx-auto text-2xl text-gray-500 mb-2" />
                          <p className="text-gray-500 text-sm">
                            Add additional images to create a gallery for your project
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      
                      {/* Gallery indicator */}
                      {additionalImages[p.id] && additionalImages[p.id].length > 0 && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <FaImages />
                          {additionalImages[p.id].length + 1}
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-indigo-400 truncate">
                          {p.title}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openGalleryModal(p)}
                            className="text-purple-400 hover:text-purple-300 p-1"
                            aria-label="Gallery"
                            title="View Gallery"
                          >
                            <FaImages />
                          </button>
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
                        {p.tech_stack.split(",").slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                        {p.tech_stack.split(",").length > 3 && (
                          <span className="px-2 py-1 bg-gray-600 rounded-md text-xs text-gray-400">
                            +{p.tech_stack.split(",").length - 3}
                          </span>
                        )}
                      </div>
                      
                      {/* Additional images preview */}
                      {additionalImages[p.id] && additionalImages[p.id].length > 0 && (
                        <div className="mb-3">
                          <div className="flex gap-1 mb-2">
                            {additionalImages[p.id].slice(0, 4).map((img, idx) => (
                              <div
                                key={img.id}
                                className="w-8 h-8 rounded border border-gray-600 overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => openGalleryModal(p)}
                              >
                                <img
                                  src={img.image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {additionalImages[p.id].length > 4 && (
                              <div 
                                className="w-8 h-8 rounded border border-gray-600 bg-gray-700 flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:bg-gray-600"
                                onClick={() => openGalleryModal(p)}
                              >
                                +{additionalImages[p.id].length - 4}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {additionalImages[p.id].length} additional image{additionalImages[p.id].length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                      
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

        {/* Gallery Modal */}
        <AnimatePresence>
          {showGalleryModal && selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
              onClick={() => setShowGalleryModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
                    <p className="text-gray-400 text-sm">Project Gallery</p>
                  </div>
                  <button
                    onClick={() => setShowGalleryModal(false)}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="flex h-[600px]">
                  {/* Main Image Display */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
                      {galleryImages.length > 0 && (
                        <>
                          <img
                            src={galleryImages[currentImageIndex]?.image_url}
                            alt={`${selectedProject.title} ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                          
                          {/* Navigation arrows */}
                          {galleryImages.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                              >
                                <FaChevronLeft />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                              >
                                <FaChevronRight />
                              </button>
                            </>
                          )}
                          
                          {/* Image counter */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                            {currentImageIndex + 1} / {galleryImages.length}
                            {galleryImages[currentImageIndex]?.isMain && (
                              <span className="ml-2 text-yellow-400">(Main)</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Current Image Actions */}
                    {galleryImages[currentImageIndex] && (
                      <div className="p-4 bg-gray-900 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => copyImageUrl(galleryImages[currentImageIndex].image_url)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                          >
                            <FaCopy /> Copy URL
                          </button>
                          
                          {!galleryImages[currentImageIndex]?.isMain && (
                            <button
                              onClick={() => deleteAdditionalImage(galleryImages[currentImageIndex].id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                            >
                              <FaTrash /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar with thumbnails and add new */}
                  <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
                    {/* Add new image */}
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">Add New Image</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Image URL"
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={addAdditionalImage}
                          disabled={!newImageUrl || addingImage}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                        >
                          {addingImage ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Thumbnails */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        All Images ({galleryImages.length})
                      </h3>
                      <div className="space-y-2">
                        {galleryImages.map((img, index) => (
                          <div
                            key={img.id}
                            onClick={() => setCurrentImageIndex(index)}
                            className={clsx(
                              "relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                              currentImageIndex === index
                                ? "border-indigo-500"
                                : "border-gray-600 hover:border-gray-500"
                            )}
                          >
                            <div className="aspect-video">
                              <img
                                src={img.image_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {img.isMain && (
                              <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                MAIN
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProjectPage;