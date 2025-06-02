import { useRef } from 'react';
import { useScrollReveal, useVerification } from '../lib/hooks';
import { Button } from '@/components/ui/button';
import { DownloadIcon, FileTextIcon, ShareIcon, BarChart2Icon } from 'lucide-react';

const HistorySection = () => {
  const section = useRef<HTMLElement>(null);
  const { revealElements } = useScrollReveal(section);
  const { history, clearHistory } = useVerification();

  // Format relative time
  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <section id="history" className="min-h-screen py-16" ref={section}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00FF41] matrix-text-shadow reveal">
          Your Verification History
        </h2>
        <p className="text-lg mb-8 reveal">Review your recent information verification attempts. All history is stored locally in your browser only.</p>
        
        <div className="mb-8 reveal">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#00FF41]">Recent Verifications</h3>
            <Button 
              className="px-4 py-2 bg-transparent border border-[#00FF41] text-white rounded-lg matrix-box-shadow hover:bg-[#00FF41] hover:bg-opacity-20 transition-all duration-300"
              onClick={clearHistory}
            >
              Clear History
            </Button>
          </div>
          
          {/* Empty State (For new users) */}
          {history.length === 0 ? (
            <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#00FF41] matrix-box-shadow text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-[#00FF41] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h4 className="text-xl font-bold mb-2 text-white">No verification history yet</h4>
              <p className="text-white mb-4">Your verification history will appear here after you use the Red Pill verification tool.</p>
              <a href="#redpill" className="px-6 py-3 bg-transparent border border-[#00FF41] text-white rounded-lg matrix-box-shadow hover:bg-[#00FF41] hover:bg-opacity-20 transition-all duration-300 inline-block">
                Start Verifying
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {/* History Items */}
              {history.map((item, index) => (
                <div key={index} className="bg-[#1A1A1A] p-4 rounded-lg border border-[#00FF41] hover:matrix-box-shadow transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{item.claim}</h4>
                    <span className="px-2 py-1 bg-black rounded-full text-xs">{item.result.accuracy}% Accurate</span>
                  </div>
                  <p className="text-white text-sm mb-2 line-clamp-2">{item.result.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Verified {getRelativeTime(item.timestamp)}</span>
                    <button 
                      className="text-[#00FF41] text-sm hover:underline"
                      onClick={() => document.getElementById('redpill')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Export/Share Options */}
        <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow reveal">
          <h3 className="text-xl font-bold mb-4 text-[#00FF41]">Export Options</h3>
          <p className="text-white mb-4">Save or share your verification results for future reference.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button className="flex items-center justify-center px-4 py-3 bg-transparent border border-[#00FF41] text-white rounded-lg matrix-box-shadow hover:bg-[#00FF41] hover:bg-opacity-20 transition-all duration-300">
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download JSON
            </Button>
            <Button className="flex items-center justify-center px-4 py-3 bg-transparent border border-[#00FF41] text-white rounded-lg matrix-box-shadow hover:bg-[#00FF41] hover:bg-opacity-20 transition-all duration-300">
              <FileTextIcon className="h-5 w-5 mr-2" />
              Export PDF
            </Button>
            <Button className="flex items-center justify-center px-4 py-3 bg-transparent border border-[#00FF41] text-white rounded-lg matrix-box-shadow hover:bg-[#00FF41] hover:bg-opacity-20 transition-all duration-300">
              <ShareIcon className="h-5 w-5 mr-2" />
              Share Results
            </Button>
            <Button className="flex items-center justify-center px-4 py-3 bg-transparent border border-[#00FF41] text-white rounded-lg matrix-box-shadow hover:bg-[#00FF41] hover:bg-opacity-20 transition-all duration-300">
              <BarChart2Icon className="h-5 w-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
