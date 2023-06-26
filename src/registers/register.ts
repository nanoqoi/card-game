import { EnvironmentModule } from 'src/lib/environment.module'

export abstract class Registerable<TRegister extends Register<any>> {
  public abstract register(register: TRegister): void
  public abstract deregister(register: TRegister): void
}

export abstract class Register<
  TModule extends Registerable<any>,
> extends EnvironmentModule {
  private _modules: TModule[] = []

  public register(mod: TModule) {
    mod.register(this)
    this._modules.push(mod)
  }

  public deregister(mod: TModule) {
    mod.deregister(this)
    this._modules = this._modules.filter((m) => m !== mod)
  }

  public get modules() {
    return this._modules
  }

  public get size() {
    return this._modules.length
  }
}
