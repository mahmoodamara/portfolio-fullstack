import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api/axios';
import { showSuccessAlert, showErrorAlert } from '../../utils/swal';
import { FaLock, FaUserShield, FaRocket } from 'react-icons/fa';
import { MdEmail, MdLockOutline, MdStars } from 'react-icons/md';
import { RiShieldKeyholeFill } from 'react-icons/ri';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // تأثير الجسيمات المتحركة
  useEffect(() => {
    const particles = [];
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6'];
    
    class Particle {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.6 + 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > window.innerWidth || this.x < 0) this.speedX *= -1;
        if (this.y > window.innerHeight || this.y < 0) this.speedY *= -1;
      }
      
      draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(canvas);
    };
  }, []);
const handleLogin = async (e) => {
  e.preventDefault();

  // Validate required fields
  if (!email || !password) {
    showErrorAlert('Input Error', 'Email and password are required');
    return;
  }

  setIsLoading(true);

  try {
    const res = await API.post('/auth/login', { 
      email: email.trim(), 
      password: password.trim() 
    });

    login(res.data);
    showSuccessAlert('Welcome back!', 'You have successfully logged in ✅');
    navigate('/admin/dashboard');
  } catch (err) {
    const errorMessage = err.response?.data?.message ||
                         err.message ||
                         'An error occurred during login';
    showErrorAlert('Login Failed', errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* تأثيرات الضوء */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 bg-indigo-500/10 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-purple-600/10 rounded-full filter blur-[100px] animate-pulse delay-1000"></div>
      </div>
      
      {/* النجوم */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.8 + 0.2,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      <div className="z-10 w-full max-w-md bg-gray-800/70 backdrop-blur-lg border border-gray-600/30 p-8 rounded-2xl shadow-2xl transform transition-all hover:shadow-indigo-500/20 hover:border-indigo-500/50">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative mb-4">
            <RiShieldKeyholeFill className="text-6xl text-indigo-500 animate-pulse" />
            <MdStars className="absolute -top-2 -right-2 text-yellow-400 text-xl animate-spin" />
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">
            Secure Portal
          </h2>
          <p className="text-gray-400 text-sm">Elevated Access Control System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center bg-gray-700/80 border border-gray-600/50 rounded-lg transition duration-300 group-hover:border-indigo-400/50">
              <MdEmail className="ml-3 text-gray-400 group-hover:text-indigo-400 transition duration-300" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center bg-gray-700/80 border border-gray-600/50 rounded-lg transition duration-300 group-hover:border-indigo-400/50">
              <MdLockOutline className="ml-3 text-gray-400 group-hover:text-indigo-400 transition duration-300" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
                placeholder="Secret Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center gap-2
              ${isLoading 
                ? 'bg-indigo-800 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 transform hover:scale-[1.02]'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                <FaLock className="text-white" /> 
                <span className="text-white">Unlock Dashboard</span>
                <FaRocket className="ml-2 text-indigo-200 animate-bounce" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 tracking-widest uppercase">Advanced Security Protocol v3.2</p>
          <div className="mt-2 flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;