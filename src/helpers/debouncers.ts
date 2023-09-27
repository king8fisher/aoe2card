// A custom hook that returns a debounced function

import { useCallback, useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  // A ref to store the timer id
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // A function that wraps the original function with a debounce logic
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      // Clear the previous timer if any
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Set a new timer to invoke the original function after the delay
      timerRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );

  // A cleanup function to clear the timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Return the debounced function
  return debouncedFn;
};