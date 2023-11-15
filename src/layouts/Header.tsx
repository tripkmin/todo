import lightIcon from 'assets/images/icon-sun.svg';
import darkIcon from 'assets/images/icon-moon.svg';
import styled from 'styled-components';

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

export default function Header() {
  return (
    <HeaderBox>
      <h1>TODO</h1>
      <button>
        <img src={lightIcon}></img>
      </button>
    </HeaderBox>
  );
}
