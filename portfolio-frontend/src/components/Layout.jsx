import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "./Chatbot"; // 👈 أضف هذا

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans relative">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        {children}
      </main>

      <Footer />

      {/* مساعد الذكاء الاصطناعي */}
      <Chatbot />
    </div>
  );
};

export default Layout;
