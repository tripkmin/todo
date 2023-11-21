import { ThemeModeT } from 'types/types';

export const themeMode: ThemeModeT = {
  light: {
    background: {
      primary: '#fafafa',
      secondary: '#ffffff',
      light: '#dddddd',
      dragged: '#cccccc',
      toast: '#efefef',
    },
    font: {
      header: '#ffffff',
      primary: '#5e5d62',
      secondary: '#8c8c96',
      disabled: '#d0d0d3',
      hover: '#4c4b63',
      active: '#5d8ef3',
    },
    border: {
      primary: '#a8a8a9',
      secondary: '#f5f4f6',
    },
  },
  dark: {
    background: {
      primary: '#181824',
      secondary: '#25273c',
      light: '#545888',
      dragged: '#8389d4',
      toast: '#25273c',
    },
    font: {
      header: '#ffffff',
      primary: '#c0c2dc',
      secondary: '#75778c',
      disabled: '#3f4158',
      hover: '#dee1f3',
      active: '#5d8ef3',
    },
    border: {
      primary: '#666a95',
      secondary: '#323449',
    },
  },
};

export const timer = {
  default: '0.3s',
  fast: '0.1s',
  slow: '0.5s',
};

export const size = {
  mobile: '600px',
  desktop: '1024px',
};
