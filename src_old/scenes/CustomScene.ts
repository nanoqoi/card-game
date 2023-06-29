import type { Environment } from 'src/environment'
import { Application, Container, IDestroyOptions } from 'pixi.js'

export interface ICustomScene {
  engine: Application
  environment: Environment

  onStart(): void
  onUpdate(dt: number): void

  onBeforeActive(): Promise<void>
  onBeforeInactive(): Promise<void>
}

export class CustomScene extends Container implements ICustomScene {
  public engine: Application

  public isUnloading = false
  public isLoading = false
  public isUnloaded = false

  public currentChildIndex = 1

  public isPressingShift = false

  constructor(public environment: Environment) {
    super()
    this.engine = environment.engine
    environment.engine.ticker.addOnce(() => this.onStart())
    environment.engine.ticker.add((dt: number) => this.onUpdate(dt))

    this.eventMode = 'dynamic'
    this.sortableChildren = true

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  add(...children: Container[]) {
    this.addChild(...children)
  }

  onKeyDown(e: KeyboardEvent) {
    console.log(e.key)
    if (e.key === 'Shift') {
      this.isPressingShift = true
    }
  }

  onKeyUp(e: KeyboardEvent) {
    console.log(e.key)
    if (e.key === 'Shift') {
      this.isPressingShift = false
    }
  }

  public onStart() {}
  public onUpdate(dt: number) {}

  public async onBeforeActive() {
    this.isUnloading = false
    this.isLoading = true
    this.isUnloaded = false
  }

  public async onBeforeInactive() {
    this.isUnloading = true
  }

  destroy(_options?: IDestroyOptions | boolean) {
    window.removeEventListener('keydown', this.onKeyDown.bind(this))
    window.removeEventListener('keyup', this.onKeyUp.bind(this))
    super.destroy(_options)
  }
}
