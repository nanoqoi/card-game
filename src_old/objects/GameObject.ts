import type { Environment } from 'src/environment'
import type { Application, IDestroyOptions } from 'pixi.js'
import type { CustomScene } from 'src/scenes/CustomScene'
import { EventEmitter } from 'src/utils/events'
import { Container, Point } from 'pixi.js'

export interface IGameObject {
  scene: CustomScene
  engine: Application
  environment: Environment

  onStart(): void
  onUpdate(dt: number): void
}

export abstract class GameObject<Events extends string | symbol = string>
  extends Container
  implements IGameObject
{
  public events: EventEmitter
  public engine: Application
  public environment: Environment

  public isDraggable = false
  public isImmovable = true

  velocity = new Point(0, 0)
  velocityDrag = new Point(0.5, 0.5)
  newPosition = new Point(0, 0)
  drag = 0.2

  constructor(public scene: CustomScene) {
    super()
    this.events = new EventEmitter<Events>()
    this.engine = scene.engine
    this.environment = scene.environment

    scene.engine.ticker.addOnce(this.onStart.bind(this))
    scene.engine.ticker.add(this.onUpdate.bind(this))
  }

  public moveTo(x: number, y: number) {
    this.newPosition.x = x
    this.newPosition.y = y
  }

  public getInteractingObjects() {
    const bounds = this.getBounds()

    const objects = this.scene.children.filter(
      (child) =>
        child !== this && child.getBounds().contains(bounds.x, bounds.y),
    )

    return objects
  }

  public onStart() {
    if (this.destroyed) return
  }

  public onUpdate(dt: number) {
    if (this.destroyed) return
    if (this.isImmovable) return

    if (this.newPosition.x !== this.position.x) {
      this.velocity.x +=
        (this.newPosition.x - this.position.x) * this.velocityDrag.x
      this.velocity.x *= this.drag
    }

    if (this.newPosition.y !== this.position.y) {
      this.velocity.y +=
        (this.newPosition.y - this.position.y) * this.velocityDrag.y
      this.velocity.y *= this.drag
    }

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

  destroy(_options?: IDestroyOptions | boolean) {
    this.engine.ticker.remove(this.onStart.bind(this))
    this.engine.ticker.remove(this.onUpdate.bind(this))
    super.destroy(_options)
  }
}
