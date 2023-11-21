import styled from 'styled-components';
import { timer } from './constants';

export const RoundedButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.font.primary};
  border-radius: 5px;
  background: ${props => props.theme.background.light};
  position: relative;
  transition: all ${timer.default};

  // gradient를 적용한 background는 transition이 먹히지 않음.
  // 따라서 똑같은 크기의 요소를 가상으로 만들어 opacity를 조절하는 식으로 transition을 구현.
  &:after {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    content: '';
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    transition: opacity ${timer.default};
    opacity: 0;
    color: white;
    background: linear-gradient(155deg, #ed6c6c 0%, #b864ee 100%);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:hover {
    &:after {
      opacity: 1;
    }
  }

  &:focus {
    &:after {
      opacity: 1;
    }
  }
`;
