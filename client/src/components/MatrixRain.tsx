import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Matrix characters: Latin + Katakana
    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%$#@!~";
    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const allChars = matrix + katakana;
    const characters = allChars.split("");

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);

    // Array to store current y position of each column
    const drops: number[] = [];

    // Initialize all columns at random y position
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      // Set appropriate background and text colors based on theme
      const isDarkMode = theme === 'dark';
      
      // Create semi-transparent background rectangle to create fading effect
      if (isDarkMode) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      } else {
        ctx.fillStyle = "rgba(249, 250, 251, 0.08)"; // Light gray for light mode
      }
      ctx.fillRect(0, 0, width, height);

      // Set text color and font
      ctx.fillStyle = isDarkMode ? "#00FF41" : "#10b981"; // Emerald green for light mode
      ctx.font = fontSize + "px 'Share Tech Mono', Consolas, monospace";

      // For each column
      for (let i = 0; i < drops.length; i++) {
        // Select a random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        
        // Vary opacity based on position for a more dynamic look
        const opacity = isDarkMode 
          ? Math.min(1, drops[i] / 50) // Fade in from top in dark mode
          : Math.max(0.2, 1 - (drops[i] / (height / fontSize)) * 0.8); // Fade out toward bottom in light mode
        
        ctx.globalAlpha = opacity;

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset alpha
        ctx.globalAlpha = 1;

        // Move character down by 1 position
        drops[i]++;

        // Randomize when character returns to top
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };

    // Handle window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // Recalculate column count
      const newColumns = Math.floor(width / fontSize);

      // Adjust drops array for new width
      if (newColumns > drops.length) {
        // Add new columns
        for (let i = drops.length; i < newColumns; i++) {
          drops.push(Math.random() * -100);
        }
      } else if (newColumns < drops.length) {
        // Remove extra columns
        drops.splice(newColumns);
      }
    };

    window.addEventListener("resize", handleResize);

    // Optimize animation based on visibility
    let isPageVisible = true;
    let animationFrame: number;

    const animate = () => {
      if (isPageVisible) {
        draw();
      }
      animationFrame = requestAnimationFrame(animate);
    };

    // Only run animation when page is visible
    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start animation
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrame);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default MatrixRain;
