import { ChangeEvent, DragEvent, FormEvent, MouseEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import deleteIcon from 'assets/images/icon-cross.svg';
import checkIcon from 'assets/images/icon-check.svg';
import { size, timer } from 'styles/constants';
import uuid from 'react-uuid';

const Form = styled.form`
  display: flex;
  gap: 1rem;
  background-color: white;
  padding: 1rem 1.4rem;
  border-radius: 0.5rem;
`;
const CheckButton = styled.button`
  padding: 10px;
  border-radius: 50%;
  background: linear-gradient(
    155deg,
    rgba(108, 185, 237, 1) 0%,
    rgba(169, 121, 236, 1) 100%
  );
`;

const DeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity ${timer.fast};
`;

// Issue: transition not applied to gradient property of background.
const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 6px;
  color: white;
  border-radius: 5px;
  border: 1px solid #eee;
  background: linear-gradient(155deg, #edcb6c 0%, #ec79bc 100%);

  &:disabled {
    color: #aaa;
    background: #eee;
  }
`;

const Input = styled.input`
  width: 100%;
  border: 0;
`;

const TodoBody = styled.div`
  padding: 0.3rem 0;
  border-radius: 0.5rem;
  background-color: white;
  border: 1px solid #eee;
  box-shadow: 0px 30px 80px 5px rgba(0, 0, 0, 0.1);
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.9rem 1.4rem;
  border-bottom: 1px solid #ddd;
  gap: 1rem;

  &.dragged {
    background-color: #eeeeee;
  }

  &.dragover {
    border-bottom: 2px solid #8a3dd4;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: -3px;
      bottom: -4px;
      padding: 2px;
      border-radius: 50%;
      border: 2px solid #8a3dd4;
      background-color: white;
    }
  }
  p {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  button {
    flex-shrink: 0;
  }

  &:hover {
    ${DeleteButton} {
      opacity: 1;
    }
  }
`;

const TodoStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.4rem;

  p {
    font-size: 0.8rem;
    color: #888;
  }

  button {
    font-size: 0.9rem;
    transition: all 0.2s;

    &:hover {
      font-weight: 900;
    }
  }
`;

const TodoOption = styled.div`
  display: flex;
  gap: 1rem;
`;

const TodoFooter = styled.div`
  display: none;
  @media screen and (max-width: ${size.mobile}) {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem 3rem;
    border-radius: 0.5rem;
    background-color: white;
    border: 1px solid #eee;
    box-shadow: 0px 30px 80px 10px rgba(0, 0, 0, 0.1);
  }
`;

export default function Todo() {
  const [inputValue, setInputValue] = useState('');
  const [todoList, setTodoList] = useState<TodoT[]>([
    { id: uuid(), content: 'Complete online Assembly language course' },
    { id: uuid(), content: 'fail at dieting' },
    { id: uuid(), content: `Clean an air fryer that hasn't been cleaned in a month` },
    { id: uuid(), content: 'Catch up on homework' },
    { id: uuid(), content: 'Bathing my cat' },
    {
      id: uuid(),
      content:
        'Make too-long to-do lists appear ellipsed like this "blablablablablalablal"',
    },
  ]);
  const dragItem = useRef('');
  const dragEnterItem = useRef('');
  const [edit, setEdit] = useState<{
    id: null | string;
    status: boolean;
    inputValue: string;
  }>({ id: null, status: false, inputValue: '' });
  const [draggedId, setDraggedId] = useState('');
  const [dragoverId, setDragoverId] = useState('');

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setTodoList(prev => [...prev, { id: uuid(), content: inputValue }]);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  interface TodoT {
    id: string;
    content: string;
  }

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Input
          type="text"
          placeholder="Create a new todo"
          value={inputValue}
          onChange={onChangeHandler}></Input>
        <SubmitButton disabled={inputValue === ''}>→</SubmitButton>
      </Form>
      <TodoBody>
        {todoList.map(todoItem => (
          <TodoItem
            draggable
            key={todoItem.id}
            className={
              todoItem.id === draggedId && todoItem.id === dragoverId
                ? 'dragged dragover'
                : todoItem.id === draggedId
                ? 'dragged'
                : todoItem.id === dragoverId
                ? 'dragover'
                : ''
            }
            onDragStart={(e: DragEvent) => {
              setEdit({ id: null, status: false, inputValue: '' }); // 만약 editing하고 있었다면 editing을 종료시킴
              dragItem.current = todoItem.id;
              setDraggedId(todoItem.id);
            }}
            onDragEnter={(e: DragEvent) => {
              dragEnterItem.current = todoItem.id;
              setDragoverId(todoItem.id);
            }}
            onDragOver={(e: DragEvent) => {
              e.preventDefault();
            }}
            onDrop={(e: DragEvent) => {
              const newTodo = [...todoList];
              const draggedItem = newTodo.find(
                todoItem => todoItem.id === dragItem.current
              );
              const draggedItemIndex = newTodo.findIndex(
                todo => todo.id === dragItem.current
              );
              const dropItemIndex = newTodo.findIndex(
                todo => todo.id === dragEnterItem.current
              );
              if (draggedItem) {
                newTodo.splice(draggedItemIndex, 1); // draggedItem을 제거함
                newTodo.splice(dropItemIndex, 0, draggedItem);
                [dragEnterItem.current, dragItem.current] = ['', '']; // reset
                setTodoList(newTodo);
              }
              setDraggedId('');
              setDragoverId('');
            }}>
            {edit.id === todoItem.id ? (
              <>
                <Input
                  type="text"
                  defaultValue={edit.inputValue}
                  onChange={e =>
                    setEdit(prev => ({
                      ...prev,
                      inputValue: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    setEdit({ id: '', status: false, inputValue: '' });
                  }}>
                  cancel
                </button>
                <button
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    const newTodo = todoList.map(todoItem => {
                      if (todoItem.id === edit.id) {
                        return { ...todoItem, content: edit.inputValue };
                      } else {
                        return { ...todoItem };
                      }
                    });
                    setTodoList(newTodo);
                    setEdit({ id: '', status: false, inputValue: '' });
                  }}>
                  submit
                </button>
              </>
            ) : (
              <>
                <CheckButton />
                <p
                  onClick={() => {
                    setEdit(prev => ({
                      inputValue: todoItem.content,
                      id: todoItem.id,
                      status: !prev.status,
                    }));
                  }}>
                  {todoItem.content}
                </p>
                <DeleteButton>
                  <img src={deleteIcon}></img>
                </DeleteButton>
              </>
            )}
          </TodoItem>
        ))}
        <TodoStatus>
          <p>{todoList.length} items left</p>
          <TodoOption>
            <button>All</button>
            <button>Active</button>
            <button>Completed</button>
          </TodoOption>
          <button>Clear Completed</button>
        </TodoStatus>
      </TodoBody>
      <TodoFooter>
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
      </TodoFooter>
    </>
  );
}
