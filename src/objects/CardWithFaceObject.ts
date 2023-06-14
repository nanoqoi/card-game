import type { Asset } from 'src/modules/AssetsModule'
import { CardStack } from 'src/objects/CardStack'
import { AnimatedSprite } from 'pixi.js'

export const CardWithFaceObject = (faces: Array<Asset[]>) =>
  class extends CardStack {
    item!: AnimatedSprite

    faces: AnimatedSprite[] = []

    onStart() {
      const [first, ...rest] = faces

      this.item = new AnimatedSprite(
        first
          .map((face) => this.environment.assets.getTexture(face))
          .sort(() => Math.random() - 0.5),
      )

      if (rest.length > 0) {
        for (const items of rest) {
          this.faces.push(
            new AnimatedSprite(
              items
                .map((face) => this.environment.assets.getTexture(face))
                .sort(() => Math.random() - 0.5),
            ),
          )
        }
      }

      this.item.anchor.set(0.5)
      this.item.animationSpeed = 0.1
      this.item.play()

      for (const face of this.faces) {
        face.anchor.set(0.5)
        face.animationSpeed = 0.1
        face.play()
      }

      super.onStart()

      this.mesh.addChild(this.item)
      for (const face of this.faces) {
        this.mesh.addChild(face)
      }
    }

    onUpdate(dt: number) {
      super.onUpdate(dt)

      const slowAnimation = 0.03
      const fastAnimation = 0.1

      if (this.isDragging && this.item.animationSpeed !== slowAnimation) {
        this.item.animationSpeed = slowAnimation
        this.mesh.animationSpeed = slowAnimation
        this.faces.forEach((face) => (face.animationSpeed = slowAnimation))
      }

      if (!this.isDragging && this.item.animationSpeed !== fastAnimation) {
        this.item.animationSpeed = fastAnimation
        this.mesh.animationSpeed = fastAnimation
        this.faces.forEach((face) => (face.animationSpeed = fastAnimation))
      }
    }
  }
