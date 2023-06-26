import { EnvironmentModule } from 'src/lib/environment.module'

export abstract class Module extends EnvironmentModule {
  public abstract load(): Promise<void>
  public abstract unload(): Promise<void>
}
