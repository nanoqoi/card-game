import 'src/utils/init-globals'
import * as PIXI from 'pixi.js'

import { Environment } from 'src/environment'

const env = new Environment()

const onLoad = async () => {
  await env.initialize()
  await env.start()
}

;(globalThis as any).PIXI = PIXI
;(globalThis as any).__PIXI_APP__ = env.engine

document.addEventListener('DOMContentLoaded', onLoad)
