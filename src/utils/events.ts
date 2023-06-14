export class EventEmitter<T extends string | symbol = string | symbol> {
  private events: Map<T, Set<Function>> = new Map()

  public on(event: T, listener: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }

    this.events.get(event)?.add(listener)

    return this
  }

  public once(event: T, listener: Function) {
    const onceListener = (...args: any[]) => {
      listener(...args)
      this.off(event, onceListener)
    }

    return this.on(event, onceListener)
  }

  public off(event: T, listener: Function) {
    this.events.get(event)?.delete(listener)

    return this
  }

  public emit(event: T, ...args: any[]) {
    this.events.get(event)?.forEach((listener) => listener(...args))

    return this
  }
}
