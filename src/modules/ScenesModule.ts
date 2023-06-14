import { BaseModule } from 'src/modules/BaseModule'
import { CertainMap } from 'src/utils/certain-map'
import type { CustomScene } from 'src/scenes/CustomScene'
import { LoadingScene } from 'src/scenes/LoadingScene'
import { MainMenuScene } from 'src/scenes/MainMenuScene'

export enum Scenes {
  LOADING = 'Loading',
  MAIN_MENU = 'Main Menu',
  GAME = 'Game',
  ERROR_SCREEN = 'Error Screen',
}

export class ScenesModule extends BaseModule {
  public static Scenes = Scenes

  public scenes = new CertainMap<Scenes, CustomScene>()
  private _activeScene!: CustomScene

  public async initialize() {
    // Add scenes
    this.add(Scenes.LOADING, new LoadingScene(this.environment))
    this.add(Scenes.MAIN_MENU, new MainMenuScene(this.environment))

    await super.initialize()
  }

  public add(name: Scenes, scene: CustomScene) {
    return this.scenes.set(name, scene)
  }

  public get(name: Scenes) {
    return this.scenes.get(name)
  }

  public async setActive(name: Scenes) {
    if (this.active) {
      await this.active.onBeforeInactive()
      this.active.isUnloaded = true
    }
    this.active = this.scenes.get(name)
    this.environment.engine.stage.removeChildren()
    this.environment.engine.stage.addChild(this.active)
    await this.active.onBeforeActive()
  }

  public get active() {
    return this._activeScene
  }

  public set active(scene: CustomScene) {
    this._activeScene = scene
  }
}
