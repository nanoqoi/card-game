import type { Environment } from 'src/environment'

export interface IBaseModule {
  environment: Environment
  initialize(): Promise<void>
}

export class BaseModule implements IBaseModule {
  protected _isInitialized = false

  constructor(public environment: Environment) {
    out.log(`${this.constructor.name} initialized.`)
  }

  public async initialize() {
    this._isInitialized = true
  }
}
