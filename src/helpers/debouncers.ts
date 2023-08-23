interface IRunDebouncedProps<T> {
  calc: () => T;
  assign: (v: T) => void;
  delay: number;
}

export const createDebouncer = <T>() => {
  let timerId: number | null | undefined = null;

  const runDebounced = ({ calc, assign, delay }: IRunDebouncedProps<T>) => {
    destroyDebouncer();
    timerId = setTimeout(() => {
      assign(calc());
      timerId = null;
    }, delay);
  }

  const destroyDebouncer = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  return { runDebounced, destroyDebouncer };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class createPromiseDebouncer<T> {
  private counter: number = 0;
  private timerId: number | null = null;

  static runBackgroundJob<T>(fn: () => T, counter: number): Promise<[T, number]> {
    return new Promise((resolve, _reject) => {
      // This delay is to mimic out-of-sync calculations
      // TODO: Remove it after making tests that emulate this and test for correctness.
      delay(Math.random() * 50).then(() => {
        resolve([fn(), counter]);
      });
    });
  }

  /** runDebounced splits calculation and assignment into 2 steps by chaining result of `calc` into `assign`. This
   * allows for debouncer to interrupt the assignment step when another kicks in later while the first one is still
   * not done with its `calc` step.
   */
  runDebounced({ calc, assign, delay }: IRunDebouncedProps<T>) {
    this.counter++;
    this.destroyDebouncer();
    const localCounter = this.counter;
    const ref = this;
    this.timerId = setTimeout(() => {
      createPromiseDebouncer.runBackgroundJob(calc, localCounter).then((v) => {
        // We might be cancelled by assigning another timer at this point,
        // so we want to never perform the assign step
        const [r, refCounter] = v;
        if (refCounter === ref.counter) {
          assign(r);
        } else {
          // We are out of sync with the most recent call to run debouncer.
          // Skipping the assignment step
          // console.warn(["dropping", refCounter, ref.counter])
        }
        ref.destroyDebouncer();
      });
    }, delay);
  }

  destroyDebouncer() {
    this.destroyTimer();
  }

  destroyTimer() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
