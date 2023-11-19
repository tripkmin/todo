import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  MouseEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import deleteIcon from 'assets/images/icon-cross.svg';
import { size, timer } from 'styles/constants';
import uuid from 'react-uuid';
import { EditT } from 'types/types';
import useDidMountEffect from 'hooks/useDidMountEffect';

const Form = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  background-color: ${props => props.theme.background.secondary};
  padding: 1rem 1.4rem;
  border-radius: 0.5rem;
  transition: background-color ${timer.default};
`;
const CheckButton = styled.button<{ $completed: boolean }>`
  padding: 10px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.border.primary};
  background-color: ${props => props.theme.background.secondary};
  position: relative;
  transition: border ${timer.default}, background-color ${timer.default};

  &::after {
    position: absolute;
    content: '✓';
    color: white;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 50%;
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
  color: ${props =>
    props.$completed ? props.theme.font.disabled : props.theme.font.primary};
  text-decoration: ${props => (props.$completed ? 'line-through' : '')};
  transition: color ${timer.default};
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

  @media screen and (max-width: ${size.mobile}) {
    opacity: 1;
  }
`;

const RoundedButton = styled.button<{ disabled?: boolean }>`
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

const RoundedSubmitButton = styled(RoundedButton)`
  &:after {
    content: '→';
    color: white;
    background: linear-gradient(155deg, #edcb6c 0%, #ec79bc 100%);
  }
`;

const RoundedCancelButton = styled(RoundedButton)`
  &:after {
    content: '⨉';
    color: white;
    background: linear-gradient(155deg, #edcb6c 0%, #ec79bc 100%);
  }
`;

const RoundedCheckButton = styled(RoundedButton)`
  &:after {
    content: '✓';
    color: white;
    background: linear-gradient(155deg, #edcb6c 0%, #ec79bc 100%);
  }
`;

const Textarea = styled.textarea`
  background-color: ${props => props.theme.background.secondary};
  color: ${props => props.theme.font.primary};
  transition: all ${timer.default};
  flex-grow: 1;
  border: 0;
  resize: none;

  &::placeholder {
    color: ${props => props.theme.font.secondary};
    transition: all ${timer.default};
  }
`;

const TodoBody = styled.div`
  padding: 0.3rem 0;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.background.secondary};
  transition: background-color ${timer.default};
  box-shadow: 0px 30px 80px 5px rgba(0, 0, 0, 0.1);
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.9rem 1.4rem;
  border-bottom: 1px solid ${props => props.theme.border.secondary};
  gap: 1rem;
  transition: border-bottom ${timer.default};

  &.dragged {
    background-color: ${props => props.theme.background.light};
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
      background-color: ${props => props.theme.background.secondary};

      z-index: 1;
    }
  }
  p {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 500;

    @media screen and (max-width: ${size.mobile}) {
      font-size: 0.9rem;
      display: -webkit-box;
      white-space: normal;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
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
    color: ${props => props.theme.font.secondary};
    transition: color ${timer.default};
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
    color: ${props => props.theme.font.secondary};
    transition: color ${timer.default};
  }
`;

const TodoOption = styled.div`
  display: flex;
  gap: 1rem;

  @media screen and (max-width: ${size.mobile}) {
    display: none;
  }
`;

const OptionButton = styled.button<{ $filter: string; value: string }>`
  color: ${props =>
    props.$filter === props.value ? props.theme.font.active : props.theme.font.secondary};
  font-size: 0.9rem;
  font-weight: 700;
  transition: color ${timer.default};

  &:hover {
    color: ${props =>
      props.$filter === props.value ? props.theme.font.active : props.theme.font.hover};
  }
`;

const ClearButton = styled.button`
  color: #999999;
  font-size: 0.9rem;
  transition: color ${timer.default};

  &:hover {
    color: ${props => props.theme.font.hover};
  }
`;

const TodoFooter = styled.div`
  display: none;
  @media screen and (max-width: ${size.mobile}) {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem 3rem;
    border-radius: 0.5rem;
    background-color: ${props => props.theme.background.secondary};
    box-shadow: 0px 30px 80px 10px rgba(0, 0, 0, 0.1);
    transition: background-color ${timer.default};
  }
`;

export default function Todo() {
  const [textareaValue, setTextareaValue] = useState('');
  const TextareaRef = useRef<HTMLTextAreaElement>(null);

  const [todoList, setTodoList] = useState<TodoT[]>([]);

  const dragItem = useRef('');
  const dragoverItem = useRef('');
  const [draggedId, setDraggedId] = useState('');
  const [dragoverId, setDragoverId] = useState('');
  const [edit, setEdit] = useState<EditT>({ id: null, status: false, inputValue: '' });

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setTodoList(prev => [
      ...prev,
      { id: uuid(), content: textareaValue, completed: false },
    ]);
    setTextareaValue('');
    if (TextareaRef.current) {
      TextareaRef.current.focus();
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
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
        return todoList;
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

  const handleResizeHeight = (ref: RefObject<HTMLTextAreaElement>) => {
    if (ref.current) {
      ref.current.style.height = 'auto'; //height 초기화
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  };

  const EditTextareaRef = useRef(null);

  useEffect(() => {
    handleResizeHeight(TextareaRef);
  }, [textareaValue]);

  useEffect(() => {
    handleResizeHeight(EditTextareaRef);
  }, [edit.inputValue]);

  useEffect(() => {
    const localTodoData = localStorage.getItem('todo_list');
    const todoFetch = async () => {
      if (!localTodoData) {
        // initialize by data.json
        const res = await fetch('./data.json');
        const data = await res.json();
        localStorage.setItem('todo_list', JSON.stringify(data));
        setTodoList(data);
      } else {
        setTodoList(JSON.parse(localTodoData));
      }
    };

    todoFetch();
  }, []);

  useDidMountEffect(() => {
    localStorage.setItem('todo_list', JSON.stringify(todoList));
  }, [todoList]);

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Textarea
          rows={1}
          ref={TextareaRef}
          placeholder="Create a new todo"
          value={textareaValue}
          onChange={onChangeHandler}
        ></Textarea>
        <RoundedSubmitButton disabled={textareaValue.trim() === ''}>
          →
        </RoundedSubmitButton>
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
              }}
            >
              {edit.id === todoItem.id ? (
                <>
                  <Textarea
                    ref={EditTextareaRef}
                    rows={1}
                    defaultValue={edit.inputValue}
                    onChange={e =>
                      setEdit(prev => ({
                        ...prev,
                        inputValue: e.target.value,
                      }))
                    }
                  />
                  <RoundedCancelButton
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      setEdit({ id: '', status: false, inputValue: '' });
                    }}
                  >
                    ⨉
                  </RoundedCancelButton>
                  <RoundedCheckButton
                    disabled={edit.inputValue.trim() === ''}
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      onEditSubmitHandler();
                    }}
                  >
                    ✓
                  </RoundedCheckButton>
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
                    }}
                  >
                    {todoItem.content}
                  </TodoItemContent>
                  <DeleteButton
                    onClick={() => {
                      setTodoList(prev => {
                        return prev.filter(_t => _t.id !== todoItem.id);
                      });
                    }}
                  >
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
                $filter={filter}
              >
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
            }}
          >
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
            $filter={filter}
          >
            {option.revealName}
          </OptionButton>
        ))}
      </TodoFooter>
    </>
  );
}
