const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#00FF41] matrix-box-shadow py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-[#00FF41] matrix-text-shadow mb-2">Matrix·Truth</h2>
            <p className="text-white text-sm">Navigating reality in the digital age</p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <a href="#" className="text-white hover:text-[#00FF41] mb-2 md:mb-0">Privacy Policy</a>
            <a href="#" className="text-white hover:text-[#00FF41] mb-2 md:mb-0">Terms of Use</a>
            <a href="#" className="text-white hover:text-[#00FF41]">Contact</a>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>Matrix·Truth does not track, store, or share your verification history. All data remains in your browser.</p>
          <p className="mt-2">© {new Date().getFullYear()} Matrix·Truth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
