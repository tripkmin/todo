import { useEffect, useRef } from 'react';

/**
 * 첫 마운트 시 실행되지 않고, deps 안의 state가 변할 때에만 함수를 실행되게 함.
 */
const useDidMountEffect = (func: () => void, deps: any[]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMountEffect;
