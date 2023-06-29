import type { Environment } from 'src/environment'

export abstract class EnvironmentModule {
  constructor(public environment: Environment) {}
  abstract initialize(): Promise<void>
}
