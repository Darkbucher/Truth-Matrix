import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../lib/hooks';

const IntroSection = () => {
  const section = useRef<HTMLElement>(null);
  const { revealElements } = useScrollReveal(section);

  return (
    <section id="intro" className="min-h-screen flex flex-col justify-center items-center" ref={section}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#00FF41] rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#00FF41] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#00FF41] rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <h1 className="relative text-4xl md:text-6xl font-bold mb-4 text-[#00FF41] matrix-text-shadow">
            Matrix·Truth
          </h1>
          <p className="relative text-xl md:text-2xl mb-6 text-white">Unveil reality through the digital veil</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow transform transition-transform hover:scale-105 reveal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 mx-auto text-[#00FF41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-[#00FF41]">Seek Truth</h3>
            <p className="text-white">Verify online claims in real-time with AI-powered analysis of multiple trusted sources.</p>
          </div>
          
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow transform transition-transform hover:scale-105 reveal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 mx-auto text-[#00FF41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-[#00FF41]">Unbiased Analysis</h3>
            <p className="text-white">Get balanced perspectives with bias indicators and reliability scores to form your own conclusions.</p>
          </div>
          
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#00FF41] matrix-box-shadow transform transition-transform hover:scale-105 reveal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 mx-auto text-[#00FF41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-[#00FF41]">Personalized Control</h3>
            <p className="text-white">Adjust your balance between uncomfortable truths and comfortable narratives with the Blue Pill slider.</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-6 reveal">
          <a href="#redpill" className="px-6 py-3 bg-transparent border border-[#FF0000] text-white rounded-lg red-box-shadow hover:bg-[#FF0000] hover:bg-opacity-20 transition-all duration-300">
            Take the Red Pill
          </a>
          <a href="#bluepill" className="px-6 py-3 bg-transparent border border-[#0000FF] text-white rounded-lg blue-box-shadow hover:bg-[#0000FF] hover:bg-opacity-20 transition-all duration-300">
            Take the Blue Pill
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
