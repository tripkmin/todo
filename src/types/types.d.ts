export type TodoT = { id: string; completed: boolean; content: string };
export type EditT = { id: null | string; status: boolean; inputValue: string };
export type ThemeT = 'dark' | 'light';
export type ThemeModeDetailT = {
  background: {
    primary: string;
    secondary: string;
    light: string;
    dragged: string;
    toast: string;
  };
  font: {
    header: string;
    primary: string;
    secondary: string;
    disabled: string;
    hover: string;
    active: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
};
export type ThemeModeT = {
  light: ThemeModeDetailT;
  dark: ThemeModeDetailT;
};
