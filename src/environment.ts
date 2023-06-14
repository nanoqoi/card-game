import { ScenesModule } from 'src/modules/ScenesModule'
import { Application, SCALE_MODES, settings } from 'pixi.js'
import { AssetsModule } from 'src/modules/AssetsModule'
import { PIXEL_SCALE } from 'src/constants'

export class Environment {
  private _isInitialized = false

  public engine!: Application

  // modules
  public scenes!: ScenesModule
  public assets!: AssetsModule

  public async initialize() {
    out.log('Initializing environment...')

    // Initialize Engine
    await this.initEngine()

    // Modules
    this.assets = new AssetsModule(this)
    await this.assets.initialize()
    this.scenes = new ScenesModule(this)
    await this.scenes.initialize()

    // Resizer
    window.addEventListener('resize', () => this.onResize())
    this.onResize()

    this._isInitialized = true
    out.log('Environment initialized.')
  }

  public async start() {
    out.log('Starting environment...')
    if (!this._isInitialized) {
      throw new Error(
        'Environment is not initialized, call <Environment>.initialize() first.',
      )
    }

    this.engine.ticker.start()

    // await this.scenes.setActive(ScenesModule.Scenes.LOADING)
    await this.scenes.setActive(ScenesModule.Scenes.MAIN_MENU)

    out.log('Environment started.')
  }

  private async initEngine() {
    this.engine = new Application({
      antialias: false,
      hello: false,
      backgroundColor: 0x383147,
      resolution: 1,
    })

    // Setup for pixel art
    settings.SCALE_MODE = SCALE_MODES.NEAREST
    settings.ROUND_PIXELS = true

    // @ts-ignore
    document.body.appendChild(this.engine.view)
  }

  private onResize() {
    this.engine.renderer.resize(
      window.innerWidth / PIXEL_SCALE,
      window.innerHeight / PIXEL_SCALE,
    )
  }
}
