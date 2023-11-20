import { useEffect, useState } from 'react';
import { TodoT } from 'types/types';

export default function useDelete() {
  const [deletes, setDeletes] = useState<TodoT[]>([]);

  useEffect(() => {
    if (deletes.length) {
      const timeout = setTimeout(() => {
        clearDeletes();
      }, 30000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [deletes]);

  const pushDeletes = (todo: TodoT) => {
    setDeletes(prev => [...prev, todo]);
  };

  const redoDeletes = (redoId: string) => {
    const redoItem = deletes.find(deletesItem => deletesItem.id === redoId);
    // 삭제 시 나타나는 토스트 화면의 되돌리기 버튼을 짧은 시간 내에 연속으로 누를 경우
    // 중복해서 TodoList에 들어가는 것을 막기 위한 장치
    //
    if (!redoItem) return;
    setDeletes(prev => {
      const filtered = prev.filter(deletesItem => deletesItem.id !== redoItem.id);
      return filtered;
    });
    return redoItem;
  };

  const popDeletes = () => {
    const popDeletesItem = deletes[deletes.length - 1];
    setDeletes(prev => {
      return prev.slice(0, -1);
    });
    return popDeletesItem;
  };

  const clearDeletes = () => {
    setDeletes([]);
  };

  return { deletes, setDeletes, clearDeletes, pushDeletes, popDeletes, redoDeletes };
}

/* 
  toast에는 이렇게 들어와야 함.
  [
    { id: string; completed: boolean; content: string }, 
    { id: string; completed: boolean; content: string }
  ]
    
  배열에 하나가 들어왔을 때 타이머가 다시 작동.
  예를들어 삭제를 해서 toasts에 [A]가 들어왔다면 5초간의 대기시간 동안 실행취소를 할 수 있도록 함.
  그리고 5초가 지나면 삭제되도록 함.
  근데 5초 이내에 toasts에 B 할 일이 삭제될 경우 toasts 삭제 타이머가 초기화되면서 5초 뒤에 다시 작동되게 됨


  */
