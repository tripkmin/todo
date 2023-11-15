import styled from 'styled-components';

const FooterBox = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: #777;
  }
`;

export default function Footer() {
  return (
    <FooterBox>
      <p>Drag and drop to reorder list</p>
    </FooterBox>
  );
}
