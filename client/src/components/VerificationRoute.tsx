import { useEffect } from "react";
import { useRoute } from "wouter";
import { useVerificationContext } from "../contexts/VerificationContext";
import RedPillSection from "./RedPillSection";
import { Loader2 } from "lucide-react";

export default function VerificationRoute() {
  const [match, params] = useRoute("/verify/:id");
  const { loadVerification, isVerifying, error, verificationResult } = useVerificationContext();

  useEffect(() => {
    if (match && params?.id) {
      // If we don't already have this result in context, load it
      // Alternatively, we just load it anyway to ensure it matches the URL
      loadVerification(params.id);
    }
  }, [match, params?.id, loadVerification]);

  if (!match) return null;

  if (isVerifying && !verificationResult) {
    return (
      <section className="min-h-screen flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4 dark:text-white text-gray-800">
          <Loader2 className="h-8 w-8 animate-spin dark:text-[#FF3333] text-red-500" />
          <p>Decrypting truth matrix...</p>
        </div>
      </section>
    );
  }

  if (error && !verificationResult) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center py-16">
        <div className="max-w-md w-full p-6 text-center rounded-xl border dark:border-[#FF3333] border-red-400 dark:bg-black/80 bg-white/95">
          <h2 className="text-2xl font-bold dark:text-[#FF3333] text-red-600 mb-4">Result Not Found</h2>
          <p className="dark:text-gray-300 text-gray-700 mb-6">{error}</p>
          <a href="/" className="inline-flex px-4 py-2 rounded-lg border dark:border-[#FF3333] border-red-500 dark:text-white text-gray-800 dark:hover:bg-[#FF3333]/20 hover:bg-red-50">
            Return Home
          </a>
        </div>
      </section>
    );
  }

  return <RedPillSection />;
}
