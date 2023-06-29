import { Register, Registerable } from 'src/registers/register'
import { Container, DisplayObject } from 'pixi.js'
import type { Environment } from 'src/environment'

export abstract class Board extends Registerable<BoardRegister> {
  public isInitialized = false
  public readonly container = new Container()

  protected constructor(
    public readonly environment: Environment,
    public readonly name: string,
    public readonly activateOnStart = false,
  ) {
    super()
    this.container.visible = false
  }

  public get position() {
    return this.container.position
  }

  public set position(value: { x: number; y: number }) {
    this.container.position.set(value.x, value.y)
  }

  public get children() {
    return this.container.children
  }

  public get y() {
    return this.container.y
  }

  public get x() {
    return this.container.y
  }

  public set y(value: number) {
    this.container.y = value
  }

  public set x(value: number) {
    this.container.x = value
  }

  public add<T extends DisplayObject>(item: T) {
    return this.container.addChild(item)
  }

  public remove<T extends DisplayObject>(item: T) {
    return this.container.removeChild(item)
  }

  private _events = {
    tick: this.onTick.bind(this),
    firstTick: this.onFirstTick.bind(this),
    resize: this.onResize.bind(this),
  }

  public registerEvents() {
    this.environment.ticker.add(this._events.tick)
    this.environment.ticker.addOnce(this._events.firstTick)
    this.environment.engine.resizer.add(this._events.resize)
  }

  public deregisterEvents() {
    this.environment.ticker.remove(this._events.tick)
    this.environment.ticker.remove(this._events.firstTick)
    this.environment.engine.resizer.remove(this._events.resize)
  }

  public register(register: BoardRegister) {}

  public deregister(register: BoardRegister) {
    this.deregisterEvents()
  }

  public abstract onInitialize(): void

  public onActivate() {
    this.environment.engine.stage.addChild(this.container)
    if (!this.isInitialized) {
      this.onInitialize()
      this.isInitialized = true
    }
    this.deregisterEvents()
    this.registerEvents()
  }

  public onDeactivate() {
    this.environment.engine.stage.removeChild(this.container)
    this.deregisterEvents()
  }

  public abstract onTick(delta: number): void
  public abstract onResize(): void
  public abstract onFirstTick(): void
}

export class BoardRegister extends Register<Board> {
  private _active: Board | undefined

  public async initialize() {}

  public register(mod: Board) {
    super.register(mod)
    if (mod.activateOnStart) {
      this.active = mod
    }
  }

  public get(name: string) {
    return this.modules.find((a) => a.name === name)
  }

  public childrenOf(name: string) {
    return this.get(name)?.container.children
  }

  public switch(name: string) {
    this.active = this.get(name)
  }

  public set active(board: Board | undefined) {
    if (this._active) {
      this._active.onDeactivate()
      this._active.container.visible = false
    }

    this._active = board

    if (this._active) {
      this._active.onActivate()
      this._active.container.visible = true
    }
  }

  public get active() {
    return this._active
  }

  public get container() {
    return this._active?.container
  }

  public get children() {
    return this._active?.container.children
  }
}
