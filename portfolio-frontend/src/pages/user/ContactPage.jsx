import React, { useEffect, useState, useRef } from "react";
import { FaPaperPlane, FaUserCircle, FaUserTie, FaEnvelope, FaComments, FaArrowLeft } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import API from "../../api/axios";
import Swal from "sweetalert2";

// Analytics utility functions
const analytics = {
  // Simple page view tracking that matches the existing analytics table structure
  trackPageView: async (pageName) => {
    try {
      // Send to analytics endpoint (fire and forget)
      API.post('/analytics', {
        page_name: pageName
      }).catch(err => {
        console.warn('Analytics tracking failed:', err);
      });
    } catch (error) {
      console.warn('Analytics error:', error);
    }
  }
};

// Custom hook for analytics tracking (simplified)
const useContactAnalytics = () => {
  // Track page entry
  useEffect(() => {
    analytics.trackPageView('contact_page');
  }, []);

  return {
    trackStepChange: (fromStep, toStep) => {
      console.log('📊 Contact step change:', fromStep, '→', toStep);
    },
    
    trackContactMethodChosen: (method) => {
      console.log('📊 Contact method chosen:', method);
    },

    trackMessageSent: (method, messageLength) => {
      console.log('📊 Message sent:', method, 'Length:', messageLength);
    },

    trackFormSubmission: (formType, success) => {
      console.log('📊 Form submission:', formType, 'Success:', success);
    },

    trackChatLoaded: (messageCount) => {
      console.log('📊 Chat loaded:', messageCount, 'messages');
    }
  };
};

