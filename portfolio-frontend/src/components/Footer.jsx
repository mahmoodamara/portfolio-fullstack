const Footer = () => {
    return (
      <footer className="bg-gray-800 text-gray-400 text-center py-6 mt-8 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} All rights reserved. Mahmood Amara
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-gray-500 text-xl">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="mailto:youremail@example.com"
              className="hover:text-white transition"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  