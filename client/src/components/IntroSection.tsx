import { useRef } from "react";
import { useScrollReveal } from "../lib/hooks";

const FEATURES = [
  {
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
    title: "AI-Powered Analysis",
    desc: "Google Gemini cross-references your claim against curated source categories and returns a calibrated accuracy score — not just a summary.",
  },
  {
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
    title: "Transparent Reasoning",
    desc: "Every verdict comes with key findings, epistemic limitations, and direct source links — so you can verify the verification.",
  },
  {
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    title: "Persistent History",
    desc: "All verifications are stored locally in your browser and exportable as JSON. Your data never leaves your device.",
  },
];

const IntroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="intro"
      className="min-h-screen flex flex-col justify-center items-center py-16"
      ref={sectionRef}
    >
      <div className="max-w-4xl mx-auto text-center px-4">

        {/* Logo / Hero */}
        <div className="relative mb-14">
          {/* Pulsing rings */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-72 h-72 rounded-full border dark:border-[#00FF41]/20 border-emerald-400/20 animate-pulse"
          />
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-52 h-52 rounded-full border dark:border-[#00FF41]/35 border-emerald-400/35 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-32 h-32 rounded-full border dark:border-[#00FF41]/55 border-emerald-400/55 animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <h1 className="relative text-5xl md:text-7xl font-bold mb-4 dark:text-[#00FF41] text-emerald-700 matrix-text-shadow tracking-tight">
            Matrix·Truth
          </h1>
          <p className="relative text-lg md:text-xl dark:text-gray-300 text-gray-600 max-w-xl mx-auto">
            AI-powered claim verification · Calibrated confidence · Transparent sources
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border p-6 text-left
                         transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 reveal
                         dark:bg-[#0d0d0d]/90 bg-white/90
                         dark:border-[#00FF41]/50 border-emerald-400/60
                         dark:hover:border-[#00FF41] hover:border-emerald-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mb-4 dark:text-[#00FF41] text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                {icon}
              </svg>
              <h3 className="text-base font-bold mb-2 dark:text-white text-gray-900">
                {title}
              </h3>
              <p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 reveal">
          <a
            href="#redpill"
            className="px-8 py-3 rounded-lg border font-semibold tracking-wide
                       transition-all duration-300 hover:scale-[1.04] active:scale-95
                       dark:border-[#FF3333] border-red-500
                       dark:text-white text-gray-900
                       dark:hover:bg-[#FF3333]/15 hover:bg-red-50"
          >
            Verify a Claim →
          </a>
          <a
            href="#history"
            className="px-8 py-3 rounded-lg border font-semibold tracking-wide
                       transition-all duration-300 hover:scale-[1.04] active:scale-95
                       dark:border-[#00FF41]/60 border-emerald-400
                       dark:text-white text-gray-800
                       dark:hover:bg-[#00FF41]/10 hover:bg-emerald-50"
          >
            View History
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
