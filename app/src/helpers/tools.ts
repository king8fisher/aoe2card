interface RunDebouncerProps {
  fn: () => void;
  delay: number;
}

export const createDebouncer = () => {
  let timerId: number | null | undefined = null;

  function runDebouncer({ fn, delay }: RunDebouncerProps) {
    destroyDebouncer();
    timerId = setTimeout(function () {
      fn();
      timerId = null;
    }, delay);
  }

  function destroyDebouncer() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  return { runDebouncer, destroyDebouncer };
};
