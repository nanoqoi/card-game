import { wait } from 'src/utils/promises'
import { Asset } from 'src/modules/AssetsModule'
import { AnimatedSprite, Sprite } from 'pixi.js'
import { CustomScene } from 'src/scenes/CustomScene'
import { PlacementTileObject } from 'src/objects/PlacementTileObject'
import {
  clubs,
  diamonds,
  hearts,
  PlayingCards,
  spades,
} from 'src/objects/PlayingCardObject'
import { StackPosition } from 'src/objects/CardStack'

export class MainMenuScene extends CustomScene {
  board = new Sprite()
  sortableChildren = true

  onStart() {
    this.alpha = 0

    this.board.texture = this.environment.assets.getTexture(Asset.BOARD)
    this.board.anchor.set(0.5)
    this.add(this.board)

    const stacks = [
      {
        name: 'hearts',
        item: new PlacementTileObject(this),
        stack: new PlacementTileObject(this),
        overlay: hearts.faces,
      },
      {
        name: 'diamonds',
        item: new PlacementTileObject(this),
        stack: new PlacementTileObject(this),
        overlay: diamonds.faces,
      },
      {
        name: 'clubs',
        item: new PlacementTileObject(this),
        stack: new PlacementTileObject(this),
        overlay: clubs.faces,
      },
      {
        name: 'spades',
        item: new PlacementTileObject(this),
        stack: new PlacementTileObject(this),
        overlay: spades.faces,
      },
    ] as const

    let startingX = -stacks.length * 62.5

    let indexes = {
      hearts: 0,
      diamonds: 0,
      clubs: 0,
      spades: 0,
    }

    for (const { name, item: tile, stack, overlay } of stacks) {
      tile.isImmovable = true
      tile.isDraggable = false
      stack.isImmovable = true
      stack.isDraggable = false

      const animated = new AnimatedSprite(
        overlay
          .map((face) => this.environment.assets.getTexture(face))
          .sort(() => Math.random() - 0.5),
      )

      animated.anchor.set(0.5)
      animated.animationSpeed = 0.1
      animated.play()

      tile.addChild(animated)

      tile.x = startingX += 100
      tile.y = -100
      stack.x = tile.x
      stack.y = tile.y + 100

      tile.interactive = true
      tile.on('pointerdown', () => {
        const card = new PlayingCards[name][indexes[name]](this)
        this.add(card)
        stack.add(card, StackPosition.TOP)
        if (indexes[name] >= PlayingCards[name].length - 1) {
          indexes[name] = 0
        } else {
          indexes[name]++
        }
      })

      this.add(tile)
      this.add(stack)
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
