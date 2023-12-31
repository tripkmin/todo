import { ReactNode } from 'react';
import styled from 'styled-components';

export default function Main({ children }: { children: ReactNode }) {
  return <MainBox>{children}</MainBox>;
}

const MainBox = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
