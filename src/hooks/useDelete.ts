import { useEffect, useState } from 'react';
import { TodoT } from 'types/types';

export default function useDelete() {
  // An array that can contain multiple TodoT items, possibly through 'Clear Complete'.
  // Clear Complete를 통해 여러 TodoT가 있는 배열이 들어올 수도 있음.
  const [deletes, setDeletes] = useState<(TodoT | TodoT[])[]>([]);

  useEffect(() => {
    if (deletes.length) {
      const timeout = setTimeout(() => {
        clearDeletes();
      }, 8000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [deletes]);

  const pushDeletes = (todo: TodoT | TodoT[]) => {
    setDeletes(prev => [...prev, todo]);
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

  return { deletes, clearDeletes, pushDeletes, popDeletes };
}
