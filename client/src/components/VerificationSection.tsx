import { useRef } from 'react';
import { useScrollReveal } from '../lib/hooks';
import { ChevronRight } from 'lucide-react';

const VerificationSection = () => {
  const section = useRef<HTMLElement>(null);
  const { revealElements } = useScrollReveal(section);

  return (
    <section id="verification" className="min-h-screen py-16" ref={section}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00FF41] matrix-text-shadow reveal">
          Inside the Verification Process
        </h2>
        <p className="text-lg mb-12 reveal">Understand how Matrix·Truth verifies information across multiple sources to deliver accurate, unbiased results.</p>
        
        <div className="relative bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow mb-12 reveal">
          <h3 className="text-xl font-bold mb-6 text-[#00FF41]">Our Verification Pipeline</h3>
          
          <div className="space-y-12">
            <div className="relative pl-8 pb-8 border-l-2 border-[#00FF41]">
              <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-[#00FF41]"></div>
              <h4 className="text-lg font-bold mb-2 text-white">1. Input Analysis</h4>
              <p className="text-white">Your claim is processed through natural language understanding to identify key concepts, entities, and assertions.</p>
            </div>
            
            <div className="relative pl-8 pb-8 border-l-2 border-[#00FF41]">
              <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-[#00FF41]"></div>
              <h4 className="text-lg font-bold mb-2 text-white">2. Source Retrieval</h4>
              <p className="text-white">Multiple trusted sources are consulted based on your selected categories (academic, news, fact-check, scientific) to gather relevant information.</p>
            </div>
            
            <div className="relative pl-8 pb-8 border-l-2 border-[#00FF41]">
              <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-[#00FF41]"></div>
              <h4 className="text-lg font-bold mb-2 text-white">3. Content Evaluation</h4>
              <p className="text-white">Each source is evaluated for credibility, recency, and relevance to your specific claim.</p>
            </div>
            
            <div className="relative pl-8 pb-8 border-l-2 border-[#00FF41]">
              <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-[#00FF41]"></div>
              <h4 className="text-lg font-bold mb-2 text-white">4. AI Analysis</h4>
              <p className="text-white">Google Gemini 1.5 processes the collected information, comparing claims against verified facts while identifying potential biases.</p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-[#00FF41]"></div>
              <h4 className="text-lg font-bold mb-2 text-white">5. Result Generation</h4>
              <p className="text-white">A comprehensive analysis is produced, including accuracy rating, summary, key points, and bias indicators - all tailored to your Blue Pill comfort settings.</p>
            </div>
          </div>
        </div>
        
        {/* Source Quality Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow reveal">
            <h3 className="text-xl font-bold mb-4 text-[#00FF41]">Source Quality Indicators</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-white">Peer-reviewed academic research</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span className="text-white">Official government or institutional data</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                <span className="text-white">Established news sources with fact-checking</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-white">Specialized industry publications</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                <span className="text-white">Social media or unverified sources</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-white">Sources with known misinformation history</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow reveal">
            <h3 className="text-xl font-bold mb-4 text-[#00FF41]">Bias Detection Methodology</h3>
            <p className="text-white mb-4">Our system analyzes content for these common bias indicators:</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 mr-2 text-[#00FF41]" />
                <span className="text-white">Emotional language and loaded terms</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 mr-2 text-[#00FF41]" />
                <span className="text-white">Selective use of facts and statistics</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 mr-2 text-[#00FF41]" />
                <span className="text-white">Generalization and oversimplification</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 mr-2 text-[#00FF41]" />
                <span className="text-white">Source attribution and authority patterns</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 mr-2 text-[#00FF41]" />
                <span className="text-white">Framing and context manipulation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationSection;
