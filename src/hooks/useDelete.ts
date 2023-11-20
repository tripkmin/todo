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
