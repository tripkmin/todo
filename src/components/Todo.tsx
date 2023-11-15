import { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import deleteIcon from 'assets/images/icon-cross.svg';
import checkIcon from 'assets/images/icon-check.svg';
import { size, timer } from 'styles/constants';

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

const TodoElement = styled.div`
  display: flex;
  align-items: center;
  padding: 0.9rem 1.4rem;
  border-bottom: 1px solid #ddd;
  gap: 1rem;

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
  const [todo, setTodo] = useState([
    'Complete online Assembly language course',
    'fail at dieting',
    `Clean an air fryer that hasn't been cleaned in a month`,
    'Catch up on homework',
    'Bathing my cat',
    'Make too-long to-do lists appear ellipsed like this "blablablablablalablal"',
  ]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <>
      <Form onSubmit={submitHandler}>
        <Input
          type="text"
          placeholder="Create a new todo"
          value={inputValue}
          onChange={onChangeHandler}
        ></Input>
        <SubmitButton disabled={inputValue === ''}>→</SubmitButton>
      </Form>
      <TodoBody>
        {todo.map((el, idx) => (
          <TodoElement draggable key={idx}>
            <CheckButton></CheckButton>
            <p>{el}</p>
            <DeleteButton>
              <img src={deleteIcon}></img>
            </DeleteButton>
          </TodoElement>
        ))}
        <TodoStatus>
          <p>{todo.length} items left</p>
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
