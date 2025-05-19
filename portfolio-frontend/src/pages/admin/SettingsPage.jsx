import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { FaSave, FaCogs, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Sidebar from "../../components/Sidebar";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    tagline: '',
    facebook: '',
    linkedin: '',
    twitter: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings');
        setSettings(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load settings.',
          background: '#1f2937',
          color: '#e5e7eb',
          confirmButtonColor: '#ef4444',
        });
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await API.put('/settings', settings);
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Settings updated successfully.',
        background: '#1f2937',
        color: '#e5e7eb',
        confirmButtonColor: '#4f46e5',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save settings.',
        background: '#1f2937',
        color: '#e5e7eb',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 pt-20 sm:pt-10">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <FaCogs className="text-indigo-400 text-3xl animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Site Settings
            </h1>
            <p className="text-gray-400">Customize your website appearance and social links</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-indigo-500 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl shadow-2xl max-w-3xl mx-auto space-y-6 border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputField("Site Name", "site_name", settings.site_name, handleChange, "The name of your website")}
              {renderInputField("Tagline", "tagline", settings.tagline, handleChange, "A short description of your site")}
            </div>
            
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-300">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSocialInput("Facebook", "facebook", settings.facebook, handleChange, <FaFacebook className="text-blue-500" />)}
                {renderSocialInput("Twitter", "twitter", settings.twitter, handleChange, <FaTwitter className="text-blue-400" />)}
                {renderSocialInput("LinkedIn", "linkedin", settings.linkedin, handleChange, <FaLinkedin className="text-blue-600" />)}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all w-full md:w-auto
                  ${isSaving 
                    ? 'bg-indigo-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20'}
                  `}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const renderInputField = (label, name, value, onChange, placeholder = '') => (
  <div className="group">
    <label className="block text-sm mb-1 text-gray-300 group-hover:text-indigo-300 transition-colors">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-700/70 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-gray-700/90"
    />
  </div>
);

const renderSocialInput = (label, name, value, onChange, icon) => (
  <div className="group">
    <label className="block text-sm mb-1 text-gray-300 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      type="url"
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={`https://${label.toLowerCase()}.com/username`}
      className="w-full bg-gray-700/70 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:bg-gray-700/90"
    />
  </div>
);

export default SettingsPage;