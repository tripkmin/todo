import styled, { ThemeProvider } from 'styled-components';
import GlobalStyles from 'styles/GlobalStyles';
import lightBg from 'assets/images/bg-desktop-light.jpg';
import { size } from 'styles/constants';
import Header from 'layouts/Header';
import Main from 'layouts/Main';
import Footer from 'layouts/Footer';
import Todo from 'components/Todo';
import useTheme from 'hooks/useTheme';

const Background = styled.div`
  background-image: url(${lightBg});
  width: 100vw;
  height: 300px;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const TodoLayout = styled.section`
  width: 580px;
  margin: 5rem 0.5rem 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media screen and (max-width: ${size.mobile}) {
    width: 100%;
  }
`;

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <ThemeProvider theme={{ color: 'red' }}>
      <GlobalStyles />
      <Background />
      <TodoLayout>
        <Header />
        <Main>
          <Todo />
        </Main>
        <Footer />
      </TodoLayout>
    </ThemeProvider>
  );
}
