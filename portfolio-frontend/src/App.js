import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Chatbot from "./components/Chatbot";


// === User Pages ===
import HomePage from "./pages/user/HomePage";
import ContactPage from "./pages/user/ContactPage";
import ProjectPageUser from "./pages/user/ProjectPageUser";
import UserBlogPage from "./pages/user/UserBlogPage";
import UserTestimonialsPage from "./pages/user/UserTestimonialsPage";
import AboutPage from "./pages/user/AboutPage";
import ResumePage from "./pages/user/ResumePage";

// يمكنك لاحقًا إضافة:
// import ProjectsPage from "./pages/user/ProjectsPage";
// import ContactPage from "./pages/user/ContactPage";

// === Admin Pages ===
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminRolesPage from "./pages/admin/AdminRolesPage";
import SettingsPage from "./pages/admin/SettingsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import ProjectPage from "./pages/admin/ProjectPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";
import AdminAboutPage from "./pages/admin/AdminAboutPage";
import AdminGalleryPage from "./pages/admin/AdminGalaryPage";
import AdminTestimonialsPage from "./pages/admin/AdminTestimonialsPage";
import AdminBlogPostsPage from "./pages/admin/AdminBlogPostsPage";
import AdminSkillsPage from "./pages/admin/AdminSkillsPage";
import AdminExperiencePage from "./pages/admin/AdminExperiencePage";
import AdminEducationPage from "./pages/admin/AdminEducationPage";
import AdminCertificationsPage from "./pages/admin/AdminCertificationsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 600, // مدة الحركة (بالميلي ثانية)
      easing: "ease-in-out", // نوع الحركة
      once: true, // هل يتم تشغيل الحركة مرة واحدة فقط؟
      mirror: false, // هل تعيد الحركة عند التمرير للخلف؟
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ User Routes wrapped with Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

<Route
            path="/Chatbot"
            element={
              <Layout>
                <Chatbot />
              </Layout>
            }
          />

          <Route
            path="/contact"
            element={
              <Layout>
                <ContactPage />
              </Layout>
            }
          />

           <Route
            path="/about-us"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />

          <Route
            path="/projects"
            element={
              <Layout>
                <ProjectPageUser />
              </Layout>
            }
          />

          <Route
            path="/blog"
            element={
              <Layout>
                <UserBlogPage />
              </Layout>
            }
          />

          <Route
            path="/testimonials"
            element={
              <Layout>
                <UserTestimonialsPage />
              </Layout>
            }
          />

          <Route
            path="/resumes"
            element={
              <Layout>
                <ResumePage />
              </Layout>
            }
          />
          {/* لاحقًا يمكن إضافة: 
          <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
          */}

          {/* ✅ Admin Routes with protection */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute>
                <AdminRolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <AdminGalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminMessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/about-us"
            element={
              <ProtectedRoute>
                <AdminAboutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <AdminTestimonialsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blog"
            element={
              <ProtectedRoute>
                <AdminBlogPostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <AdminSkillsPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/experiences"
            element={
              <ProtectedRoute>
                <AdminExperiencePage/>
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/educations"
            element={
              <ProtectedRoute>
                <AdminEducationPage/>
              </ProtectedRoute>
            }
          />

            <Route
            path="/admin/certifications"
            element={
              <ProtectedRoute>
                <AdminCertificationsPage/>
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute>
                <AdminAnalyticsPage/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
