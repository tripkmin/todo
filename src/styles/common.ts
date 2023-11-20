import styled from 'styled-components';
import { timer } from './constants';

export const RoundedButton = styled.button<{ disabled?: boolean }>`
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
    opacity: ${props => (props.disabled ? 0 : 1)};
    transition: opacity ${timer.fast};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