const ContactPage = () => {
  // Email state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState("enterEmail"); // "enterEmail", "chat", or "form"
  
  // Chat states
  const [chat, setChat] = useState([]);      // { from, text, time, is_read }[]
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Contact form states
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: ""
  });
  const [formSending, setFormSending] = useState(false);

  // Analytics
  const { trackStepChange, trackContactMethodChosen, trackMessageSent, trackFormSubmission, trackChatLoaded } = useContactAnalytics();

  // Scroll to bottom when a new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // After entering email, fetch messages and replies
  const loadChat = async () => {
    trackContactMethodChosen('live_chat');
    
    try {
      const res = await API.get(`/messages/user?email=${encodeURIComponent(email)}`);
      const messages = res.data;
      
      const convo = messages.flatMap((m) => {
        const userMsg = {
          from: "user",
          text: m.message,
          time: m.created_at,
          is_read: m.is_read
        };
        
        if (m.admin_reply) {
          return [
            userMsg,
            { 
              from: "admin", 
              text: m.admin_reply, 
              time: m.updated_at || m.created_at,
              is_read: true
            },
          ];
        }
        return [userMsg];
      });
      
      setChat(convo);
      trackChatLoaded(convo.length);
      trackStepChange("chooseContactMethod", "chat");
      setStep("chat");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to load your messages.",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1"
      });
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return Swal.fire({
        title: "Error",
        text: "Please enter your email.",
        icon: "warning",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1"
      });
    }
    // Show contact method options after entering email
    trackStepChange("enterEmail", "chooseContactMethod");
    setStep("chooseContactMethod");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);

    const now = new Date().toISOString();
    const messageText = input;
    setChat((prev) => [...prev, { from: "user", text: messageText, time: now, is_read: false }]);
    setInput("");

    try {
      await API.post("/messages", {
        name: name || "Visitor",
        email,
        message: messageText,
      });
      
      trackMessageSent('chat', messageText.length);
      
      // Reload conversation to see any updates
      setTimeout(loadChat, 1000);
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to send message.",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1"
      });
      // Revert message addition if sending fails
      setChat(prev => prev.slice(0, -1));
      trackMessageSent('chat_failed', messageText.length);
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSending(true);
    
    try {
      await API.post("/messages", {
        name: formData.name,
        email,
        // Can include subject as part of the message
        message: `[${formData.subject}] ${formData.message}`
      });
      
      trackFormSubmission('contact_form', true);
      trackMessageSent('form', formData.message.length);
      
      Swal.fire({
        title: "Sent",
        text: "Your inquiry has been sent successfully. We'll get back to you soon.",
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1"
      });
      setFormData({ name: "", subject: "", message: "" });
      trackStepChange("form", "chooseContactMethod");
      setStep("chooseContactMethod");
    } catch (error) {
      trackFormSubmission('contact_form', false);
      Swal.fire({
        title: "Error",
        text: "Failed to send inquiry, please try again later.",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setFormSending(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChooseForm = () => {
    trackContactMethodChosen('contact_form');
    trackStepChange("chooseContactMethod", "form");
    setStep("form");
  };

  const handleBackToEmailEntry = () => {
    trackStepChange("chooseContactMethod", "enterEmail");
    setStep("enterEmail");
  };

  const handleBackToChooseMethod = () => {
    const currentStep = step;
    trackStepChange(currentStep, "chooseContactMethod");
    setStep("chooseContactMethod");
  };

  // Email entry interface
  if (step === "enterEmail") {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-indigo-600 p-6 text-center">
            <RiCustomerService2Fill className="text-4xl mx-auto text-white mb-3" />
            <h2 className="text-2xl font-bold">Contact Support</h2>
            <p className="text-indigo-100 mt-1">We're here to help you</p>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="p-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Choose contact method interface
  if (step === "chooseContactMethod") {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-indigo-600 p-6 text-center">
            <h2 className="text-2xl font-bold">How would you like to contact us?</h2>
            <p className="text-indigo-100 mt-1">Choose your preferred method</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={loadChat}
                className="group bg-gray-700 hover:bg-indigo-600 p-6 rounded-xl flex flex-col items-center transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-indigo-600 group-hover:bg-indigo-700 p-4 rounded-full mb-4 transition">
                  <FaComments className="text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">Live Chat</h3>
                <p className="text-sm text-gray-300 text-center">
                  Connect with our support team for instant answers
                </p>
                <div className="mt-3 text-xs text-indigo-400 group-hover:text-indigo-300">
                  Start Chatting →
                </div>
              </button>
              
              <button
                onClick={handleChooseForm}
                className="group bg-gray-700 hover:bg-purple-600 p-6 rounded-xl flex flex-col items-center transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-purple-600 group-hover:bg-purple-700 p-4 rounded-full mb-4 transition">
                  <FaEnvelope className="text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">Contact Form</h3>
                <p className="text-sm text-gray-300 text-center">
                  Send your inquiry and we'll respond via email
                </p>
                <div className="mt-3 text-xs text-purple-400 group-hover:text-purple-300">
                  Fill Form →
                </div>
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700 flex items-center justify-between">
              <div className="text-gray-400">
                Logged in as: <span className="font-medium text-gray-200">{name}</span> (<span className="font-mono text-gray-300">{email}</span>)
              </div>
              <button
                onClick={handleBackToEmailEntry}
                className="text-sm text-gray-400 hover:text-gray-300 flex items-center"
              >
                <FaArrowLeft className="mr-1" /> Change Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contact form interface
  if (step === "form") {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-indigo-600 p-6 text-center">
            <h2 className="text-2xl font-bold">Contact Form</h2>
            <p className="text-indigo-100 mt-1">Send us your inquiry</p>
          </div>
          
          <form onSubmit={handleFormSubmit} className="p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="form-name" className="block text-sm font-medium mb-1 text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="form-name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-300">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  required
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  rows="6"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBackToChooseMethod}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <button
                type="submit"
                disabled={formSending}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 transition flex items-center"
              >
                {formSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" /> Send Message
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700 text-sm text-gray-400">
              <p>Logged in as: <span className="font-medium text-gray-200">{name}</span> (<span className="font-mono text-gray-300">{email}</span>)</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 py-5 px-6 shadow-lg flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBackToChooseMethod}
            className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700 transition"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <RiCustomerService2Fill className="mr-2 text-indigo-400" />
              Support Chat
            </h1>
            <p className="text-xs text-gray-400">
              Logged in as: <span className="font-medium text-gray-300">{name}</span>
            </p>
          </div>
        </div>
        <div className="text-sm bg-gray-700 px-3 py-1 rounded-full text-gray-300">
          {email}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-auto p-6 space-y-4 bg-gray-900/50">
        {chat.length > 0 ? (
          chat.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  m.from === "user"
                    ? m.is_read 
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-indigo-700 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-200 rounded-bl-none"
                } shadow-md`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {m.from === "user" ? (
                    <FaUserCircle className="text-lg text-indigo-300" />
                  ) : (
                    <FaUserTie className="text-lg text-gray-400" />
                  )}
                  <span className="text-sm font-medium">
                    {m.from === "user" ? "You" : "Support Agent"}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(m.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{m.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <RiCustomerService2Fill className="text-5xl text-indigo-500 mb-4 opacity-70" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No messages yet</h3>
            <p className="text-gray-400 max-w-md">
              Start the conversation with our support team. We're here to help you with any questions or issues you may have.
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className={`p-3 rounded-full ${sending || !input.trim() ? 'bg-gray-600 text-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} transition`}
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Our support team typically responds within 1-2 business hours
        </p>
      </form>
    </div>
  );
};

export default ContactPage;