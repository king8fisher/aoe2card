export const genericDebouncer = <A = unknown, R = void>(
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

interface IRunDebouncedProps<T> {
  calc: () => T;
  assign: (v: T) => void;
  reject: (v: T) => void;
  delay: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class cancellableDebouncer<T> {
  private destroyed: boolean = false;
  // counter to ensure we properly deal with the most recent call to `calc` to be the source of truth.
  private counter: number = 0;
  private timerId: NodeJS.Timeout | null = null;

  static runBackgroundJob<T>(fn: () => T, counter: number): Promise<[T, number]> {
    return new Promise((resolve, _reject) => {
      // This delay is to mimic out-of-sync calculations. Increasing the delay allows to see
      // out-of-sync promises happening which in real applications requires care in handling them.
      //
      // TODO: Remove it after making tests that emulate this and test for correctness.
      delay(Math.random() * 50).then(() => {
        resolve([fn(), counter]);
      });
    });
  }

  /** runDebounced splits calculation and assignment into 2 steps by chaining result of `calc` into `assign`. This
   * allows for debouncer to interrupt the assignment step when another kicks in later while the first one is still
   * not done with its `calc` step.
   *
   * As `calc` will most likely depend on some of the state, it is essential to ensure that the state
   * is cached so when the actual `calc` step is executed, the captured value corresponds to the time
   * when `runDebounced` has been called.
   */
  runDebounced({ calc, assign, reject, delay }: IRunDebouncedProps<T>) {
    if (this.destroyed) return; // Silently fail
    this.counter++;
    this.destroyTimer();
    const localCounter = this.counter;
    this.timerId = setTimeout(() => {
      cancellableDebouncer.runBackgroundJob(calc, localCounter).then((v) => {
        // We might be cancelled by assigning another timer at this point,
        // so we want to never perform the assign step
        const [r, refCounter] = v;
        if (refCounter === this.counter) {
          assign(r);
        } else {
          // We are out of sync with the most recent call to run the calc through this debouncer.
          // By calling `reject` we ensure that the calling party has the opportunity to drop
          // this result or do something else about it.
          //
          // Uncomment me to see dropping in action
          console.warn(["dropping", refCounter, this.counter]);
          reject(r);
        }
        this.destroyTimer();
      });
    }, delay);
  }

  destroyDebouncer() {
    this.destroyTimer();
    this.destroyed = true;
  }

  private destroyTimer() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
