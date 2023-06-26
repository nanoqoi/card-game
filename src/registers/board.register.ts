import { Register, Registerable } from 'src/registers/register'
import { Container } from 'pixi.js'
import type { Environment } from 'src/environment'

export abstract class Board extends Registerable<BoardRegister> {
  public readonly container = new Container()

  protected constructor(
    public readonly environment: Environment,
    public readonly name: string,
    public readonly activateOnStart = false,
  ) {
    super()
  }

  public register(register: BoardRegister) {}
  public deregister(register: BoardRegister) {}

  public abstract onActivate(): void
  public abstract onDeactivate(): void
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
