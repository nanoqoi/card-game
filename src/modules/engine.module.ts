import { Module } from 'src/modules/module'
import { Application, BaseTexture, SCALE_MODES, settings } from 'pixi.js'
import { PIXEL_SCALE } from 'src/constants'
import type { Environment } from 'src/environment'

export class EngineModule extends Module {
  private _engine = new Application({
    antialias: false,
    hello: false,
    backgroundColor: 0x383147,
    resolution: 1,
  })

  constructor(environment: Environment) {
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST
    settings.ROUND_PIXELS = true

    super(environment)
  }

  public async initialize() {
    // @ts-ignore
    document.body.appendChild(this._engine.view)

    await this.load()
  }

  public async load() {
    if (!this._engine) {
      throw new Error('Engine not initialized.')
    }

    addEventListener('resize', this.onAppResize)

    this._engine.start()
  }

  public async unload() {
    if (!this._engine) {
      return
    }

    removeEventListener('resize', this.onAppResize)

    this._engine.stop()
  }

  public get engine() {
    if (!this._engine) {
      throw new Error('Engine not initialized.')
    }
    return this._engine
  }

  public get stage() {
    return this.engine.stage
  }

  public get renderer() {
    return this.engine.renderer
  }

  public get view() {
    return this.engine.view
  }

  public resize(width: number, height: number) {
    return this.engine.renderer.resize(width, height)
  }

  private onAppResize = () => {
    this.resize(innerWidth / PIXEL_SCALE, innerHeight / PIXEL_SCALE)
  }
}
