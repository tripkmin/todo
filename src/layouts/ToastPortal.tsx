import { motion, AnimatePresence } from 'framer-motion';
import { Dispatch, SetStateAction, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { RoundedButton } from 'styles/common';
import { size, timer } from 'styles/constants';
import { TodoT } from 'types/types';

const Toast = styled(motion.div)`
  background-color: ${props => props.theme.background.secondary};
  transition: background-color ${timer.default}, color ${timer.default};
  color: ${props => props.theme.font.primary};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  width: 400px;
  height: 4em;
  border: 1px solid ${props => props.theme.border.secondary};

  div {
    display: flex;
    gap: 1rem;
  }

  @media screen and (max-width: ${size.mobile}) {
    width: calc(100% - 4rem);
    left: 0;
    margin: 0 2rem;
  }
`;

const UndoButton = styled(RoundedButton)`
  color: ${props => props.theme.font.primary};

  &:after {
    content: '↻';
    color: white;
    background: linear-gradient(155deg, #edcb6c 0%, #ec79bc 100%);
  }
`;

const ClearButton = styled(RoundedButton)`
  color: ${props => props.theme.font.primary};

  &:after {
    content: '⨉';
    color: white;
    background: linear-gradient(155deg, #edcb6c 0%, #ec79bc 100%);
  }
`;

interface ToastPortalT {
  deletes: TodoT[];
  clearDeletes: () => void;
  popDeletes: () => TodoT;
  setTodoList: Dispatch<SetStateAction<TodoT[]>>;
}

export default function ToastPortal({
  deletes,
  clearDeletes,
  popDeletes,
  setTodoList,
}: ToastPortalT) {
  const clickRef = useRef(false);

  /**
   * undo 버튼을 눌러 닫기 애니메이션이 진행 중일 때
   * 또 다시 버튼을 눌렀을 때에는 작동이 되지 않도록 clickRef를 통해 설정.
   */
  const redoButtonHandler = () => {
    if (clickRef.current) return;

    clickRef.current = true;
    const popItems = popDeletes();
    popItems && setTodoList(prev => [...prev, popItems]);
  };

  return createPortal(
    <>
      <AnimatePresence
        onExitComplete={() => {
          clickRef.current = false;
        }}>
        {deletes.map(deleteItem => (
          <Toast
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, type: 'spring' }}
            exit={{ opacity: 0, x: 20 }}
            key={deleteItem.id}>
            <p>To-do deleted</p>
            <div>
              <UndoButton onClick={redoButtonHandler}>↻</UndoButton>
              <ClearButton onClick={clearDeletes}>⨉</ClearButton>
            </div>
          </Toast>
        ))}
      </AnimatePresence>
    </>,
    document.querySelector('#toast') as HTMLElement
  );
}
