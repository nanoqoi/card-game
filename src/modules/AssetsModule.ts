import { BaseModule } from 'src/modules/BaseModule'
import type { Resource, Texture } from 'pixi.js'
import { Assets } from 'pixi.js'
import { sound } from '@pixi/sound'

export enum Asset {
  BOARD = 'board',
  MISSING = 'missing',
  LOADING_SPINNER = 'loading-spinner',

  CARD1 = 'card1',
  CARD2 = 'card2',
  CARD3 = 'card3',

  CARD_OUTLINE1 = 'card-outline1',
  CARD_OUTLINE2 = 'card-outline2',
  CARD_OUTLINE3 = 'card-outline3',

  CARD_PLACEMENT_BORDER1 = 'card-placement-border1',
  CARD_PLACEMENT_BORDER2 = 'card-placement-border2',
  CARD_PLACEMENT_BORDER3 = 'card-placement-border3',

  CARD_POP1 = 'card-pop1',
  CARD_POP2 = 'card-pop2',
  CARD_POP3 = 'card-pop3',
  CARD_POP4 = 'card-pop4',
  CARD_POP5 = 'card-pop5',
  CARD_POP6 = 'card-pop6',

  CARD_ACE1 = 'playing_card_faces/card_ace1',
  CARD_ACE2 = 'playing_card_faces/card_ace2',
  CARD_ACE3 = 'playing_card_faces/card_ace3',
  CARD_ACE_DARK1 = 'playing_card_faces/card_ace_dark1',
  CARD_ACE_DARK2 = 'playing_card_faces/card_ace_dark2',
  CARD_ACE_DARK3 = 'playing_card_faces/card_ace_dark3',
  CARD_2_1 = 'playing_card_faces/card_2_1',
  CARD_2_2 = 'playing_card_faces/card_2_2',
  CARD_2_3 = 'playing_card_faces/card_2_3',
  CARD_2_DARK1 = 'playing_card_faces/card_2_dark1',
  CARD_2_DARK2 = 'playing_card_faces/card_2_dark2',
  CARD_2_DARK3 = 'playing_card_faces/card_2_dark3',
  CARD_3_1 = 'playing_card_faces/card_3_1',
  CARD_3_2 = 'playing_card_faces/card_3_2',
  CARD_3_3 = 'playing_card_faces/card_3_3',
  CARD_3_DARK1 = 'playing_card_faces/card_3_dark1',
  CARD_3_DARK2 = 'playing_card_faces/card_3_dark2',
  CARD_3_DARK3 = 'playing_card_faces/card_3_dark3',
  CARD_4_1 = 'playing_card_faces/card_4_1',
  CARD_4_2 = 'playing_card_faces/card_4_2',
  CARD_4_3 = 'playing_card_faces/card_4_3',
  CARD_4_DARK1 = 'playing_card_faces/card_4_dark1',
  CARD_4_DARK2 = 'playing_card_faces/card_4_dark2',
  CARD_4_DARK3 = 'playing_card_faces/card_4_dark3',
  CARD_5_1 = 'playing_card_faces/card_5_1',
  CARD_5_2 = 'playing_card_faces/card_5_2',
  CARD_5_3 = 'playing_card_faces/card_5_3',
  CARD_5_DARK1 = 'playing_card_faces/card_5_dark1',
  CARD_5_DARK2 = 'playing_card_faces/card_5_dark2',
  CARD_5_DARK3 = 'playing_card_faces/card_5_dark3',
  CARD_6_1 = 'playing_card_faces/card_6_1',
  CARD_6_2 = 'playing_card_faces/card_6_2',
  CARD_6_3 = 'playing_card_faces/card_6_3',
  CARD_6_DARK1 = 'playing_card_faces/card_6_dark1',
  CARD_6_DARK2 = 'playing_card_faces/card_6_dark2',
  CARD_6_DARK3 = 'playing_card_faces/card_6_dark3',
  CARD_7_1 = 'playing_card_faces/card_7_1',
  CARD_7_2 = 'playing_card_faces/card_7_2',
  CARD_7_3 = 'playing_card_faces/card_7_3',
  CARD_7_DARK1 = 'playing_card_faces/card_7_dark1',
  CARD_7_DARK2 = 'playing_card_faces/card_7_dark2',
  CARD_7_DARK3 = 'playing_card_faces/card_7_dark3',
  CARD_8_1 = 'playing_card_faces/card_8_1',
  CARD_8_2 = 'playing_card_faces/card_8_2',
  CARD_8_3 = 'playing_card_faces/card_8_3',
  CARD_8_DARK1 = 'playing_card_faces/card_8_dark1',
  CARD_8_DARK2 = 'playing_card_faces/card_8_dark2',
  CARD_8_DARK3 = 'playing_card_faces/card_8_dark3',
  CARD_9_1 = 'playing_card_faces/card_9_1',
  CARD_9_2 = 'playing_card_faces/card_9_2',
  CARD_9_3 = 'playing_card_faces/card_9_3',
  CARD_9_DARK1 = 'playing_card_faces/card_9_dark1',
  CARD_9_DARK2 = 'playing_card_faces/card_9_dark2',
  CARD_9_DARK3 = 'playing_card_faces/card_9_dark3',
  CARD_10_1 = 'playing_card_faces/card_10_1',
  CARD_10_2 = 'playing_card_faces/card_10_2',
  CARD_10_3 = 'playing_card_faces/card_10_3',
  CARD_10_DARK1 = 'playing_card_faces/card_10_dark1',
  CARD_10_DARK2 = 'playing_card_faces/card_10_dark2',
  CARD_10_DARK3 = 'playing_card_faces/card_10_dark3',
  CARD_JACK1 = 'playing_card_faces/card_jack1',
  CARD_JACK2 = 'playing_card_faces/card_jack2',
  CARD_JACK3 = 'playing_card_faces/card_jack3',
  CARD_JACK_DARK1 = 'playing_card_faces/card_jack_dark1',
  CARD_JACK_DARK2 = 'playing_card_faces/card_jack_dark2',
  CARD_JACK_DARK3 = 'playing_card_faces/card_jack_dark3',
  CARD_QUEEN1 = 'playing_card_faces/card_queen1',
  CARD_QUEEN2 = 'playing_card_faces/card_queen2',
  CARD_QUEEN3 = 'playing_card_faces/card_queen3',
  CARD_QUEEN_DARK1 = 'playing_card_faces/card_queen_dark1',
  CARD_QUEEN_DARK2 = 'playing_card_faces/card_queen_dark2',
  CARD_QUEEN_DARK3 = 'playing_card_faces/card_queen_dark3',
  CARD_KING1 = 'playing_card_faces/card_king1',
  CARD_KING2 = 'playing_card_faces/card_king2',
  CARD_KING3 = 'playing_card_faces/card_king3',
  CARD_KING_DARK1 = 'playing_card_faces/card_king_dark1',
  CARD_KING_DARK2 = 'playing_card_faces/card_king_dark2',
  CARD_KING_DARK3 = 'playing_card_faces/card_king_dark3',

