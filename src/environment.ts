import { AssetRegister } from 'src/registers/asset.register'
import { EngineModule } from 'src/modules/engine.module'
import { TickerModule } from 'src/modules/ticker.module'
import { BoardRegister } from 'src/registers/board.register'
import { sound } from '@pixi/sound'

export class Environment {
  public isPaused = false

  // registers
  public readonly assets = new AssetRegister(this)
  public readonly boards = new BoardRegister(this)
  // modules
  public readonly engine = new EngineModule(this)
  public readonly ticker = new TickerModule(this)

  public async initialize() {
    // registers
    await this.assets.initialize()
    await this.boards.initialize()
    // modules
    await this.engine.initialize()
    await this.ticker.initialize()
  }

  public pause() {
    this.ticker.raw.stop()
    sound.pauseAll()

    this.isPaused = true
  }

  public resume() {
    this.ticker.raw.start()
    sound.resumeAll()

    this.isPaused = false
  }

  public async start() {
    this.ticker.addOnce(this.onFirstTick)
    this.ticker.add(this.onTick)
  }

  private onFirstTick = () => {}
  private onTick = () => {}
}
