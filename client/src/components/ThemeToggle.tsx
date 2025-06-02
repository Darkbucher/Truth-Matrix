import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      onClick={toggleTheme}
      variant="ghost" 
      size="icon"
      className="rounded-full w-10 h-10 transition-all duration-200 hover:bg-[#00FF4120] relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${theme === 'dark' ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'}`}>
        <Moon className="h-5 w-5 text-[#00FF41]" />
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${theme === 'light' ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'}`}>
        <Sun className="h-5 w-5 text-yellow-500" />
      </div>
    </Button>
  );
};

export default ThemeToggle;