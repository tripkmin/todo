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
import { size, timer } from 'styles/constants';
import uuid from 'react-uuid';
import { EditT, TodoT } from 'types/types';
import useDidMountEffect from 'hooks/useDidMountEffect';
import useDelete from 'hooks/useDelete';
import ToastPortal from 'layouts/ToastPortal';
import { RoundedButton } from 'styles/common';

export default function Todo() {
  const [todoList, setTodoList] = useState<TodoT[]>([]);
  const [newTodoValue, setNewTodoValue] = useState('');
  const [edit, setEdit] = useState<EditT>({ id: null, status: false, inputValue: '' });
  const [draggedId, setDraggedId] = useState('');
  const [dragoverId, setDragoverId] = useState('');
  const [filter, setFilter] = useState('all');
  const { deletes, clearDeletes, pushDeletes, popDeletes } = useDelete();

  const newTodoRef = useRef<HTMLTextAreaElement>(null);
  const dragItem = useRef('');
  const dragoverItem = useRef('');
  const EditTextareaRef = useRef(null);

  const FILTER_OPTION = [
    { value: 'all', revealName: 'All' },
    { value: 'active', revealName: 'Active' },
    { value: 'completed', revealName: 'Completed' },
  ];

  // Load existing 'todo_list' from local storage if available,
  // otherwise load default data from 'data.json'.
  // 기존 Local storage에 저장된 todo_list가 있으면 불러와서 상태로 저장
  // 없을 경우 기본 더미 데이터(data.json)를 불러와 상태로 저장
  useEffect(() => {
    const localTodoData = localStorage.getItem('todo_list');
    const todoFetch = async () => {
      if (!localTodoData) {
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

  // Update local storage whenever 'todoList' state changes after the initial mount.
  // TodoList state가 첫 마운트 이후 갱신될 때마다 local storage에 같이 갱신시킴
  useDidMountEffect(() => {
    localStorage.setItem('todo_list', JSON.stringify(todoList));
  }, [todoList]);

  const newTodoSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    setTodoList(prev => [
      ...prev,
      { id: uuid(), content: newTodoValue.trim(), completed: false },
    ]);
    setNewTodoValue('');
    if (newTodoRef.current) {
      newTodoRef.current.focus();
    }
  };

  const newTodoOnChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewTodoValue(e.target.value);
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

  // Cancel edit mode when dragging or pressing Esc during editing a Todo item.
  // Todo item을 edit하고 있는 도중 드래그 하거나 Esc를 눌렀을 때 edit이 취소되도록 함.
  const editInitialize = () => {
    setEdit({ id: null, status: false, inputValue: '' });
  };

  // Attach an event listener to the global document for the 'Esc' key.
  // EditInput에다가 onKeyDown 붙여도 되지만, 이럴 경우 포커스가 맞춰지지 않았을 때
  // ESC를 눌러도 반응이 없으므로 document 전역에 이벤트 리스터를 붙였음.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Esc' || e.keyCode === 27) {
        editInitialize();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  const onDragStartHandler = (todoItem: TodoT) => {
    editInitialize();
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
      newTodo.splice(draggedItemIndex, 1); // Remove the draggedItem
      newTodo.splice(dropItemIndex, 0, draggedItem);
      [dragoverItem.current, dragItem.current] = ['', '']; // reset
      setTodoList(newTodo);
    }
    setDraggedId('');
    setDragoverId('');
  };

  const editOnSubmitHandler = () => {
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

  // Dynamically adjust the scroll size of the Textarea.
  // Textarea의 스크롤 사이즈를 동적으로 조절함
  const handleResizeHeight = (ref: RefObject<HTMLTextAreaElement>) => {
    const INNER_HEIGHT = 24;

    if (ref.current && ref.current.scrollHeight <= INNER_HEIGHT * 4) {
      ref.current.style.height = 'auto'; // Reset height
      ref.current.style.height =
        Math.min(ref.current.scrollHeight, INNER_HEIGHT * 4) + 'px';
      // Limit the scroll height to not exceed 4 lines.
      // Scroll height가 4줄 이상 넘어간다면 그 이상 넘어가지 못하게 함.
    }
  };

  useEffect(() => {
    handleResizeHeight(newTodoRef);
  }, [newTodoValue]);

  useEffect(() => {
    handleResizeHeight(EditTextareaRef);
  }, [edit.inputValue]);

  return (
    <>
      <ToastPortal
        deletes={deletes}
        clearDeletes={clearDeletes}
        popDeletes={popDeletes}
        setTodoList={setTodoList}></ToastPortal>
      <Form onSubmit={newTodoSubmitHandler}>
        <Textarea
          rows={1}
          ref={newTodoRef}
          placeholder="Create a new todo"
          value={newTodoValue}
          onChange={newTodoOnChangeHandler}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (newTodoValue.trim() === '') return;
              newTodoSubmitHandler(e);
            }
          }}></Textarea>
        <RoundedSubmitButton disabled={newTodoValue.trim() === ''}>→</RoundedSubmitButton>
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
                    }}>
                    ⨉
                  </RoundedCancelButton>
                  <RoundedCheckButton
                    disabled={edit.inputValue.trim() === ''}
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      editOnSubmitHandler();
                    }}>
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
                    }}>
                    {todoItem.content}
                  </TodoItemContent>
                  <RoundedDeleteButton
                    onClick={() => {
                      pushDeletes(todoItem);
                      setTodoList(prev => {
                        return prev.filter(_t => _t.id !== todoItem.id);
                      });
                    }}>
                    ⨉
                  </RoundedDeleteButton>
                </>
              )}
            </TodoItem>
          ))
        )}
        <TodoStatus $currentFilter={filter}>
          <p>{todoList.filter(todoItem => !todoItem.completed).length} items left</p>
          <TodoOption>
            {FILTER_OPTION.map(option => (
              <OptionButton
                key={option.value}
                onClick={() => {
                  editInitialize();
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
              const completedItems = todoList.filter(todoItem => todoItem.completed);
              if (!completedItems.length) return;
              pushDeletes(completedItems);
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
        {FILTER_OPTION.map(option => (
          <OptionButton
            key={option.value}
            onClick={() => {
              editInitialize();
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

const RoundedSubmitButton = styled(RoundedButton)<{ disabled: boolean }>`
  &:after {
    content: '→';
    opacity: ${props => (props.disabled ? 0 : 1)};
  }

  &:hover {
    &:after {
      opacity: ${props => (props.disabled ? 0 : 1)};
    }
  }
`;

const RoundedCancelButton = styled(RoundedButton)`
  &:after {
    content: '⨉';
  }
`;

const RoundedCheckButton = styled(RoundedButton)`
  &:after {
    content: '✓';
  }
`;

const RoundedDeleteButton = styled(RoundedCancelButton)`
  opacity: 0;

  &:focus {
    opacity: 1;
  }

  @media screen and (max-width: ${size.mobile}) {
    opacity: 1;
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
  transition: all ${timer.default};

  &.dragged {
    background-color: ${props => props.theme.background.dragged};
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
    ${RoundedDeleteButton} {
      opacity: 1;
    }
  }
`;

const TodoNothing = styled(TodoItem)`
  /*
  Increase the Y-axis padding to 1.05rem to compensate for the reduced font size of the 'p' element,
  ensuring that the size difference with TodoItem remains consistent.
  
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
