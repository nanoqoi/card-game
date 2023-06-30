import * as PIXI from 'pixi.js'
import { Environment } from 'src/environment'
import { Asset } from 'src/registers/asset.register'
import { LoadingBoard } from 'src/game/boards/loading.board'
import { MainMenuBoard } from 'src/game/boards/main-menu.board'
import { GameBoard } from 'src/game/boards/game.board'

const sounds = [
  'card-drop-1',
  'card-drop-2',
  'card-drop-3',
  'card-drop-4',
  'card-drop-5',
  'card-pickup-1',
  'card-pickup-2',
  'card-pickup-3',
  'card-pickup-4',
  'card-pickup-5',
]

const ui_sounds = [
  'appear-online',
  'click',
  'click2',
  'click3',
  'click4',
  'click5',
  'click6',
  'click7',
  'cut',
  'drop',
  'dustbin',
  'message',
  'snap',
  'snap1',
  'snap2',
]

const textures = [
  // TEMPORARY ASSETS
  'tree1',
  'tree2',
  'tree3',
  'apple1',
  'apple2',
  'apple3',
  // END TEMPORARY ASSETS
  'menu-indicator',
  'menu-indicator-active',
  'board',
  'card1',
  'card2',
  'card3',
  'card-flip1',
  'card-flip2',
  'card-flip3',
  'card-flip4',
  'card-outline1',
  'card-outline2',
  'card-outline3',
  'card-placement-border1',
  'card-placement-border2',
  'card-placement-border3',
  'card-pop1',
  'card-pop2',
  'card-pop3',
  'card-pop4',
  'card-pop5',
  'card-pop6',
  'card-spawn-animation1',
  'card-spawn-animation2',
  'card-spawn-animation3',
  [
    'playing_card_faces',
    [
      'card_2_1',
      'card_2_2',
      'card_2_3',
      'card_2_dark1',
      'card_2_dark2',
      'card_2_dark3',
      'card_3_1',
      'card_3_2',
      'card_3_3',
      'card_3_dark1',
      'card_3_dark2',
      'card_3_dark3',
      'card_4_1',
      'card_4_2',
      'card_4_3',
      'card_4_dark1',
      'card_4_dark2',
      'card_4_dark3',
      'card_5_1',
      'card_5_2',
      'card_5_3',
      'card_5_dark1',
      'card_5_dark2',
      'card_5_dark3',
      'card_6_1',
      'card_6_2',
      'card_6_3',
      'card_6_dark1',
      'card_6_dark2',
      'card_6_dark3',
      'card_7_1',
      'card_7_2',
      'card_7_3',
      'card_7_dark1',
      'card_7_dark2',
      'card_7_dark3',
      'card_8_1',
      'card_8_2',
      'card_8_3',
      'card_8_dark1',
      'card_8_dark2',
      'card_8_dark3',
      'card_9_1',
      'card_9_2',
      'card_9_3',
      'card_9_dark1',
      'card_9_dark2',
      'card_9_dark3',
      'card_10_1',
      'card_10_2',
      'card_10_3',
      'card_10_dark1',
      'card_10_dark2',
      'card_10_dark3',
      'card_ace_1',
      'card_ace_2',
      'card_ace_3',
      'card_ace_dark1',
      'card_ace_dark2',
      'card_ace_dark3',
      'card_jack_1',
      'card_jack_2',
      'card_jack_3',
      'card_jack_dark1',
      'card_jack_dark2',
      'card_jack_dark3',
      'card_king_1',
      'card_king_2',
      'card_king_3',
      'card_king_dark1',
      'card_king_dark2',
      'card_king_dark3',
      'card_queen_1',
      'card_queen_2',
      'card_queen_3',
      'card_queen_dark1',
      'card_queen_dark2',
      'card_queen_dark3',
      'card_clubs1',
      'card_clubs2',
      'card_clubs3',
      'card_diamonds1',
      'card_diamonds2',
      'card_diamonds3',
      'card_hearts1',
      'card_hearts2',
      'card_hearts3',
      'card_spades1',
      'card_spades2',
      'card_spades3',
    ],
  ],
]

const onDOMLoaded = async () => {
  const environment = new Environment()

  // @ts-ignore
  document.body.appendChild(environment.engine.view)

  await environment.initialize()

  // register boards
  environment.boards.register(new LoadingBoard(environment))
  environment.boards.register(new MainMenuBoard(environment))
  environment.boards.register(new GameBoard(environment))

  // register assets
  for (const texture of textures) {
    if (Array.isArray(texture)) {
      for (const asset of texture[1]) {
        environment.assets.register(
          new Asset(asset, `textures/${texture[0]}/${asset}.png`),
        )
      }
    } else {
      environment.assets.register(new Asset(texture, `textures/${texture}.png`))
    }
  }
  for (const sound of sounds) {
    environment.assets.register(new Asset(sound, `sounds/${sound}.ogg`))
  }
  for (const sound of ui_sounds) {
    environment.assets.register(new Asset(sound, `sounds/ui/${sound}.ogg`))
  }

  await environment.start()

  // when the window is blurred
  window.addEventListener('blur', () => {
    // pause the game
    environment.pause()
  })

  // when the window is focused
  window.addEventListener('focus', () => {
    // resume the game
    environment.resume()
  })

  //
  ;(globalThis as any).__PIXI_APP__ = environment.engine
}

;(globalThis as any).PIXI = PIXI

document.addEventListener('DOMContentLoaded', onDOMLoaded)
