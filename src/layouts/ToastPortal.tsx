import { motion, AnimatePresence, usePresence, useMotionValue } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { size, timer } from 'styles/constants';
import { TodoT } from 'types/types';

const Toast = styled(motion.div)`
  background-color: ${props => props.theme.background.light};
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

  @media screen and (max-width: ${size.mobile}) {
    width: calc(100% - 4rem);
    left: 0;
    margin: 0 2rem;
  }
`;
interface ToastPortalT {
  deletes: TodoT[];
  clearDeletes: () => void;
  popDeletes: () => TodoT;
  setTodoList: Dispatch<SetStateAction<TodoT[]>>;
  redoDeletes: (redoId: string) => TodoT | undefined;
}

export default function ToastPortal({
  deletes,
  clearDeletes,
  popDeletes,
  setTodoList,
  redoDeletes,
}: ToastPortalT) {
  // const [isPresent, safeToRemove] = usePresence();
  // useEffect(() => {
  //   !isPresent && console.log("I've been removed!");
  // }, [isPresent]);

  const 클릭했냐 = useMotionValue(false);

  return createPortal(
    <>
      <AnimatePresence
        onExitComplete={() => {
          클릭했냐.set(false);
        }}
      >
        {deletes.map(deleteItem => (
          <Toast
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, type: 'spring' }}
            exit={{ opacity: 0, x: 20 }}
            key={deleteItem.id}
          >
            <p>To-do deleted</p>
            <div>
              <button
                onClick={e => {
                  if (클릭했냐.get()) return;
                  클릭했냐.set(true);
                  const popItems = popDeletes();
                  popItems && setTodoList(prev => [...prev, popItems]);
                }}
              >
                undo
              </button>
              <button onClick={clearDeletes}>close</button>
            </div>
          </Toast>
        ))}
      </AnimatePresence>
    </>,
    document.querySelector('#toast') as HTMLElement
  );
}
