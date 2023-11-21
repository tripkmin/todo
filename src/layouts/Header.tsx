import lightIcon from 'assets/images/icon-sun.svg';
import darkIcon from 'assets/images/icon-moon.svg';
import styled from 'styled-components';
import { ThemeT } from 'types/types';
import { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
  theme: ThemeT;
  setTheme: Dispatch<SetStateAction<ThemeT>>;
}

export default function Header({ theme, setTheme }: HeaderProps) {
  return (
    <HeaderBox>
      <h1>TODO</h1>
      {theme === 'light' ? (
        <button
          onClick={() => {
            setTheme('dark');
          }}>
          <img src={darkIcon}></img>
        </button>
      ) : (
        <button
          onClick={() => {
            setTheme('light');
          }}>
          <img src={lightIcon}></img>
        </button>
      )}
    </HeaderBox>
  );
}

const HeaderBox = styled.header`
  display: flex;
  justify-content: space-between;

  h1 {
    font-size: 2.5rem;
    letter-spacing: 0.8rem;
    font-weight: 900;
    color: white;
  }
`;
