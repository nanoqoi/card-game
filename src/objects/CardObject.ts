import { GameObject } from 'src/objects/GameObject'
import {
  AnimatedSprite,
  FederatedMouseEvent,
  IDestroyOptions,
  IPointData,
  Point,
} from 'pixi.js'
import { Asset, Sound } from 'src/modules/AssetsModule'
import { CardStack } from 'src/objects/CardStack'
import type { CustomScene } from 'src/scenes/CustomScene'

const SHADOW_OFFSET = 8

export enum CardEvent {
  PICKUP = 'CardEvent::PICKUP',
  DROP = 'CardEvent::DROP',
  DRAG = 'CardEvent::DRAG',
}

export class CardObject extends GameObject<CardEvent> {
  stackType: any

  mesh!: AnimatedSprite
  shadow!: AnimatedSprite
  item!: AnimatedSprite
  faces: AnimatedSprite[] = []

  isDraggable = true
  isImmovable = false

  canPop = false

  isNotVisibleYet = false

  public isDragging = false
  public isParentDragging = false
  public isFlipping = true
  public isVisible = true

  private dragData: FederatedMouseEvent | null = null
  private dragStartPoint: IPointData | null = null

  async pop() {
    if (!this.canPop) return
    this.eventMode = 'none'
    this.mesh.stop()
    this.item?.destroy()
    this.faces.forEach((face) => face.destroy())

    this.isFlipping = true // not really but it does the same thing
    this.mesh.textures = [
      this.environment.assets.getTexture(Asset.CARD_POP1),
      this.environment.assets.getTexture(Asset.CARD_POP2),
      this.environment.assets.getTexture(Asset.CARD_POP3),
      this.environment.assets.getTexture(Asset.CARD_POP4),
      this.environment.assets.getTexture(Asset.CARD_POP5),
      this.environment.assets.getTexture(Asset.CARD_POP6),
    ]

    this.mesh.loop = false
    this.mesh.animationSpeed = 0.8

    if (this instanceof CardStack) {
      for (const card of this.stack.reverse()) {
        this.remove(card)
        await card.pop()
      }
    }

    this.mesh.onComplete = () => {
      this.destroy()
    }

    this.mesh.play()
  }

  onStart(flip = true) {
    this.name = 'CardObject'

    this.once('added', () =>
      this.environment.assets.sound.play(
        [
          Sound.CARD_PICKUP_1,
          Sound.CARD_PICKUP_2,
          Sound.CARD_PICKUP_3,
          Sound.CARD_PICKUP_4,
          Sound.CARD_PICKUP_5,
        ][Math.floor(Math.random() * 5)],
        { volume: 0.3 },
      ),
    )

    this.mesh = new AnimatedSprite(
      [
        this.environment.assets.getTexture(Asset.CARD1),
        this.environment.assets.getTexture(Asset.CARD2),
        this.environment.assets.getTexture(Asset.CARD3),
      ].sort(() => Math.random() - 0.5),
    )

    this.shadow = new AnimatedSprite(
      [
        this.environment.assets.getTexture(Asset.CARD_OUTLINE1),
        this.environment.assets.getTexture(Asset.CARD_OUTLINE2),
        this.environment.assets.getTexture(Asset.CARD_OUTLINE3),
      ].sort(() => Math.random() - 0.5),
    )

    this.mesh.anchor.set(0.5)
    this.shadow.anchor.set(0.5)
    this.shadow.alpha = 0

    this.mesh.animationSpeed = 0.1
    this.shadow.animationSpeed = 0.1

    if (this.isDraggable) {
      this.eventMode = 'dynamic'

      this.on('pointerdown', this.onDragStart.bind(this))
        .on('pointerup', this.onDragEnd.bind(this))
        .on('globalpointermove', this.onDrag.bind(this))
        .on('pointerupoutside', this.onDragEnd.bind(this))
    }

    this.shadow.play()
    this.addChild(this.shadow)
    this.addChild(this.mesh)

    if (flip) {
      const originalTextures = this.mesh.textures.slice()
      const originalSpeed = 0.1

      if (this.item) {
        this.item.alpha = 0
      }

      this.faces.forEach((face) => (face.alpha = 0))

      this.mesh.textures = [
        this.environment.assets.getTexture(Asset.CARD_FLIP1),
        this.environment.assets.getTexture(Asset.CARD_FLIP2),
        this.environment.assets.getTexture(Asset.CARD_FLIP3),
        this.environment.assets.getTexture(Asset.CARD_FLIP4),
      ]

      this.mesh.loop = false
      this.mesh.animationSpeed = 0.4

      this.mesh.onFrameChange = (currentFrame: number) => {
        if (currentFrame === this.mesh.textures.length - 1) {
          if (this.item) {
            this.item.alpha = 1
          }

          this.faces.forEach((face) => (face.alpha = 1))
        }
      }

      this.mesh.onComplete = () => {
        this.mesh.loop = true
        this.mesh.animationSpeed = originalSpeed
        this.mesh.textures = originalTextures
        this.mesh.play()
        this.mesh.onComplete = undefined
        this.isFlipping = false
      }
    } else {
      this.isFlipping = false
    }

    this.mesh.play()
  }

