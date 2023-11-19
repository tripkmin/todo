import styled, { ThemeProvider } from 'styled-components';
import GlobalStyles from 'styles/GlobalStyles';
import lightBg from 'assets/images/bg-desktop-light.jpg';
import darkBg from 'assets/images/bg-desktop-dark.jpg';
import { size, themeMode } from 'styles/constants';
import Header from 'layouts/Header';
import Main from 'layouts/Main';
import Footer from 'layouts/Footer';
import Todo from 'components/Todo';
import useTheme from 'hooks/useTheme';
import { ThemeT } from 'types/types';

const Background = styled.div<{ $theme: ThemeT }>`
  background-image: ${props =>
    props.$theme === 'light' ? `url(${lightBg})` : `url(${darkBg})`};
  width: 100%;
  height: 300px;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const TodoLayout = styled.section`
  width: 85%;
  margin: 5rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media screen and (max-width: ${size.mobile}) {
    margin: 5rem 2rem;
  }
`;

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <ThemeProvider theme={themeMode[theme]}>
      <GlobalStyles />
      <Background $theme={theme} />
      <TodoLayout>
        <Header theme={theme} setTheme={setTheme} />
        <Main>
          <Todo />
        </Main>
        <Footer />
      </TodoLayout>
    </ThemeProvider>
  );
}
