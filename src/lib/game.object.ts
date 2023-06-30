import {
  AnimatedSprite,
  DisplayObject,
  IDestroyOptions,
  Point,
  Texture,
} from 'pixi.js'
import type { Environment } from 'src/environment'
import { AdvancedPoint, Points } from 'src/utils/points'
import { clamp } from 'src/utils/math'
import { CardStack } from 'src/lib/tools/card-stack'

export abstract class GameObject extends AnimatedSprite {
  protected constructor(
    public environment: Environment,
    public name: string,
    textures: Texture[],
  ) {
    super(textures, true)

    this.eventMode = 'dynamic'

    this.on('added', this.onAwake.bind(this))
    this.environment.ticker.add(this.onTick.bind(this))
    this.environment.ticker.addOnce(this.onFirstTick.bind(this))

    this.animationSpeed = 0.1
    this.play()
  }

  public shouldBounceAgainstWalls = true

  public speed = 0.4
  public maxSpeed = 15
  public velocity = new Point()
  public friction = new Point(0.94, 0.94)

  private endPosition?: Point

  abstract onAwake(): void
  abstract onFirstTick(): void

  public onTick(): void {
    if (this.endPosition) {
      // transition towards end position
      const distance = Points.distance(this.position, this.endPosition)
      const direction = Points.direction(this.position, this.endPosition)
      const velocity = new AdvancedPoint(direction.x, direction.y)
        .multiply(Points.fromNumber(this.speed))
        .multiply(Points.fromNumber(distance))
        .multiply(Points.fromNumber(-1))

      this.position.x += velocity.x
      this.position.y += velocity.y
    } else {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }

    this.velocity.x *= this.friction.x
    this.velocity.y *= this.friction.y

    // clamp max speed
    this.velocity.x = clamp(this.velocity.x, -this.maxSpeed, this.maxSpeed)
    this.velocity.y = clamp(this.velocity.y, -this.maxSpeed, this.maxSpeed)

    if (this.shouldBounceAgainstWalls) {
      this.bounceAgainstWalls()
    }
  }

  public bounceAgainstWalls() {
    const { width, height } = this.environment.engine

    if (this.position.x > width / 2 - this.width / 2) {
      this.position.x = width / 2 - this.width / 2
      this.velocity.x *= -1
    }

    if (this.position.x < -width / 2 + this.width / 2) {
      this.position.x = -width / 2 + this.width / 2
      this.velocity.x *= -1
    }

    if (this.position.y > height / 2 - this.height / 2) {
      this.position.y = height / 2 - this.height / 2
      this.velocity.y *= -1
    }

    if (this.position.y < -height / 2 + this.height / 2) {
      this.position.y = -height / 2 + this.height / 2
      this.velocity.y *= -1
    }
  }

  public moveTo(x: number, y: number) {
    this.endPosition = new Point(x, y)
  }

  public clearMovement() {
    this.endPosition = undefined
  }

  public destroy(_options?: IDestroyOptions | boolean) {
    this.off('added', this.onAwake.bind(this))
    this.environment.ticker.remove(this.onTick.bind(this))
    this.environment.ticker.remove(this.onFirstTick.bind(this))
    super.destroy(_options)
  }
}
