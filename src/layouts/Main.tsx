import { ReactNode } from 'react';
import styled from 'styled-components';

const MainBox = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export default function Main({ children }: { children: ReactNode }) {
  return <MainBox>{children}</MainBox>;
}
