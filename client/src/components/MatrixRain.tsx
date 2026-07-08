import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const CHARS =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*" +
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const charArray = CHARS.split("");

    const FONT_SIZE = 14;
    const drops: number[] = Array.from(
      { length: Math.floor(width / FONT_SIZE) },
      () => Math.random() * -100
    );

    const isDark = theme === "dark";

    const draw = () => {
      // Fade trail — slightly stronger in light mode to prevent character buildup
      ctx.fillStyle = isDark
        ? "rgba(0, 0, 0, 0.05)"
        : "rgba(249, 250, 251, 0.12)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = isDark ? "#00FF41" : "#10b981";
      ctx.font = `${FONT_SIZE}px 'Share Tech Mono', Consolas, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        const opacity = isDark
          ? Math.min(1, drops[i] / 50)
          : Math.max(0.15, 1 - (drops[i] / (height / FONT_SIZE)) * 0.85);

        ctx.globalAlpha = opacity;
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        ctx.globalAlpha = 1;

        drops[i]++;
        if (drops[i] * FONT_SIZE > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };

    // Resize handler
    const handleResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newCols = Math.floor(width / FONT_SIZE);
      while (drops.length < newCols) drops.push(Math.random() * -100);
      if (drops.length > newCols) drops.splice(newCols);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Capped animation loop — 30fps to avoid burning CPU/GPU on a background effect
    let lastTime = 0;
    let rafId: number;
    let isVisible = document.visibilityState === "visible";

    const animate = (timestamp: number) => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;
      if (timestamp - lastTime < FRAME_INTERVAL) return;
      lastTime = timestamp;
      draw();
    };

    const handleVisibility = () => {
      isVisible = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", handleVisibility);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      aria-hidden
    />
  );
};

export default MatrixRain;
