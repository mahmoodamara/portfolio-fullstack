import { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaSearch, FaCalendarAlt, FaUser, FaTags } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const UserBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [loading, setLoading] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await API.get("/blog");
        setPosts(res.data);
      } catch (err) {
        console.error("Error loading posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const allTags = ["all", ...new Set(posts.flatMap(post =>
    post.tags ? post.tags.split(",").map(tag => tag.trim()) : []
  ))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" ||
      (post.tags && post.tags.split(",").map(t => t.trim()).includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const toggleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="min-h-screen text-white bg-transparent p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-indigo-400">
            📰 Our Blog
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover the latest articles and exciting ideas
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-4 rounded-2xl shadow-sm border border-gray-700 bg-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaTags className="text-indigo-400" />
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-transparent border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag} className="text-black">
                    {tag === "all" ? "All Categories" : tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-5xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No articles found</h3>
            <p className="text-gray-400">Try changing your search or category</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-transparent rounded-2xl overflow-hidden shadow-md border border-gray-700 hover:border-indigo-300 transition-all"
                >
                  {post.cover_image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://source.unsplash.com/random/800x400/?technology,design";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
                      {post.tags && (
                        <div className="absolute top-3 right-3 flex flex-wrap gap-2">
                          {post.tags.split(",").slice(0, 2).map((tag, index) => (
                            <span 
                              key={index} 
                              className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 
                      className="text-xl font-bold text-white mb-3 cursor-pointer hover:text-indigo-400 transition-colors"
                      onClick={() => toggleExpandPost(post.id)}
                    >
                      {post.title}
                    </h3>
                    
                    <AnimatePresence>
                      {expandedPost === post.id ? (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-gray-300 mb-4 overflow-hidden"
                        >
                          {post.content}
                        </motion.p>
                      ) : (
                        <motion.p
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-gray-400 text-sm line-clamp-3 mb-4"
                        >
                          {post.content}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-700 pt-3">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-indigo-400" />
                        <span>{post.author || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-400" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {/* Floating Action Button */}
        {filteredPosts.length > 0 && (
          <motion.button
            className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg z-10 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default UserBlogPage;
