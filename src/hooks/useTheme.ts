import { useEffect, useState } from 'react';
import { ThemeT } from 'types/types';

export default function useTheme() {
  const localTheme = localStorage.getItem('todo_theme');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let themeMode: ThemeT = 'light';

  // If the user has a manually selected theme preference, apply it.
  // 유저가 임의로 선택한 테마가 있을 경우 우선적으로 적용
  if (localTheme === 'light' || localTheme === 'dark') {
    themeMode = localTheme;
    // If the user has no selected theme, but the OS is in dark mode, apply dark mode.
    // 유저 선택 테마가 없지만, OS에서 다크 모드를 쓰고 있다면 다크 모드를 적용시켜 줌.
  } else if (prefersDarkMode) {
    themeMode = 'dark';
  }

  const [theme, setTheme] = useState<ThemeT>(themeMode);

  useEffect(() => {
    localStorage.setItem('todo_theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
