import { DraggableObject } from 'src/game/objects/draggable.object'
import type { Environment } from 'src/environment'
import { AnimatedSprite } from 'pixi.js'
import { SoundCollection } from 'src/lib/tools/sound-collection'
import { CardStack } from 'src/lib/tools/card-stack'
import type { GameBoard } from 'src/game/boards/game.board'

export class CardObject extends DraggableObject {
  enableVelocityOnDrag = true

  private faces: AnimatedSprite[] = []

  pickSounds = new SoundCollection(
    [
      this.environment.assets.get('card-pickup-1').toSound(),
      this.environment.assets.get('card-pickup-2').toSound(),
      this.environment.assets.get('card-pickup-3').toSound(),
      this.environment.assets.get('card-pickup-4').toSound(),
      this.environment.assets.get('card-pickup-5').toSound(),
    ],
    true,
  )

  dropSounds = new SoundCollection(
    [
      this.environment.assets.get('card-drop-1').toSound(),
      this.environment.assets.get('card-drop-2').toSound(),
      this.environment.assets.get('card-drop-3').toSound(),
      this.environment.assets.get('card-drop-4').toSound(),
      this.environment.assets.get('card-drop-5').toSound(),
    ],
    true,
  )

  public stack = new CardStack(this)
  public parentStack: CardStack | null = null

  constructor(
    public gameBoard: GameBoard,
    public environment: Environment,
    public name: string,
    public facesFrames: string[][],
  ) {
    super(
      environment,
      name,
      environment.assets
        .getMany(['card1', 'card2', 'card3'])
        .map((frame) => frame.toTexture()),
      {},
    )

    for (const faceFrames of facesFrames) {
      const face = new AnimatedSprite(
        this.environment.assets
          .getMany(faceFrames)
          .map((frame) => frame.toTexture()),
        true,
      )
      face.animationSpeed = 0.1
      face.play()
      face.anchor.set(0.5)
      this.faces.push(face)
      this.addChild(face)
    }
  }

  onTick() {
    super.onTick()

    if (this.parentStack) {
      if (this.shouldBounceAgainstWalls) {
        this.shouldBounceAgainstWalls = false
      }
    } else {
      if (!this.shouldBounceAgainstWalls) {
        this.shouldBounceAgainstWalls = true
      }
    }
  }

  onPickUp() {
    super.onPickUp()
  }

  onDrop() {
    super.onDrop()
    if (this.parentStack !== null) {
      this.parentStack.cutAt(this)
      this.clearMovement()
    }
  }

  public isInStack(stack: CardStack) {
    return stack.has(this)
  }
}
