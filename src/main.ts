import * as PIXI from 'pixi.js'
import { Environment } from 'src/environment'
import { Asset } from 'src/registers/asset.register'
import { LoadingBoard } from 'src/game/boards/loading.board'

const onDOMLoaded = async () => {
  const environment = new Environment()
  await environment.initialize()

  // register boards
  environment.boards.register(new LoadingBoard(environment))

  // register assets
  environment.assets.register(new Asset('apple1', 'textures/apple1.png'))
  environment.assets.register(new Asset('apple2', 'textures/apple2.png'))
  environment.assets.register(new Asset('apple3', 'textures/apple3.png'))

  await environment.start()
  //
  ;(globalThis as any).__PIXI_APP__ = environment.engine
}

;(globalThis as any).PIXI = PIXI

document.addEventListener('DOMContentLoaded', onDOMLoaded)
