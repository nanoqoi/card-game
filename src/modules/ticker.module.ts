import { Module } from 'src/modules/module'
import { Application, SCALE_MODES, settings, Ticker } from 'pixi.js'
import { PIXEL_SCALE } from 'src/constants'

export class TickerModule extends Module {
  private _ticker = new Ticker()

  public async initialize() {
    await this.load()
  }

  public async load() {
    this._ticker.start()
  }

  public async unload() {
    this._ticker.stop()
  }

  public add(fn: (delta: number) => void) {
    this._ticker.add(fn)
  }

  public addOnce(fn: (delta: number) => void) {
    this._ticker.addOnce(fn)
  }

  public remove(fn: (delta: number) => void) {
    this._ticker.remove(fn)
  }

  public get raw() {
    return this._ticker
  }

  public get delta() {
    return this._ticker.deltaMS
  }

  public get elapsed() {
    return this._ticker.elapsedMS
  }
}
