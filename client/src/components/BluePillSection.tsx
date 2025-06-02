import { useRef, useState, useEffect } from 'react';
import { useScrollReveal, useVerification } from '../lib/hooks';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const BluePillSection = () => {
  const section = useRef<HTMLElement>(null);
  const { revealElements } = useScrollReveal(section);
  const { comfortSettings, updateComfortSettings } = useVerification();
  
  const [comfort, setComfort] = useState(50);
  const [preferences, setPreferences] = useState({
    challengingOpinions: true,
    controversialTopics: true,
    biasIndicators: true,
    sourceDiversity: true
  });

  useEffect(() => {
    // Update global comfort settings when local state changes
    updateComfortSettings({
      comfortLevel: comfort,
      ...preferences
    });
  }, [comfort, preferences, updateComfortSettings]);

  const handlePreferenceChange = (preference: keyof typeof preferences) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        [preference]: !prev[preference]
      };
      return updated;
    });
  };

  return (
    <section id="bluepill" className="min-h-screen py-16" ref={section}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-[#0000FF] light:text-blue-600 blue-text-shadow reveal animate-glitch">
          Blue Pill: Comfort Zone
        </h2>
        <p className="text-lg mb-8 reveal dark:text-white light:text-gray-800">
          Adjust how much challenging information you receive. The Matrix can be customized to match your comfort level with potentially unsettling truths.
        </p>
        
        <div className="matrix-card dark:bg-black/80 light:bg-white/95 p-6 rounded-lg 
                          dark:border-[#0000FF] light:border-blue-500 blue-box-shadow mb-8 reveal
                          backdrop-blur-sm">
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-6 dark:text-white light:text-gray-800">Truth vs. Comfort Balance</h3>
            <div className="flex items-center space-x-4">
              <span className="dark:text-[#FF0000] light:text-red-600 font-medium">Truth</span>
              <div className="relative mx-4 flex-1">
                <Slider 
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  value={[comfort]}
                  onValueChange={(values) => setComfort(values[0])}
                  className="w-full h-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg"
                />
                <div className="mt-5 flex justify-between">
                  <div className="text-xs dark:text-white/80 light:text-gray-700">0%</div>
                  <div className="text-xs dark:text-white/80 light:text-gray-700">25%</div>
                  <div className="text-xs dark:text-white/80 light:text-gray-700">50%</div>
                  <div className="text-xs dark:text-white/80 light:text-gray-700">75%</div>
                  <div className="text-xs dark:text-white/80 light:text-gray-700">100%</div>
                </div>
              </div>
              <span className="dark:text-[#0000FF] light:text-blue-600 font-medium">Comfort</span>
            </div>
            
            <div className="mt-8 border-t dark:border-blue-900/30 light:border-blue-200 pt-4">
              <div className="px-4 py-2 dark:bg-black/40 light:bg-blue-50 rounded-md">
                <p className="text-sm dark:text-blue-300 light:text-blue-700 font-medium">
                  Current Setting: {comfort}% - 
                  {comfort < 25 ? " Maximum Truth" : 
                   comfort < 50 ? " Truth Priority" : 
                   comfort < 75 ? " Balanced" : 
                   " Comfort Priority"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4 dark:text-white light:text-gray-800">Content Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 transition-transform hover:scale-105">
                <Checkbox 
                  id="challengingOpinions" 
                  className="w-5 h-5 dark:border-[#0000FF] light:border-blue-500 
                            dark:text-[#0000FF] light:text-blue-500 
                            dark:bg-black light:bg-white 
                            dark:data-[state=checked]:bg-[#0000FF] light:data-[state=checked]:bg-blue-500 
                            dark:data-[state=checked]:text-white light:data-[state=checked]:text-white"
                  checked={preferences.challengingOpinions}
                  onCheckedChange={() => handlePreferenceChange('challengingOpinions')}
                />
                <label htmlFor="challengingOpinions" className="dark:text-white light:text-gray-800 font-medium">
                  Include challenging opinions
                </label>
              </div>
              <div className="flex items-center space-x-3 transition-transform hover:scale-105">
                <Checkbox 
                  id="controversialTopics" 
                  className="w-5 h-5 dark:border-[#0000FF] light:border-blue-500 
                            dark:text-[#0000FF] light:text-blue-500 
                            dark:bg-black light:bg-white 
                            dark:data-[state=checked]:bg-[#0000FF] light:data-[state=checked]:bg-blue-500 
                            dark:data-[state=checked]:text-white light:data-[state=checked]:text-white"
                  checked={preferences.controversialTopics}
                  onCheckedChange={() => handlePreferenceChange('controversialTopics')}
                />
                <label htmlFor="controversialTopics" className="dark:text-white light:text-gray-800 font-medium">
                  Show controversial topics
                </label>
              </div>
              <div className="flex items-center space-x-3 transition-transform hover:scale-105">
                <Checkbox 
                  id="biasIndicators" 
                  className="w-5 h-5 dark:border-[#0000FF] light:border-blue-500 
                            dark:text-[#0000FF] light:text-blue-500 
                            dark:bg-black light:bg-white 
                            dark:data-[state=checked]:bg-[#0000FF] light:data-[state=checked]:bg-blue-500 
                            dark:data-[state=checked]:text-white light:data-[state=checked]:text-white"
                  checked={preferences.biasIndicators}
                  onCheckedChange={() => handlePreferenceChange('biasIndicators')}
                />
                <label htmlFor="biasIndicators" className="dark:text-white light:text-gray-800 font-medium">
                  Display bias indicators
                </label>
              </div>
              <div className="flex items-center space-x-3 transition-transform hover:scale-105">
                <Checkbox 
                  id="sourceDiversity" 
                  className="w-5 h-5 dark:border-[#0000FF] light:border-blue-500 
                            dark:text-[#0000FF] light:text-blue-500 
                            dark:bg-black light:bg-white 
                            dark:data-[state=checked]:bg-[#0000FF] light:data-[state=checked]:bg-blue-500 
                            dark:data-[state=checked]:text-white light:data-[state=checked]:text-white"
                  checked={preferences.sourceDiversity}
                  onCheckedChange={() => handlePreferenceChange('sourceDiversity')}
                />
                <label htmlFor="sourceDiversity" className="dark:text-white light:text-gray-800 font-medium">
                  Maximize source diversity
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 dark:text-white light:text-gray-800 flex items-center">
              <span className="dark:text-blue-400 light:text-blue-500 mr-2">ℹ️</span>
              Your Current Settings
            </h3>
            <div className="dark:bg-black/60 light:bg-blue-50/80 p-5 rounded-lg 
                           dark:border dark:border-[#0000FF] light:border-blue-200">
              <p className="dark:text-white light:text-gray-800 mb-3 font-medium">With your current settings, you will receive:</p>
              <ul className="grid gap-2 dark:text-white/90 light:text-gray-700">
                {comfort < 25 && (
                  <li className="flex items-center">
                    <span className="dark:text-red-500 light:text-red-600 mr-2">⚡</span>
                    Raw factual information with minimal filtering
                  </li>
                )}
                {comfort >= 25 && comfort < 50 && (
                  <li className="flex items-center">
                    <span className="dark:text-orange-500 light:text-orange-600 mr-2">⚖️</span>
                    Balanced perspectives that prioritize factual accuracy
                  </li>
                )}
                {comfort >= 50 && comfort < 75 && (
                  <li className="flex items-center">
                    <span className="dark:text-yellow-400 light:text-yellow-600 mr-2">🛡️</span>
                    Gentler presentation of challenging information
                  </li>
                )}
                {comfort >= 75 && (
                  <li className="flex items-center">
                    <span className="dark:text-blue-400 light:text-blue-600 mr-2">☁️</span>
                    Maximum comfort with potentially filtered challenging content
                  </li>
                )}
                
                {preferences.sourceDiversity && (
                  <li className="flex items-center">
                    <span className="dark:text-green-400 light:text-green-600 mr-2">🔍</span>
                    Information from a diverse range of sources
                  </li>
                )}
                {preferences.challengingOpinions && (
                  <li className="flex items-center">
                    <span className="dark:text-purple-400 light:text-purple-600 mr-2">💡</span>
                    Content that may challenge your existing beliefs
                  </li>
                )}
                {preferences.biasIndicators && (
                  <li className="flex items-center">
                    <span className="dark:text-cyan-400 light:text-cyan-600 mr-2">⚠️</span>
                    Clear indications of potential bias in presented information
                  </li>
                )}
                {preferences.controversialTopics && (
                  <li className="flex items-center">
                    <span className="dark:text-pink-400 light:text-pink-600 mr-2">🔄</span>
                    Exposure to controversial perspectives when relevant
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BluePillSection;
