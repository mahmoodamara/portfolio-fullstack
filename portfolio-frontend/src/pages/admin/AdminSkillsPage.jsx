// src/pages/admin/AdminSkillsPage.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState(1);
  const [editSkillId, setEditSkillId] = useState(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [editSkillLevel, setEditSkillLevel] = useState(1);

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

  const fetchSkills = async () => {
    try {
      const res = await API.get("/skills");
      setSkills(res.data);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      toast("error", "Failed to fetch skills");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast("error", "Please enter a skill name");
      return;
    }
    
    try {
      await API.post("/skills", { 
        skill_name: newSkill, 
        level: newLevel 
      });
      toast("success", "Skill added successfully");
      setNewSkill("");
      setNewLevel(1);
      fetchSkills();
    } catch (err) {
      console.error("Error adding skill:", err);
      toast("error", "Failed to add skill");
    }
  };

  const handleDeleteSkill = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Skill",
      text: "Are you sure you want to delete this skill? This action cannot be undone.",
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
        await API.delete(`/skills/${id}`);
        toast("success", "Skill deleted successfully");
        fetchSkills();
      } catch (err) {
        console.error("Error deleting skill:", err);
        toast("error", "Failed to delete skill");
      }
    }
  };

  const handleUpdateSkill = async () => {
    if (!editSkillName.trim()) {
      toast("error", "Please enter a skill name");
      return;
    }

    try {
      // עדכון המערך המקומי
      const updatedSkills = skills.map(skill => 
        skill.id === editSkillId 
          ? { ...skill, skill_name: editSkillName, level: editSkillLevel }
          : skill
      );

      // שליחת כל המערך לשרת (כמו שהcontroller מצפה)
      await API.put("/skills", { 
        skills: updatedSkills.map(({ skill_name, level }) => ({ skill_name, level }))
      });
      
      toast("success", "Skill updated successfully");
      setEditSkillId(null);
      setEditSkillName("");
      setEditSkillLevel(1);
      fetchSkills();
    } catch (err) {
      console.error("Error updating skill:", err);
      toast("error", "Failed to update skill");
    }
  };

  const startEdit = (skill) => {
    setEditSkillId(skill.id);
    setEditSkillName(skill.skill_name);
    setEditSkillLevel(skill.level);
  };

  const cancelEdit = () => {
    setEditSkillId(null);
    setEditSkillName("");
    setEditSkillLevel(1);
  };

  const getLevelDisplay = (level) => {
    const levels = {
      1: "Beginner",
      2: "Intermediate", 
      3: "Advanced",
      4: "Expert",
      5: "Master"
    };
    return levels[level] || `Level ${level}`;
  };

  const getLevelColor = (level) => {
    const colors = {
      1: "text-gray-300 bg-gray-600",
      2: "text-blue-300 bg-blue-600",
      3: "text-green-300 bg-green-600", 
      4: "text-yellow-300 bg-yellow-600",
      5: "text-purple-300 bg-purple-600"
    };
    return colors[level] || "text-gray-300 bg-gray-600";
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Skills Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage and showcase your technical skills
            </p>
          </div>

          {/* Add New Skill */}
          <div className="mb-8 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-indigo-400">Add New Skill</h2>
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Enter skill name"
                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 min-w-[200px]"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <select
                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newLevel}
                onChange={(e) => setNewLevel(parseInt(e.target.value))}
              >
                <option value={1}>Beginner</option>
                <option value={2}>Intermediate</option>
                <option value={3}>Advanced</option>
                <option value={4}>Expert</option>
                <option value={5}>Master</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddSkill}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition"
              >
                <FaPlus /> Add Skill
              </motion.button>
            </div>
          </div>

          {/* Skills List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-6 text-indigo-400">Current Skills ({skills.length})</h2>
            {skills.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-700 p-8 rounded-2xl max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No Skills Found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Add your first skill using the form above
                  </p>
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {skills.map((skill, i) => (
                  <motion.li
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center justify-between border-b border-gray-700 pb-4"
                  >
                    {editSkillId === skill.id ? (
                      <div className="flex gap-4 flex-1 items-center">
                        <input
                          type="text"
                          className="bg-gray-700 px-3 py-2 rounded text-white flex-1 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={editSkillName}
                          onChange={(e) => setEditSkillName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUpdateSkill()}
                        />
                        <select
                          className="bg-gray-700 px-3 py-2 rounded text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={editSkillLevel}
                          onChange={(e) => setEditSkillLevel(parseInt(e.target.value))}
                        >
                          <option value={1}>Beginner</option>
                          <option value={2}>Intermediate</option>
                          <option value={3}>Advanced</option>
                          <option value={4}>Expert</option>
                          <option value={5}>Master</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-medium">{skill.skill_name}</span>
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getLevelColor(skill.level)}`}>
                            {getLevelDisplay(skill.level)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 ml-4">
                      {editSkillId === skill.id ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleUpdateSkill}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
                          >
                            <FaSave /> Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
                          >
                            <FaTimes /> Cancel
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startEdit(skill)}
                            className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-gray-700 transition"
                            title="Edit skill"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-700 transition"
                            title="Delete skill"
                          >
                            <FaTrash />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminSkillsPage;