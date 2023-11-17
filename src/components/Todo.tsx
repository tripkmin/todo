import { ChangeEvent, DragEvent, FormEvent, MouseEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import deleteIcon from 'assets/images/icon-cross.svg';
import checkIcon from 'assets/images/icon-check.svg';
import { size, timer } from 'styles/constants';
import uuid from 'react-uuid';
import { EditT } from 'types/types';

const Form = styled.form`
  display: flex;
  gap: 1rem;
  background-color: white;
  padding: 1rem 1.4rem;
  border-radius: 0.5rem;
`;
const CheckButton = styled.button<{ $completed: boolean }>`
  padding: 10px;
  border-radius: 50%;
  border: 1px solid #bbb;
  background: white;
  position: relative;

  &::after {
    position: absolute;
    content: '→';
    transform: rotate(90deg);
    color: white;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 50%;
    background-image: url(${checkIcon});
    background: linear-gradient(
      155deg,
      rgba(108, 185, 237, 1) 0%,
      rgba(169, 121, 236, 1) 100%
    );
    opacity: ${props => (props.$completed ? 1 : 0)};
    transition: opacity ${timer.fast};
  }
`;

const TodoItemContent = styled.p<{ $completed: boolean }>`
  color: ${props => (props.$completed ? '#aaa' : '')};
  text-decoration: ${props => (props.$completed ? 'line-through' : '')};
`;
const DeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity ${timer.fast};

  &:focus {
    opacity: 1;
  }
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 6px;
  color: #aaa;
  border-radius: 5px;
  background: #eee;
  position: relative;

  &:after {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    content: '→';
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 5px;
    border: 1px solid #fff;
    background: linear-gradient(155deg, #edcb6c 0%, #ec79bc 100%);
    opacity: ${props => (props.disabled ? 0 : 1)};
    transition: opacity ${timer.fast};
  }

  &:disabled {
    cursor: not-allowed;
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
    background-color: #dddddd;
  }

  &.dragover {
    position: relative;

    &:after {
      position: absolute;
      content: '';
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #8a3dd4;
    }

    &:before {
      content: '';
      position: absolute;
      left: -3px;
      bottom: -4px;
      padding: 2px;
      border-radius: 50%;
      border: 2px solid #8a3dd4;
      background-color: white;
      z-index: 1;
    }
  }
  p {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 500;
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

const TodoNothing = styled(TodoItem)`
  /*
  p의 폰트 사이즈가 줄어든 만큼 y축 패딩값을 1.05rem으로 늘려
  TodoItem과의 크기 차이가 나지 않도록 보정함
  */
  padding: 1.05rem 1.4rem;
  p {
    font-size: 0.8rem;
    color: #aaa;
    text-align: center;
  }
`;

const TodoStatus = styled.div<{ $currentFilter: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.4rem;

  p {
    font-size: 0.8rem;
    color: #888;
  }

  button {
  }
`;

const TodoOption = styled.div`
  display: flex;
  gap: 1rem;
`;

const OptionButton = styled.button<{ $filter: string; value: string }>`
  color: ${props => (props.$filter === props.value ? '#6f9ffb' : '#999999')};
  font-size: 0.9rem;
  font-weight: 700;
  transition: all ${timer.default};
  &:hover {
    color: ${props => (props.$filter === props.value ? '#6f9ffb' : '#000000')};
  }
`;

const ClearButton = styled.button`
  color: #999999;
  font-size: 0.9rem;
  transition: all ${timer.default};

  &:hover {
    color: #000000;
  }
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
  const inputRef = useRef<HTMLInputElement>(null);

  const [todoList, setTodoList] = useState<TodoT[]>([
    { id: uuid(), completed: false, content: 'Complete online Assembly language course' },
    { id: uuid(), completed: false, content: 'fail at dieting' },
    {
      id: uuid(),
      completed: false,
      content: `Clean an air fryer that hasn't been cleaned in a month`,
    },
    { id: uuid(), completed: false, content: 'Catch up on homework' },
    { id: uuid(), completed: false, content: 'Bathing my cat' },
    {
      id: uuid(),
      completed: false,
      content:
        'Make too-long to-do lists appear ellipsed like this "blablablablablalablal"',
    },
  ]);

  const dragItem = useRef('');
  const dragoverItem = useRef('');
  const [draggedId, setDraggedId] = useState('');
  const [dragoverId, setDragoverId] = useState('');
  const [edit, setEdit] = useState<EditT>({ id: null, status: false, inputValue: '' });

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setTodoList(prev => [...prev, { id: uuid(), content: inputValue, completed: false }]);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const classNameHandler = (todoItem: TodoT) => {
    if (todoItem.id === draggedId && todoItem.id === dragoverId) {
      return 'dragged dragover';
    } else if (todoItem.id === draggedId) {
      return 'dragged';
    } else if (todoItem.id === dragoverId) {
      return 'dragover';
    } else {
      return '';
    }
  };

  const [filter, setFilter] = useState('all');
  const FILTEROPTION = [
    { value: 'all', revealName: 'All' },
    { value: 'active', revealName: 'Active' },
    { value: 'completed', revealName: 'Completed' },
  ];

  const filteredTodoList = () => {
    switch (filter) {
      case 'completed':
        return todoList.filter(todoItem => todoItem.completed);
      case 'active':
        return todoList.filter(todoItem => !todoItem.completed);
      default:
        return [...todoList].sort((a, b) => +a.completed - +b.completed);
    }
  };

  interface TodoT {
    id: string;
    content: string;
    completed: boolean;
  }

  const onDragStartHandler = (todoItem: TodoT) => {
    setEdit({ id: null, status: false, inputValue: '' }); // 만약 editing하고 있었다면 editing을 종료시킴
    dragItem.current = todoItem.id;
    setDraggedId(todoItem.id);
  };

  const onDragEnterHandler = (todoItem: TodoT) => {
    dragoverItem.current = todoItem.id;
    setDragoverId(todoItem.id);
  };

  const onDragEndHandler = () => {
    const newTodo = [...todoList];
    const draggedItem = newTodo.find(todoItem => todoItem.id === dragItem.current);
    const draggedItemIndex = newTodo.findIndex(todo => todo.id === dragItem.current);
    const dropItemIndex = newTodo.findIndex(todo => todo.id === dragoverItem.current);
    if (draggedItem) {
      newTodo.splice(draggedItemIndex, 1); // draggedItem을 제거함
      newTodo.splice(dropItemIndex, 0, draggedItem);
      [dragoverItem.current, dragItem.current] = ['', '']; // reset
      setTodoList(newTodo);
    }
    setDraggedId('');
    setDragoverId('');
  };

  const onEditSubmitHandler = () => {
    const newTodo = todoList.map(todoItem => {
      if (todoItem.id === edit.id) {
        return { ...todoItem, content: edit.inputValue };
      } else {
        return { ...todoItem };
      }
    });
    setTodoList(newTodo);
    setEdit({ id: '', status: false, inputValue: '' });
  };

  const onCheckHandler = (todoItem: TodoT) => {
    setTodoList(prev => {
      return prev.map(_t => {
        if (_t.id === todoItem.id) {
          return { ..._t, completed: !_t.completed };
        } else {
          return { ..._t };
        }
      });
    });
  };

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Create a new todo"
          value={inputValue}
          onChange={onChangeHandler}></Input>
        <SubmitButton disabled={inputValue.trim() === ''}>→</SubmitButton>
      </Form>
      <TodoBody>
        {todoList.length === 0 ? (
          <TodoNothing>
            <p>No to-dos here! Time for a break, maybe?</p>
          </TodoNothing>
        ) : (
          filteredTodoList().map(todoItem => (
            <TodoItem
              draggable
              key={todoItem.id}
              className={classNameHandler(todoItem)}
              onDragStart={() => {
                onDragStartHandler(todoItem);
              }}
              onDragEnter={() => {
                onDragEnterHandler(todoItem);
              }}
              onDragOver={(e: DragEvent) => {
                e.preventDefault();
              }}
              onDragEnd={() => {
                onDragEndHandler();
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
                      onEditSubmitHandler();
                    }}>
                    submit
                  </button>
                </>
              ) : (
                <>
                  <CheckButton
                    $completed={todoItem.completed}
                    onClick={() => {
                      onCheckHandler(todoItem);
                    }}
                  />
                  <TodoItemContent
                    $completed={todoItem.completed}
                    onClick={() => {
                      setEdit(prev => ({
                        inputValue: todoItem.content,
                        id: todoItem.id,
                        status: !prev.status,
                      }));
                    }}>
                    {todoItem.content}
                  </TodoItemContent>
                  <DeleteButton
                    onClick={() => {
                      setTodoList(prev => {
                        return prev.filter(_t => _t.id !== todoItem.id);
                      });
                    }}>
                    <img src={deleteIcon}></img>
                  </DeleteButton>
                </>
              )}
            </TodoItem>
          ))
        )}
        <TodoStatus $currentFilter={filter}>
          <p>{todoList.filter(todoItem => !todoItem.completed).length} items left</p>
          <TodoOption>
            {FILTEROPTION.map(option => (
              <OptionButton
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                }}
                value={option.value}
                $filter={filter}>
                {option.revealName}
              </OptionButton>
            ))}
          </TodoOption>
          <ClearButton
            onClick={() => {
              setTodoList(prev => {
                const filtered = prev.filter(todoItem => !todoItem.completed);
                return filtered;
              });
            }}>
            Clear Completed
          </ClearButton>
        </TodoStatus>
      </TodoBody>
      <TodoFooter>
        {FILTEROPTION.map(option => (
          <OptionButton
            key={option.value}
            onClick={() => {
              setFilter(option.value);
            }}
            value={option.value}
            $filter={filter}>
            {option.revealName}
          </OptionButton>
        ))}
      </TodoFooter>
    </>
  );
}
