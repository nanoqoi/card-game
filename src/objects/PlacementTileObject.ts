import { Asset } from 'src/modules/AssetsModule'
import { CardStack } from 'src/objects/CardStack'
import type { CustomScene } from 'src/scenes/CustomScene'

export class PlacementTileObject extends CardStack {
  constructor(scene: CustomScene, private initialTextures?: Asset[]) {
    super(scene)
  }

  onStart() {
    super.onStart(false)

    this.name = 'PlacementTileObject'

    this.mesh.textures = (
      this.initialTextures ?? [
        Asset.CARD_PLACEMENT_BORDER1,
        Asset.CARD_PLACEMENT_BORDER2,
        Asset.CARD_PLACEMENT_BORDER3,
      ]
    )
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
