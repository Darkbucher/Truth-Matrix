import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div
            className="max-w-md w-full matrix-card p-8 rounded-xl text-center
                        dark:bg-black/90 bg-white/95
                        dark:border-[#FF0000] border-red-500
                        dark:text-white text-gray-900"
          >
            {/* Glitch icon */}
            <div className="text-5xl mb-4">⚠</div>

            <h2 className="text-2xl font-bold mb-2 dark:text-[#FF0000] text-red-600">
              System Error
            </h2>
            <p className="text-sm dark:text-gray-400 text-gray-500 mb-6 font-mono">
              {this.state.errorMessage || "An unexpected error occurred."}
            </p>

            <button
              onClick={this.handleReset}
              className="matrix-button px-6 py-2 rounded-lg
                         dark:border-[#00FF41] border-emerald-500
                         dark:text-white text-gray-800
                         hover:scale-105 transition-transform duration-200"
            >
              ↺ Reboot Matrix
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
