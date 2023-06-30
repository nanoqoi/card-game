import type { Environment } from 'src/environment'
import type { Texture } from 'pixi.js'
import { Point } from 'pixi.js'
import { PIXEL_SCALE } from 'src/constants'
import { GameObject } from 'src/lib/game.object'
import { SoundCollection } from 'src/lib/tools/sound-collection'

export interface DraggableOptions {
  snapToPixelScaleGrid?: boolean
  centerToObjectOnDrag?: boolean
}

export class DraggableObject extends GameObject {
  public draggingDisabled = false
  public enableVelocityOnDrag = false

  public isDragging = false
  public isClicking = false

  private globalDragOrigin = new Point(0, 0)
  private localDragOrigin = new Point(0, 0)

  public pickSounds: SoundCollection = new SoundCollection([])
  public dropSounds: SoundCollection = new SoundCollection([])

  constructor(
    public environment: Environment,
    public name: string,
    textures: Texture[],
    public dragOptions: DraggableOptions,
  ) {
    super(environment, name, textures)

    this.on('pointerdown', this.onPointerDown.bind(this))
    this.on('pointerup', this.onPointerUp.bind(this))
    this.on('pointerupoutside', this.onPointerUp.bind(this))
    this.on('globalpointermove', this.onPointerMove.bind(this))
  }

  onPickUp() {}
  onDrop() {}

  onDragStart() {
    this.onPickUp()
  }

  onDragEnd() {
    this.onDrop()
  }

  onPointerDown() {
    this.isClicking = true
    this.globalDragOrigin = this.environment.interaction.position.global.clone()
    this.localDragOrigin = this.environment.interaction.position
      .local(this)
      .clone()

    if (this.pickSounds) {
      this.pickSounds.play()
    }
  }

  onPointerUp() {
    this.isClicking = false

    if (this.isDragging) {
      this.onDragEnd()
      this.isDragging = false
    }

    if (this.dropSounds) {
      this.dropSounds.play()
    }
  }

  onPointerMove(event: PointerEvent) {
    if (this.draggingDisabled) return
    if (this.isClicking) {
      this.isDragging = true
      this.onDragStart()
    }

    if (!this.isDragging) return

    const center = this.environment.engine.center
    const global = this.environment.interaction.position.global

    if (this.dragOptions.snapToPixelScaleGrid) {
      global.x = Math.round(global.x / PIXEL_SCALE) * PIXEL_SCALE
      global.y = Math.round(global.y / PIXEL_SCALE) * PIXEL_SCALE
    }

    if (this.dragOptions.centerToObjectOnDrag) {
      global.x += this.localDragOrigin.x
      global.y += this.localDragOrigin.y
    }

    this.position.set(
      global.x - this.localDragOrigin.x - center.x,
      global.y - this.localDragOrigin.y - center.y,
    )

    this.velocity.x = global.x - this.globalDragOrigin.x
    this.velocity.y = global.y - this.globalDragOrigin.y

    if (this.enableVelocityOnDrag) {
      this.velocity.x += event.movementX / 2
      this.velocity.y += event.movementY / 2
    }

    this.globalDragOrigin = this.environment.interaction.position.global.clone()
  }

  onAwake() {}
  onTick() {
    if (!this.isDragging) {
      super.onTick()
    }
  }
  onFirstTick() {}
}