  public setVisible(visible: boolean) {
    if (visible) {
      this.isVisible = true
      if (!this.mesh) return
      this.mesh.textures = [
        this.environment.assets.getTexture(Asset.CARD1),
        this.environment.assets.getTexture(Asset.CARD2),
        this.environment.assets.getTexture(Asset.CARD3),
      ].sort(() => Math.random() - 0.5)
      this.mesh.animationSpeed = 0.1
      this.mesh.play()
      this.item.alpha = 1
      this.faces.map((face) => (face.alpha = 1))
    } else {
      this.isVisible = false
      if (!this.mesh) return
      this.mesh.textures = [
        this.environment.assets.getTexture(Asset.CARD_FLIP1),
      ]
      this.item.alpha = 0
      this.faces.map((face) => (face.alpha = 0))
    }
  }

  public onPickUp(isDefault = true) {
    this.mesh.scale.set(1.05)

    if (isDefault) {
      this.mesh.position.y -= SHADOW_OFFSET
      this.shadow.alpha = 1
    }

    this.environment.assets.sound.play(
      [
        Sound.CARD_PICKUP_1,
        Sound.CARD_PICKUP_2,
        Sound.CARD_PICKUP_3,
        Sound.CARD_PICKUP_4,
        Sound.CARD_PICKUP_5,
      ][Math.floor(Math.random() * 5)],
      { volume: isDefault ? 0.15 : 0.05 },
    )
  }

  public onDrop(isDefault = true) {
    this.mesh.scale.set(1)

    if (isDefault) {
      this.mesh.position.y += SHADOW_OFFSET
      this.shadow.alpha = 0
    }

    this.environment.assets.sound.play(
      [
        Sound.CARD_DROP_1,
        Sound.CARD_DROP_2,
        Sound.CARD_DROP_3,
        Sound.CARD_DROP_4,
        Sound.CARD_DROP_5,
      ][Math.floor(Math.random() * 5)],
      { volume: isDefault ? 0.15 : 0.05 },
    )

    if (this.scene.isPressingShift) {
      this.pop()
    }
  }

  private onDragStart(event: FederatedMouseEvent) {
    if (!this.isDraggable) return
    if (this.isParentDragging) return
    if (this.isFlipping) return
    this.isDragging = true
    this.dragData = event
    this.dragStartPoint = event.getLocalPosition(this.mesh)

    this.onPickUp()
    this.zIndex = this.scene.currentChildIndex += 1
    this.zIndex += 100

    this.events.emit(CardEvent.PICKUP, event)
  }

  private onDrag(event: FederatedMouseEvent) {
    if (!this.isDraggable) return
    if (this.isParentDragging) return
    if (this.isFlipping) return
    if (!this.dragData) return
    if (!this.dragStartPoint) return
    if (!this.isDragging) return

    this.newPosition = Point.from(this.position)
    this.velocity = new Point(0, 0)

    const position = event.getLocalPosition(this.parent)

    this.position.x = position.x - this.dragStartPoint.x
    this.position.y = position.y - this.dragStartPoint.y

    this.events.emit(CardEvent.DRAG, event)
  }

  private onDragEnd(event: FederatedMouseEvent) {
    if (!this.isDraggable) return
    if (this.isParentDragging) return
    if (this.isFlipping) return
    if (this.isDragging) {
      this.onDrop()
    }

    this.newPosition = Point.from(this.position)

    // add some slide when you drop a card
    if (this.dragData && this.dragStartPoint) {
      const position = event.getLocalPosition(this.parent)
      this.velocity = new Point(
        (position.x - this.dragStartPoint.x - this.position.x) / 10,
        (position.y - this.dragStartPoint.y - this.position.y) / 10,
      )
    }

    this.zIndex = this.scene.currentChildIndex

    this.events.emit(CardEvent.DROP, event)

    this.isDragging = false
  }

  destroy(_options?: IDestroyOptions | boolean) {
    this.off('pointerdown', this.onDragStart.bind(this))
      .off('pointerup', this.onDragEnd.bind(this))
      .off('pointerupoutside', this.onDragEnd.bind(this))
      .off('globalpointermove', this.onDrag.bind(this))
    super.destroy(_options)
  }
}
