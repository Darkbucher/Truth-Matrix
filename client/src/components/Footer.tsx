const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t dark:border-[#00FF41]/30 border-emerald-300/60
                 dark:bg-black/90 bg-white/90 py-10"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

          {/* Brand */}
          <div className="max-w-xs">
            <h2 className="text-lg font-bold dark:text-[#00FF41] text-emerald-700 matrix-text-shadow mb-2">
              Matrix·Truth
            </h2>
            <p className="text-sm dark:text-gray-400 text-gray-500 leading-relaxed">
              AI-powered claim verification using Google Gemini. All analysis
              runs on calibrated, source-backed reasoning — not opinion.
            </p>
          </div>

          {/* How it works */}
          <div>
            <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 mb-3 uppercase tracking-wider">
              How It Works
            </h3>
            <ol className="space-y-1.5 text-sm dark:text-gray-400 text-gray-500 list-decimal list-inside">
              <li>You submit a claim and select source categories</li>
              <li>Gemini analyzes it against those source types</li>
              <li>A calibrated verdict + accuracy score is returned</li>
              <li>Source links let you verify independently</li>
            </ol>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold dark:text-gray-300 text-gray-700 mb-3 uppercase tracking-wider">
              Project
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="https://github.com/Darkbucher/Truth-Matrix"
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-gray-400 text-gray-500
                           dark:hover:text-[#00FF41] hover:text-emerald-700
                           transition-colors duration-200"
              >
                GitHub Repository ↗
              </a>
              <a
                href="https://truth-matrix.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-gray-400 text-gray-500
                           dark:hover:text-[#00FF41] hover:text-emerald-700
                           transition-colors duration-200"
              >
                Live Demo ↗
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-5 border-t dark:border-gray-800 border-gray-200
                     flex flex-col sm:flex-row justify-between items-center gap-2
                     text-xs dark:text-gray-500 text-gray-400"
        >
          <p>
            Verification history is stored only in your browser.
            No data is sent to any third party beyond the AI inference call.
          </p>
          <p className="shrink-0">
            © {year} Matrix·Truth — MIT License
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
