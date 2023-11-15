import { useEffect, useState } from 'react';

export default function useTheme() {
  const localTheme = localStorage.getItem('todo_theme');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let themeMode = 'light';
  if (localTheme === 'light' || localTheme === 'dark') {
    themeMode = localTheme;
  } else if (prefersDarkMode) {
    themeMode = 'dark';
  }

  const [theme, setTheme] = useState(themeMode);

  useEffect(() => {
    localStorage.setItem('todo_theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
