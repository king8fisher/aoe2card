interface IRunDebouncedProps<T> {
  run: () => T;
  assign: (v: T) => void;
  delay: number;
}

export const createDebouncer = <T>() => {
  let timerId: number | null | undefined = null;

  function runDebounced({ run, assign, delay }: IRunDebouncedProps<T>) {
    destroyDebouncer();
    timerId = setTimeout(function () {
      assign(run());
      timerId = null;
    }, delay);
  }

  function destroyDebouncer() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  return { runDebounced, destroyDebouncer };
};

export class createPromiseDebouncer<T> {
  private counter: number = 0;
  private timerId: number | null = null;

  static runBackgroundJob<T>(fn: () => T, counter: number): Promise<[T, number]> {
    return new Promise((resolve, _reject) => {
      resolve([fn(), counter]);
    });
  }

  runDebounced({ run, assign, delay }: IRunDebouncedProps<T>) {
    this.counter++;
    this.destroyDebouncer()
    const localCounter = this.counter;
    const ref = this;
    this.timerId = setTimeout(function () {
      createPromiseDebouncer.runBackgroundJob(run, localCounter).then((v) => {
        // We might be cancelled by assigning another timer at this point,
        // so we want to never perform the assign step
        let [r, refCounter] = v
        if (refCounter === ref.counter) {
          assign(r)
        } else {
          console.log([ "not equal", refCounter, ref.counter ])
        }
        ref.destroyDebouncer();
      })
    }, delay);
  }

  destroyDebouncer() {
    this.destroyTimer()
  }

  destroyTimer() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

}