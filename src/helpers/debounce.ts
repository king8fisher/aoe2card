export const debounce = <A = unknown, R = void>(
  fn: (args: A) => R,
  ms: number
): [(args: A) => Promise<R>, () => void] => {
  let timer: NodeJS.Timeout;
  const debouncedFunc = (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });
  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
  return [debouncedFunc, cancel];
};
