import { ReactNode } from 'react';
import light from 'assets/images/bg-desktop-light.jpg';
import dark from 'assets/images/bg-desktop-dark.jpg';
import styled from 'styled-components';
import { size } from 'styles/constants';

const HeaderBackground = styled.div`
  width: 100vw;
  height: 300px;
  background-size: cover;
`;

const Background = styled.img`
  width: 100%;
`;

const TodoLayoutBox = styled.section`
  width: 580px;
  margin: 5rem 0.5rem 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media screen and (max-width: ${size.mobile}) {
    width: 100%;
  }
`;

export default function TodoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderBackground>
        <Background src={light}></Background>
      </HeaderBackground>
      <TodoLayoutBox>{children}</TodoLayoutBox>
    </>
  );
}
