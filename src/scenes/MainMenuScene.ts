import { wait } from 'src/utils/promises'
import { Asset } from 'src/modules/AssetsModule'
import { Sprite } from 'pixi.js'
import { CustomScene } from 'src/scenes/CustomScene'
import { PlacementTileObject } from 'src/objects/PlacementTileObject'
import { PlayingCards } from 'src/objects/PlayingCardObject'

export class MainMenuScene extends CustomScene {
  board = new Sprite()
  sortableChildren = true

  onStart() {
    this.alpha = 0

    this.board.texture = this.environment.assets.getTexture(Asset.BOARD)
    this.board.anchor.set(0.5)
    this.add(this.board)

    const stack = new PlacementTileObject(this)
    const cards = [
      new PlayingCards.clubs[0](this),
      new PlayingCards.spades[0](this),
      new PlayingCards.hearts[0](this),
      new PlayingCards.diamonds[0](this),
    ]

    stack.isImmovable = true
    stack.isDraggable = false

    this.add(stack)
    for (const card of cards) {
      this.add(card)
    }
  }

  onUpdate(dt: number) {
    this.position.set(
      this.engine.renderer.width / 2,
      this.engine.renderer.height / 2,
    )

    if (this.isLoading) {
      this.alpha += 0.05
    }
  }

  async onBeforeActive() {
    await super.onBeforeActive()
    await wait(500)
  }
}
