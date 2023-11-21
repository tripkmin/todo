import styled from 'styled-components';
import { RoundedButton } from 'styles/common';
import frontendMentorIcon from 'assets/images/frontendMentor.svg';
import githubIcon from 'assets/images/github.svg';

export default function Footer() {
  return (
    <FooterBox>
      <p>Drag and drop to reorder list</p>
      <IconBox>
        <a
          href="https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW"
          target="_blank"
        >
          <IconButton $icon="./frontendmentor.svg">
            <img src={frontendMentorIcon}></img>
          </IconButton>
        </a>
        <a href="https://github.com/tripkmin/todo" target="_blank">
          <IconButton $icon="./github.svg">
            <img src={githubIcon}></img>
          </IconButton>
        </a>
      </IconBox>
    </FooterBox>
  );
}

const FooterBox = styled.footer`
  display: flex;
  justify-content: space-between;

  p {
    color: ${props => props.theme.font.secondary};
  }
`;

const IconBox = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 1.4rem;
`;

const IconButton = styled(RoundedButton)<{ $icon?: string }>`
  &::after {
    width: 28px;
    height: 28px;
    background-position: center;
    content: ${props => `url(${props.$icon})`};
    top: auto;
    bottom: auto;
    left: auto;
    right: auto;
    line-height: 50%;
  }
`;
