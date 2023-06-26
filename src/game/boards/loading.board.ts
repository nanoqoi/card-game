import { Board, BoardRegister } from 'src/registers/board.register'
import type { Environment } from 'src/environment'

export class LoadingBoard extends Board {
  constructor(environment: Environment) {
    super(environment, 'loading', true)
  }

  register(register: BoardRegister) {
    this.environment.ticker.add(this.onTick)
  }

  async onActivate() {
    await this.environment.assets.loadAll()
  }

  async onDeactivate() {}

  onTick = () => {
    console.log(
      `loaded: ${this.environment.assets.loaded}/${this.environment.assets.size}`,
    )
  }
}
