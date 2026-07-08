import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VerificationProvider } from "./contexts/VerificationContext";
import ErrorBoundary from "./components/ErrorBoundary";
import MatrixRain from "./components/MatrixRain";
import Navbar from "./components/Navbar";
import IntroSection from "./components/IntroSection";
import RedPillSection from "./components/RedPillSection";
import HistorySection from "./components/HistorySection";
import Footer from "./components/Footer";
import VerificationRoute from "./components/VerificationRoute";
import { Route, Switch } from "wouter";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <VerificationProvider>
          <TooltipProvider>
            <ErrorBoundary>
              <div className="min-h-screen overflow-x-hidden transition-colors duration-300">
                <MatrixRain />
                <Navbar />
                <main className="container mx-auto px-4 pt-24 pb-16">
                  <Switch>
                    <Route path="/verify/:id">
                      <VerificationRoute />
                    </Route>
                    <Route path="/">
                      <IntroSection />
                      <RedPillSection />
                      <HistorySection />
                    </Route>
                    <Route>
                      {/* Catch-all 404, just render home */}
                      <IntroSection />
                      <RedPillSection />
                      <HistorySection />
                    </Route>
                  </Switch>
                </main>
                <Footer />
                <Toaster />
              </div>
            </ErrorBoundary>
          </TooltipProvider>
        </VerificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
