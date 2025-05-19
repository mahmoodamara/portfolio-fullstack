import { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar";
import {
  FaFilePdf,
  FaImage,
  FaSave,
  FaSpinner,
  FaUser,
  FaLink,
  FaGlobe,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaEdit,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AdminAboutPage = () => {
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    profile_image: "",
    resume_url: "",
    github_link: "",
    linkedin_link: "",
    whatsapp_link: "",
    twitter_link: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await API.get("/about");
        if (res.data) setForm(res.data);
      } catch (err) {
        console.error("Error loading about info:", err);
        Swal.fire("Error", "Failed to load info", "error");
      }
    };
    fetchAbout();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploadingImage(true);
    try {
      const res = await API.post("/upload", formData);
      setForm({ ...form, profile_image: res.data.imageUrl });
      Swal.fire({
        title: "Uploaded!",
        text: "Profile image uploaded successfully",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to upload image",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    setUploadingResume(true);
    try {
      const res = await API.post("/pdfUpload/pdf", formData);
      setForm({ ...form, resume_url: res.data.fileUrl });
      Swal.fire({
        title: "Uploaded!",
        text: "Resume uploaded successfully",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    } catch (err) {
      console.error("Resume upload error:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to upload resume",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await API.put("/about", form);
      Swal.fire({
        title: "Saved!",
        text: "Information updated successfully",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      setForm(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to update information",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Basic Information */}
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
    <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
      <FaUser className="text-indigo-400" /> Basic Information
    </h3>
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Full Name
        </label>
        <div className="relative">
          <FaUser
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={form.full_name || ""}
            onChange={e =>
              setForm({ ...form, full_name: e.target.value })
            }
            disabled={!isEditing}
            className="
              w-full bg-gray-700 text-white
              border border-gray-600 rounded-lg
              p-3 pl-10
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            "
          />
          <FaEdit
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2
              text-gray-400 cursor-pointer
              ${isEditing ? "text-indigo-400" : ""}
            `}
            onClick={() => setIsEditing(!isEditing)}
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Location
        </label>
        <div className="relative">
          <FaMapMarkerAlt
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={form.location || ""}
            onChange={e =>
              setForm({ ...form, location: e.target.value })
            }
            disabled={!isEditing}
            className="
              w-full bg-gray-700 text-white
              border border-gray-600 rounded-lg
              p-3 pl-10
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            "
          />
        </div>
      </div>
    </div>
  </div>

  {/* Contact Information */}
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
    <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
      <FaUser className="text-indigo-400" /> Contact Information
    </h3>
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Email
        </label>
        <div className="relative">
          <FaEnvelope
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="email"
            value={form.email || ""}
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
            disabled={!isEditing}
            className="
              w-full bg-gray-700 text-white
              border border-gray-600 rounded-lg
              p-3 pl-10
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            "
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Phone Number
        </label>
        <div className="relative">
          <FaPhone
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="tel"
            value={form.phone || ""}
            onChange={e =>
              setForm({ ...form, phone: e.target.value })
            }
            disabled={!isEditing}
            className="
              w-full bg-gray-700 text-white
              border border-gray-600 rounded-lg
              p-3 pl-10
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            "
          />
        </div>
      </div>
    </div>
  </div>
</div>

            {/* Bio */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                <FaUser className="text-indigo-400" /> Bio
              </h3>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  About You
                </label>
                <textarea
                  value={form.bio || ""}
                  onChange={(e) =>
                    setForm({ ...form, bio: e.target.value })
                  }
                  rows={5}
                  className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </motion.div>
        );

      case "media":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Profile Image */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                <FaImage className="text-indigo-400" /> Profile Image
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  {form.profile_image ? (
                    <>
                      <img
                        src={form.profile_image}
                        alt="Profile"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-indigo-500/30 shadow-lg transition-all duration-300 group-hover:border-indigo-500/60"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        <span className="text-white text-sm bg-indigo-600 px-3 py-1 rounded-full">
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-700 border-4 border-dashed border-gray-600 flex items-center justify-center">
                      <FaImage className="text-4xl text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="block mb-3 text-sm font-medium text-gray-300">
                    Upload New Image (JPG, PNG)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-700/50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="text-3xl text-indigo-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-400">
                        Click to select or drag file here
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG (max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadingImage && (
                    <div className="mt-3 flex items-center gap-2 text-indigo-400">
                      <FaSpinner className="animate-spin" />
                      <span>Uploading image...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resume PDF */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                <FaFilePdf className="text-indigo-400" /> Resume (PDF)
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-gray-700 border-4 border-dashed border-gray-600 flex flex-col items-center justify-center p-4">
                    <FaFilePdf className="text-4xl text-red-400 mb-2" />
                    <span className="text-xs text-gray-400 text-center">
                      PDF File
                    </span>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  {form.resume_url && (
                    <div className="mb-4">
                      <a
                        href={form.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        <FaFilePdf /> View Current Resume
                      </a>
                    </div>
                  )}
                  <label className="block mb-3 text-sm font-medium text-gray-300">
                    Upload New Resume (PDF)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-700/50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaFilePdf className="text-3xl text-red-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-400">
                        Click to select or drag file here
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF (max 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadingResume && (
                    <div className="mt-3 flex items-center gap-2 text-indigo-400">
                      <FaSpinner className="animate-spin" />
                      <span>Uploading file...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "social":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                field: "github_link",
                icon: "fab fa-github",
                color: "from-gray-800 to-gray-900",
                text: "GitHub",
              },
              {
                field: "linkedin_link",
                icon: "fab fa-linkedin",
                color: "from-blue-800 to-blue-900",
                text: "LinkedIn",
              },
              {
                field: "whatsapp_link",
                icon: "fab fa-whatsapp",
                color: "from-green-800 to-green-900",
                text: "WhatsApp",
              },
              {
                field: "twitter_link",
                icon: "fab fa-twitter",
                color: "from-sky-800 to-sky-900",
                text: "Twitter",
              },
            ].map((item) => (
              <div
                key={item.field}
                className={`bg-gradient-to-br ${item.color} p-6 rounded-xl border border-gray-700 shadow-lg`}
              >
                <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                  <i className={`${item.icon} text-xl`}></i> {item.text}
                </h3>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 rounded-l-lg bg-gray-700 text-gray-300 text-sm border border-r-0 border-gray-600 flex items-center">
                    <FaLink className="mr-2" /> https://
                  </span>
                  <input
                    type="text"
                    value={
                      form[item.field]
                        ? form[item.field].replace(/^https?:\/\//, "")
                        : ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [item.field]: `https://${e.target.value}`,
                      })
                    }
                    className="flex-1 min-w-0 p-2.5 rounded-r-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder={`${item.text.toLowerCase()}.com/username`}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <main className="flex-1 p-4 pt-20 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
                <span className="p-2 bg-indigo-600/20 rounded-lg">
                  <FaUser className="text-indigo-400" />
                </span>
                Personal Info Management
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Update your personal, professional info and social links
              </p>
            </div>
            <div className="flex gap-3">
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg font-medium text-white shadow flex items-center gap-2 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2.5 rounded-lg font-medium text-white shadow-lg flex items-center gap-2 transition-all hover:shadow-xl"
              >
                <FaSave /> {isEditing ? "Save Changes" : "Edit Info"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-700/50">
            {/* Tabs */}
            <div className="border-b border-gray-700/50">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 border-b-2 font-medium text-sm sm:text-base transition-all ${
                    activeTab === "personal"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                  }`}
                >
                  <FaUser className="text-sm sm:text-base" /> Personal Info
                </button>
                <button
                  onClick={() => setActiveTab("media")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 border-b-2 font-medium text-sm sm:text-base transition-all ${
                    activeTab === "media"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                  }`}
                >
                  <FaImage className="text-sm sm:text-base" /> Media & Files
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 border-b-2 font-medium text-sm sm:text-base transition-all ${
                    activeTab === "social"
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                  }`}
                >
                  <FaGlobe className="text-sm sm:text-base" /> Social Links
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">{renderTabContent()}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAboutPage;
