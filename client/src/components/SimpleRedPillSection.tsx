import { useState, useRef, FormEvent, useEffect } from 'react';
import { useVerification } from '../lib/hooks';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { SourceInfoType } from '../lib/types';

// Simple source card component
const SourceCard = ({ source }: { source: SourceInfoType }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(source.reliability / 2);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? "text-[#00FF41]" : "text-gray-600"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#00FF41] matrix-box-shadow">
      <h4 className="font-bold text-white mb-1">{source.name}</h4>
      <p className="text-sm text-gray-400 mb-2">{source.description}</p>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-white mr-2">Reliability:</span>
          <span className="text-xs">{renderStars()}</span>
        </div>
        <Button
          size="sm"
          className="text-xs px-2 py-1 bg-transparent border border-[#00FF41] text-white rounded hover:bg-[#00FF41] hover:bg-opacity-20"
        >
          View Results <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const SimpleRedPillSection = () => {
  const { verifyInfo, verificationResult, isVerifying, error } = useVerification();
  const [claim, setClaim] = useState('');
  const [sources, setSources] = useState({
    academic: true,
    news: true,
    factCheck: true,
    scientific: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;

    const selectedSources = Object.entries(sources)
      .filter(([, isSelected]) => isSelected)
      .map(([name]) => name);

    await verifyInfo(claim, selectedSources);
  };

  const handleSourceChange = (key: keyof typeof sources) => {
    setSources(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSourcesByType = () => {
    if (!verificationResult?.sources?.length) return null;
    const grouped: Record<string, SourceInfoType[]> = {};
    verificationResult.sources.forEach(src => {
      grouped[src.type] = grouped[src.type] || [];
      grouped[src.type].push(src);
    });
    return Object.entries(grouped).map(([type, list]) => (
      <div key={type} className="mt-6">
        <h3 className="text-xl font-bold mb-4 text-[#00FF41] matrix-text-​shadow capitalize">
          {type === 'fact-check'
            ? 'Fact-Check Sources'
            : `${type.charAt(0).toUpperCase() + type.slice(1)} Sources`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {list.map((src, i) => (
            <SourceCard key={i} source={src} />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <section id="redpill" className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#FF0000] red-text-shadow">
          Red Pill: Truth Seeker
        </h2>
        <p className="text-lg mb-8">
          Enter any claim or statement to verify against multiple trusted sources. Our AI-powered
          system will analyze and present unbiased results.
        </p>

        {/* Form */}
        <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#FF0000] red-box-shadow mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="claim" className="block mb-2 text-white">
                Enter a claim to verify:
              </label>
              <Textarea
                id="claim"
                rows={3}
                className="w-full px-4 py-2 bg-black text-white border border-[#FF0000] rounded-lg focus:ring-2 focus:ring-[#FF0000]"
                placeholder="e.g., 'Climate change is real'"
                value={claim}
                onChange={e => setClaim(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {Object.entries(sources).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${key}Sources`}
                    checked={checked}
                    onCheckedChange={() => handleSourceChange(key as keyof typeof sources)}
                    className="border-[#FF0000] text-[#FF0000] bg-black data-[state=checked]:bg-[#FF0000] data-[state=checked]:text-white"
                  />
                  <label htmlFor={`${key}Sources`} className="text-white">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isVerifying || !claim.trim()}
              className="px-6 py-3 bg-transparent border border-[#FF0000] text-white rounded-lg red-box-shadow hover:bg-[#FF0000] hover:bg-opacity-20 transition-all duration-300"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'VERIFY NOW'
              )}
            </Button>
          </form>
        </div>

        {/* Results */}
        {verificationResult && (
          <div className="space-y-8">
            {/* Summary - Only show if we have a valid summary */}
            {verificationResult.summary && verificationResult.summary !== "We couldn't generate an AI summary at this time, but here are the relevant sources you can check:" && (
              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#FF0000] red-box-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#FF0000]">AI-Generated Summary</h3>
                  <div className="px-3 py-1 bg-[#1A1A1A] border border-[#FF0000] rounded-md text-white text-sm">
                    Accuracy: {verificationResult.accuracy}%
                  </div>
                </div>
                <p className="text-white mb-4">{verificationResult.summary}</p>
                <h4 className="text-lg font-bold mb-2 text-white">Key Points:</h4>
                <ul className="list-disc list-inside space-y-2 text-white ml-4">
                  {verificationResult.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <h4 className="text-lg font-bold mb-2 text-white">Potential Biases Detected:</h4>
                  <div className="flex flex-wrap gap-2">
                    {verificationResult.biases.map((b, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-black text-white border border-[#FF0000] rounded-full text-sm"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#FF0000] red-box-shadow">
                <p className="text-white">{error}</p>
              </div>
            )}

            {/* Sources - Always show if we have sources */}
            {verificationResult.sources && verificationResult.sources.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#00FF41] matrix-text-shadow">
                  Sources Analyzed
                </h3>
                {renderSourcesByType()}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SimpleRedPillSection;
