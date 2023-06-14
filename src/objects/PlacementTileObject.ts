import { Asset } from 'src/modules/AssetsModule'
import { CardStack } from 'src/objects/CardStack'

export class PlacementTileObject extends CardStack {
  onStart() {
    super.onStart(false)

    this.name = 'PlacementTileObject'

    this.mesh.textures = [
      Asset.CARD_PLACEMENT_BORDER1,
      Asset.CARD_PLACEMENT_BORDER2,
      Asset.CARD_PLACEMENT_BORDER3,
    ]
      .map((face) => this.environment.assets.getTexture(face))
      .sort(() => Math.random() - 0.5)

    this.mesh.animationSpeed = 0.1
    this.mesh.play()

    this.addChild(this.mesh)
  }

  onUpdate(dt: number) {
    super.onUpdate(dt)
  }
}