  CARD_HEARTS1 = 'playing_card_faces/card_hearts1',
  CARD_HEARTS2 = 'playing_card_faces/card_hearts2',
  CARD_HEARTS3 = 'playing_card_faces/card_hearts3',
  CARD_CLUBS1 = 'playing_card_faces/card_clubs1',
  CARD_CLUBS2 = 'playing_card_faces/card_clubs2',
  CARD_CLUBS3 = 'playing_card_faces/card_clubs3',
  CARD_SPADES1 = 'playing_card_faces/card_spades1',
  CARD_SPADES2 = 'playing_card_faces/card_spades2',
  CARD_SPADES3 = 'playing_card_faces/card_spades3',
  CARD_DIAMONDS1 = 'playing_card_faces/card_diamonds1',
  CARD_DIAMONDS2 = 'playing_card_faces/card_diamonds2',
  CARD_DIAMONDS3 = 'playing_card_faces/card_diamonds3',

  CARD_FLIP1 = 'card-flip1',
  CARD_FLIP2 = 'card-flip2',
  CARD_FLIP3 = 'card-flip3',
  CARD_FLIP4 = 'card-flip4',

  TREE1 = 'tree1',
  TREE2 = 'tree2',
  TREE3 = 'tree3',

  APPLE1 = 'apple1',
  APPLE2 = 'apple2',
  APPLE3 = 'apple3',
}

export enum Sound {
  CARD_PICKUP_1 = 'card-pickup-1',
  CARD_PICKUP_2 = 'card-pickup-2',
  CARD_PICKUP_3 = 'card-pickup-3',
  CARD_PICKUP_4 = 'card-pickup-4',
  CARD_PICKUP_5 = 'card-pickup-5',

  CARD_DROP_1 = 'card-drop-1',
  CARD_DROP_2 = 'card-drop-2',
  CARD_DROP_3 = 'card-drop-3',
  CARD_DROP_4 = 'card-drop-4',
  CARD_DROP_5 = 'card-drop-5',
}

export class AssetsModule extends BaseModule {
  public sound = sound
  public textures: Record<Asset, Texture<Resource>> = {} as any

  async initialize(): Promise<void> {
    for (const asset of Object.keys(Asset)) {
      const key = asset as keyof typeof Asset
      const enumValue = Asset[key]
      console.log(key, enumValue)
      this.addTexture(enumValue, await Assets.load(`textures/${enumValue}.png`))
    }

    this.addSound(Sound.CARD_PICKUP_1, 'sounds/card-pickup-1.ogg')
    this.addSound(Sound.CARD_PICKUP_2, 'sounds/card-pickup-2.ogg')
    this.addSound(Sound.CARD_PICKUP_3, 'sounds/card-pickup-3.ogg')
    this.addSound(Sound.CARD_PICKUP_4, 'sounds/card-pickup-4.ogg')
    this.addSound(Sound.CARD_PICKUP_5, 'sounds/card-pickup-5.ogg')

    this.addSound(Sound.CARD_DROP_1, 'sounds/card-drop-1.ogg')
    this.addSound(Sound.CARD_DROP_2, 'sounds/card-drop-2.ogg')
    this.addSound(Sound.CARD_DROP_3, 'sounds/card-drop-3.ogg')
    this.addSound(Sound.CARD_DROP_4, 'sounds/card-drop-4.ogg')
    this.addSound(Sound.CARD_DROP_5, 'sounds/card-drop-5.ogg')

    return super.initialize()
  }

  addSound(name: Sound, path: string) {
    sound.add(name, path)
  }

  getSound(name: Sound) {
    return sound.find(name)
  }

  addTexture(name: Asset, texture: Texture<Resource>) {
    this.textures[name] = texture
  }

  getTexture(name: Asset) {
    return this.textures[name]
  }
}
