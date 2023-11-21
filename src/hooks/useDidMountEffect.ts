import { useEffect, useRef } from 'react';

/**
 * Ensures that the function is not executed on the initial mount,
 * but only when the states inside 'deps' change.
 * 첫 마운트 시 실행되지 않고 deps 안의 state가 변할 때에만 함수를 실행되게 함.
 *
 * @param func - The function to be executed. / 실행될 함수
 * @param deps - The dependencies to monitor for changes. / 변화를 감지할 deps
 */
const useDidMountEffect = (func: () => void, deps: any[]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMountEffect;
