import { motion, AnimatePresence } from 'framer-motion';
import { Dispatch, SetStateAction, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { RoundedButton } from 'styles/common';
import { size, timer } from 'styles/constants';
import { TodoT } from 'types/types';

interface ToastPortalT {
  deletes: (TodoT | TodoT[])[];
  clearDeletes: () => void;
  popDeletes: () => TodoT | TodoT[];
  setTodoList: Dispatch<SetStateAction<TodoT[]>>;
}

export default function ToastPortal({
  deletes,
  clearDeletes,
  popDeletes,
  setTodoList,
}: ToastPortalT) {
  // Ref to prevent button clicks during the exit animation.
  // 닫기 애니메이션이 진행 중일 때 버튼 동작을 방지하기 위한 ref
  const clickRef = useRef(false);

  const undoButtonHandler = () => {
    // Prevents the button from functioning while the closing animation is in progress.
    // 닫기 애니메이션이 진행 중일 때 버튼을 누르면 작동이 되지 않도록 함.
    if (clickRef.current) return;

    clickRef.current = true;
    const popItems = popDeletes();

    // Handles the case where TodoT[] can come through Clear Completed.
    // Clear Completed를 통해 TodoT[]가 들어올 수 있기 때문에 분리해서 다룸.
    Array.isArray(popItems) && popItems
      ? setTodoList(prev => [...prev, ...popItems])
      : setTodoList(prev => [...prev, popItems]);
  };

  const getKey = (item: TodoT | TodoT[]) => {
    return Array.isArray(item) ? item[0].id : item.id;
  };

  const noticeMessage = (item: TodoT | TodoT[]) => {
    // Handles the case where TodoT[] can come through Clear Completed.
    // Clear Completed를 통해 TodoT[]가 들어올 수 있기 때문에 분리해서 다룸.
    return Array.isArray(item) ? (
      <p>All completed To-do items deleted</p>
    ) : (
      <p>To-do item deleted</p>
    );
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
            key={getKey(deleteItem)}>
            {noticeMessage(deleteItem)}
            <div>
              <UndoButton onClick={undoButtonHandler}>↻</UndoButton>
              <ClearButton onClick={clearDeletes}>⨉</ClearButton>
            </div>
          </Toast>
        ))}
      </AnimatePresence>
    </>,
    document.querySelector('#toast') as HTMLElement
  );
}

const Toast = styled(motion.div)`
  background-color: ${props => props.theme.background.toast};
  transition: background-color ${timer.default}, color ${timer.default},
    border ${timer.default};
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
