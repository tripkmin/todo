import { ThemeProvider } from 'styled-components';
import GlobalStyles from 'styles/GlobalStyles';

export default function App() {
  return (
    <ThemeProvider theme={{ color: 'red' }}>
      <GlobalStyles />
    </ThemeProvider>
  );
}
