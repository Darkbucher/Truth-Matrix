import { useRef } from 'react';
import { useScrollReveal } from '../lib/hooks';
import { Check, AlertTriangle } from 'lucide-react';

const NavigateSection = () => {
  const section = useRef<HTMLElement>(null);
  const { revealElements } = useScrollReveal(section);

  return (
    <section id="navigate" className="min-h-screen py-16" ref={section}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00FF41] matrix-text-shadow reveal">
          Navigate the Information Landscape
        </h2>
        <p className="text-lg mb-12 reveal">Learn to identify reliable sources and recognize common manipulation tactics in the digital information ecosystem.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Best Practices Cards */}
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow reveal">
            <h3 className="text-xl font-bold mb-4 text-[#00FF41]">Best Practices</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-6 w-6 mr-2 flex-shrink-0 text-[#00FF41]" />
                <span>Check multiple reputable sources before forming conclusions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mr-2 flex-shrink-0 text-[#00FF41]" />
                <span>Look for original research and primary sources</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mr-2 flex-shrink-0 text-[#00FF41]" />
                <span>Consider the context and full context of information</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mr-2 flex-shrink-0 text-[#00FF41]" />
                <span>Be aware of your own biases and how they affect your perception</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mr-2 flex-shrink-0 text-[#00FF41]" />
                <span>Verify publication dates and check if information is current</span>
              </li>
            </ul>
          </div>
          
          {/* Warning Signs Cards */}
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#FF0000] red-box-shadow reveal">
            <h3 className="text-xl font-bold mb-4 text-[#FF0000]">Warning Signs</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0 text-[#FF0000]" />
                <span>Extreme emotional language designed to provoke reaction</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0 text-[#FF0000]" />
                <span>Claims that seem too good or too bad to be true</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0 text-[#FF0000]" />
                <span>Information without clear sources or citations</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0 text-[#FF0000]" />
                <span>Pressure to share quickly without verification</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-6 w-6 mr-2 flex-shrink-0 text-[#FF0000]" />
                <span>Cherry-picked statistics without proper context</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Knowledge Graph Visualization */}
        <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow reveal">
          <h3 className="text-xl font-bold mb-4 text-[#00FF41]">Information Knowledge Graph</h3>
          <p className="mb-4 text-white">This interactive visualization maps the relationships between different information sources and common topics.</p>
          
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-black rounded-lg overflow-hidden border border-[#00FF41] p-4" id="knowledgeGraphContainer">
            {/* SVG Knowledge Graph */}
            <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
              {/* Central Node */}
              <circle cx="400" cy="300" r="20" fill="#1A1A1A" stroke="#00FF41" strokeWidth="2" className="animate-pulse" />
              <text x="400" y="300" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="12">Truth</text>
              
              {/* Academic Sources Node */}
              <circle cx="250" cy="200" r="15" fill="#1A1A1A" stroke="#00FF41" strokeWidth="2" />
              <text x="250" y="200" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="10">Academic</text>
              <line x1="400" y1="300" x2="250" y2="200" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.6" />
              
              {/* News Sources Node */}
              <circle cx="550" cy="200" r="15" fill="#1A1A1A" stroke="#00FF41" strokeWidth="2" />
              <text x="550" y="200" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="10">News</text>
              <line x1="400" y1="300" x2="550" y2="200" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.6" />
              
              {/* Fact Check Node */}
              <circle cx="250" cy="400" r="15" fill="#1A1A1A" stroke="#00FF41" strokeWidth="2" />
              <text x="250" y="400" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="10">Fact Check</text>
              <line x1="400" y1="300" x2="250" y2="400" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.6" />
              
              {/* Scientific Node */}
              <circle cx="550" cy="400" r="15" fill="#1A1A1A" stroke="#00FF41" strokeWidth="2" />
              <text x="550" y="400" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="10">Scientific</text>
              <line x1="400" y1="300" x2="550" y2="400" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.6" />
              
              {/* Secondary Nodes */}
              <circle cx="150" cy="150" r="10" fill="#1A1A1A" stroke="#00FF41" strokeWidth="1" />
              <text x="150" y="150" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="8">Research</text>
              <line x1="250" y1="200" x2="150" y2="150" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.4" />
              
              <circle cx="650" cy="150" r="10" fill="#1A1A1A" stroke="#00FF41" strokeWidth="1" />
              <text x="650" y="150" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="8">Media</text>
              <line x1="550" y1="200" x2="650" y2="150" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.4" />
              
              <circle cx="150" cy="450" r="10" fill="#1A1A1A" stroke="#00FF41" strokeWidth="1" />
              <text x="150" y="450" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="8">Verification</text>
              <line x1="250" y1="400" x2="150" y2="450" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.4" />
              
              <circle cx="650" cy="450" r="10" fill="#1A1A1A" stroke="#00FF41" strokeWidth="1" />
              <text x="650" y="450" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="8">Data</text>
              <line x1="550" y1="400" x2="650" y2="450" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.4" />
              
              {/* Tertiary Connections */}
              <line x1="150" y1="150" x2="150" y2="450" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="5,5" />
              <line x1="650" y1="150" x2="650" y2="450" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="5,5" />
              <line x1="150" y1="150" x2="650" y2="150" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="5,5" />
              <line x1="150" y1="450" x2="650" y2="450" stroke="#00FF41" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="5,5" />
            </svg>
            
            <div className="absolute bottom-2 right-2 text-xs text-white opacity-70">Interactive visualization - click nodes to explore</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavigateSection;
