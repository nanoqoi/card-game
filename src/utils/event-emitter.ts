export interface Events {
  // the key is the event name, the value is the list of arguments supplied to the event
  [key: string]: Array<any>
}

export class EventEmitter<TEvents extends Events> {
  private events: TEvents = {} as TEvents

  public on<TEvent extends keyof TEvents>(
    event: TEvent,
    listener: (...args: TEvents[TEvent]) => void,
  ) {
    if (!this.events[event]) {
      // @ts-ignore
      this.events[event] = []
    }

    this.events[event].push(listener)

    return this
  }

  public once<TEvent extends keyof TEvents>(
    event: TEvent,
    listener: (...args: TEvents[TEvent]) => void,
  ) {
    const onceListener = (...args: TEvents[TEvent]) => {
      listener(...args)
      this.off(event, onceListener)
    }

    return this.on(event, onceListener)
  }

  public off<TEvent extends keyof TEvents>(
    event: TEvent,
    listener: (...args: TEvents[TEvent]) => void,
  ) {
    // @ts-ignore
    this.events[event] = this.events[event].filter((l) => l !== listener)

    return this
  }

  public emit<TEvent extends keyof TEvents>(
    event: TEvent,
    ...args: TEvents[TEvent]
  ) {
    this.events[event]?.forEach((listener) => listener(...args))

    return this
  }
}
