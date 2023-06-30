import { Module } from 'src/modules/module'
import { InteractionManager } from '@pixi/interaction'

export class InteractionModule extends Module {
  private _interactions = new InteractionManager(
    this.environment.engine.renderer,
    {
      autoPreventDefault: true,
    },
  )

  public async initialize() {}
  public async load() {}
  public async unload() {}

  public get raw() {
    return this._interactions
  }

  public get pointer() {
    return this._interactions.eventData.data
  }

  public get position() {
    return {
      global: this.pointer.global,
      local: this.pointer.getLocalPosition,
    } as const
  }
}
