import { useState, useEffect, useRef, useCallback } from 'react';
import { VerificationResultType, ComfortSettingsType, HistoryItemType } from './types';

// Simple ScrollReveal hook without context dependencies
export const useScrollReveal = (sectionRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const revealElements = section.querySelectorAll('.reveal');
    
    const checkReveal = () => {
      for (let i = 0; i < revealElements.length; i++) {
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          revealElements[i].classList.add('visible');
        }
      }
    };
    
    window.addEventListener('scroll', checkReveal);
    
    // Initial check
    checkReveal();
    
    return () => {
      window.removeEventListener('scroll', checkReveal);
    };
  }, [sectionRef]);

  return { revealElements: [] };
};

// Verification hook with API call
export const useVerification = () => {
  const [verificationResult, setVerificationResult] = useState<VerificationResultType | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comfortSettings, setComfortSettings] = useState<ComfortSettingsType>({
    comfortLevel: 50,
    challengingOpinions: true,
    controversialTopics: true,
    biasIndicators: true,
    sourceDiversity: true
  });
  const [history, setHistory] = useState<HistoryItemType[]>([]);

  const verifyInfo = useCallback(async (claim: string, sources: string[]) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      console.log('Making verification request with:', { claim, sources, comfortSettings });
      
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim,
          sources,
          comfortSettings
        }),
      });
      
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Verification result:', result);
      
      // Always set the result if we have sources
      if (result && typeof result === 'object' && 'sources' in result) {
        setVerificationResult(result as VerificationResultType);
        
        const historyItem: HistoryItemType = {
          claim,
          result: result as VerificationResultType,
          timestamp: Date.now()
        };
        
        setHistory(prev => [historyItem, ...prev]);
        return result;
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Verification failed:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsVerifying(false);
    }
  }, [comfortSettings]);

  const updateComfortSettings = useCallback((settings: ComfortSettingsType) => {
    setComfortSettings(settings);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    verifyInfo,
    verificationResult,
    isVerifying,
    error,
    comfortSettings,
    updateComfortSettings,
    history,
    clearHistory
  };
};
