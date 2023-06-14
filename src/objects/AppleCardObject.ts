import { AnimatedSprite } from 'pixi.js'
import { Asset } from 'src/modules/AssetsModule'
import { CardStack } from 'src/objects/CardStack'

export class AppleCardObject extends CardStack {
  item!: AnimatedSprite

  onStart() {
    this.item = new AnimatedSprite(
      [
        this.environment.assets.getTexture(Asset.APPLE1),
        this.environment.assets.getTexture(Asset.APPLE2),
        this.environment.assets.getTexture(Asset.APPLE3),
      ].sort(() => Math.random() - 0.5),
    )

    this.item.anchor.set(0.5)
    this.item.animationSpeed = 0.1
    this.item.play()

    this.mesh.addChild(this.item)

    super.onStart()
  }

  onUpdate(dt: number) {
    super.onUpdate(dt)

    const slowAnimation = 0.03
    const fastAnimation = 0.1

    if (this.isDragging && this.item.animationSpeed !== slowAnimation) {
      this.item.animationSpeed = slowAnimation
      this.mesh.animationSpeed = slowAnimation
    }

    if (!this.isDragging && this.item.animationSpeed !== fastAnimation) {
      this.item.animationSpeed = fastAnimation
      this.mesh.animationSpeed = fastAnimation
    }
  }
}
