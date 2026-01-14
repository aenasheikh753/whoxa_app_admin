import { MonitorCog, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/common/useTheme';
import { Button } from '../ui/Button';
import type { ButtonProps } from '../ui/Button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps extends Omit<ButtonProps, 'onClick' | 'size'> { }

export function ThemeToggle({ variant = 'outline', className, ...props }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('light');
  };

  return (
    <Button
      variant='outline'
      size="icon"
      className='h-10 w-10 border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-slate-800 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      onClick={toggleTheme}
      {...props}
    >
      {theme === 'light' && <Sun className="h-5 w-5" />}
      {theme === 'dark' && <Moon className="h-5 w-5" />}
      {/* {theme === 'system' && <MonitorCog className="h-4 w-4" />} */}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
