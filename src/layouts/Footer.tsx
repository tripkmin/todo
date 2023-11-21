import styled from 'styled-components';

export default function Footer() {
  return (
    <FooterBox>
      <p>Drag and drop to reorder list</p>
    </FooterBox>
  );
}

const FooterBox = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: ${props => props.theme.font.secondary};
  }
`;
