import type { Environment } from 'src/environment'
import { Board } from 'src/registers/board.register'
import { Graphics, Sprite, Text } from 'pixi.js'
import { textStyles } from 'src/utils/text-styles'

export class GameBoard extends Board {
  constructor(environment: Environment) {
    super(environment, 'game')
  }

  async onInitialize() {}

  async onFirstTick() {
    this.position = this.environment.engine.center
  }

  onTick(delta: number) {}

  onResize() {
    this.position = this.environment.engine.center
  }
}
