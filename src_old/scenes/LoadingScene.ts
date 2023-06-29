import { CustomScene } from 'src/scenes/CustomScene'
import { Sprite, Text } from 'pixi.js'
import { Asset } from 'src/modules/AssetsModule'
import { Scenes } from 'src/modules/ScenesModule'
import { wait } from 'src/utils/promises'

export class LoadingScene extends CustomScene {
  text = new Text('Loading...', {
    fill: 0xffffff,
  })
  spinner!: Sprite

  timeout: ReturnType<typeof setTimeout> = 0

  onStart() {
    this.spinner = Sprite.from(
      this.environment.assets.getTexture(Asset.LOADING_SPINNER),
    )

    this.text.anchor.set(0.5)

    this.spinner.anchor.set(0.5)

    this.add(this.text)
    this.add(this.spinner)

    this.timeout = setTimeout(
      () => this.environment.scenes.setActive(Scenes.MAIN_MENU),
      1000,
    )
  }

  onUpdate(dt: number) {
    this.spinner.rotation += 0.05

    if (this.spinner.rotation > Math.PI * 2) {
      this.spinner.rotation = 0
    }

    this.position.set(
      this.engine.renderer.width / 2,
      this.engine.renderer.height / 2,
    )

    if (this.isUnloading) {
      this.alpha -= 0.05
    }
  }

  async onBeforeInactive() {
    await super.onBeforeInactive()
    clearTimeout(this.timeout)
    await wait(500)
  }
}
