import type { Environment } from 'src/environment'
import { Board } from 'src/registers/board.register'
import { Asset } from 'src/registers/asset.register'
import type { Sprite } from 'pixi.js'
import { Text } from 'pixi.js'
import { textStyles } from 'src/utils/text-styles'

export class LoadingBoard extends Board {
  constructor(environment: Environment) {
    super(environment, 'loading', true)
  }

  loading?: Text
  currentAsset?: Text
  spinner?: Sprite

  async onInitialize() {
    this.environment.assets.register(new Asset('pixel', 'fonts/pixel_fj.ttf'))

    this.environment.assets.register(
      new Asset('editundo', 'fonts/editundo.ttf'),
    )

    const asset = new Asset('loading-spinner', 'textures/loading-spinner.png')
    this.environment.assets.register(asset)

    await this.environment.assets.load(asset.name)

    const spinner = asset.toSprite()
    spinner.anchor.set(0.5)
    spinner.position.set(0, -20)
    spinner.scale.set(0.25)

    const loading = new Text('Loading 0%...', textStyles.medium(0xffecd6))

    const currentAsset = new Text('', textStyles.small(0x544e68))

    loading.anchor.set(0.5)
    loading.position.set(0, 20)

    currentAsset.anchor.set(0.5)
    currentAsset.position.set(0, 40)

    this.add(spinner)
    this.add(loading)
    this.add(currentAsset)

    this.spinner = spinner
    this.loading = loading
    this.currentAsset = currentAsset
  }

  async onFirstTick() {
    this.position = this.environment.engine.center
    await this.environment.assets.loadAll()
  }

  private loadingIsComplete = false

  onTick() {
    if (this.loadingIsComplete) {
      return
    }

    if (this.spinner) {
      this.spinner.rotation += 0.05
    }

    if (this.loading) {
      this.loading.text = `Loading ${this.environment.assets.progressAsPercentage}%...`
    }

    if (this.currentAsset) {
      this.currentAsset.text =
        this.environment.assets.currentlyLoadingAsset?.name ?? ''
    }

    if (this.environment.assets.loadingComplete) {
      this.loadingIsComplete = true
      this.environment.boards.switch('main-menu')
    }
  }

  onResize() {
    this.position = this.environment.engine.center
  }
}
