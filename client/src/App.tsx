import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./contexts/ThemeContext";
import MatrixRain from "./components/MatrixRain";
import Navbar from "./components/Navbar";
import IntroSection from "./components/IntroSection";
import RedPillSection from "./components/RedPillSection";
import BluePillSection from "./components/BluePillSection";
import NavigateSection from "./components/NavigateSection";
import VerificationSection from "./components/VerificationSection";
import HistorySection from "./components/HistorySection";
import Footer from "./components/Footer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen overflow-x-hidden dark:bg-black light:bg-gray-50 transition-colors duration-300">
            <MatrixRain />
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-16">
              <IntroSection />
              <RedPillSection />
              <BluePillSection />
              <NavigateSection />
              <VerificationSection />
              <HistorySection />
            </main>
            <Footer />
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
