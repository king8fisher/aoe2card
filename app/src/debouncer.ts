export class Debouncer {
  private timerId: number | null = null

  run(fn: () => void, delay: number) {
    this.destroy()
    // Schedule a setTimeout after delay seconds
    const self = this
    this.timerId = setTimeout(function () {
      fn()
      self.timerId = null
    }, delay)
  }

  destroy() {
    if (this.timerId != null) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
  }
}
