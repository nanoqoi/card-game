import { Asset } from 'src/modules/AssetsModule'
import { CardType, CardWithFaceObject } from 'src/objects/CardWithFaceObject'

const PlayingCards: Record<
  'hearts' | 'spades' | 'clubs' | 'diamonds',
  Array<ReturnType<typeof CardWithFaceObject>>
> = {
  hearts: [],
  spades: [],
  clubs: [],
  diamonds: [],
}

export const spades = {
  name: 'spades' as CardType,
  faces: [
    // dark
    Asset.CARD_SPADES1,
    Asset.CARD_SPADES2,
    Asset.CARD_SPADES3,
  ],
}

export const clubs = {
  name: 'clubs' as CardType,
  faces: [
    // dark
    Asset.CARD_CLUBS1,
    Asset.CARD_CLUBS2,
    Asset.CARD_CLUBS3,
  ],
}

export const darkSuits = [spades, clubs]

export const hearts = {
  name: 'hearts' as CardType,
  faces: [
    // light
    Asset.CARD_DIAMONDS1,
    Asset.CARD_DIAMONDS2,
    Asset.CARD_DIAMONDS3,
  ],
}

export const diamonds = {
  name: 'diamonds' as CardType,
  faces: [
    // light
    Asset.CARD_HEARTS1,
    Asset.CARD_HEARTS2,
    Asset.CARD_HEARTS3,
  ],
}

export const lightSuits = [hearts, diamonds]

const lightFaces = [
  // light
  [Asset.CARD_ACE1, Asset.CARD_ACE2, Asset.CARD_ACE3],
  [Asset.CARD_2_1, Asset.CARD_2_2, Asset.CARD_2_3],
  [Asset.CARD_3_1, Asset.CARD_3_2, Asset.CARD_3_3],
  [Asset.CARD_4_1, Asset.CARD_4_2, Asset.CARD_4_3],
  [Asset.CARD_5_1, Asset.CARD_5_2, Asset.CARD_5_3],
  [Asset.CARD_6_1, Asset.CARD_6_2, Asset.CARD_6_3],
  [Asset.CARD_7_1, Asset.CARD_7_2, Asset.CARD_7_3],
  [Asset.CARD_8_1, Asset.CARD_8_2, Asset.CARD_8_3],
  [Asset.CARD_9_1, Asset.CARD_9_2, Asset.CARD_9_3],
  [Asset.CARD_10_1, Asset.CARD_10_2, Asset.CARD_10_3],
  [Asset.CARD_JACK1, Asset.CARD_JACK2, Asset.CARD_JACK3],
  [Asset.CARD_QUEEN1, Asset.CARD_QUEEN2, Asset.CARD_QUEEN3],
  [Asset.CARD_KING1, Asset.CARD_KING2, Asset.CARD_KING3],
]

const darkFaces = [
  // dark
  [Asset.CARD_ACE_DARK1, Asset.CARD_ACE_DARK2, Asset.CARD_ACE_DARK3],
  [Asset.CARD_2_DARK1, Asset.CARD_2_DARK2, Asset.CARD_2_DARK3],
  [Asset.CARD_3_DARK1, Asset.CARD_3_DARK2, Asset.CARD_3_DARK3],
  [Asset.CARD_4_DARK1, Asset.CARD_4_DARK2, Asset.CARD_4_DARK3],
  [Asset.CARD_5_DARK1, Asset.CARD_5_DARK2, Asset.CARD_5_DARK3],
  [Asset.CARD_6_DARK1, Asset.CARD_6_DARK2, Asset.CARD_6_DARK3],
  [Asset.CARD_7_DARK1, Asset.CARD_7_DARK2, Asset.CARD_7_DARK3],
  [Asset.CARD_8_DARK1, Asset.CARD_8_DARK2, Asset.CARD_8_DARK3],
  [Asset.CARD_9_DARK1, Asset.CARD_9_DARK2, Asset.CARD_9_DARK3],
  [Asset.CARD_10_DARK1, Asset.CARD_10_DARK2, Asset.CARD_10_DARK3],
  [Asset.CARD_JACK_DARK1, Asset.CARD_JACK_DARK2, Asset.CARD_JACK_DARK3],
  [Asset.CARD_QUEEN_DARK1, Asset.CARD_QUEEN_DARK2, Asset.CARD_QUEEN_DARK3],
  [Asset.CARD_KING_DARK1, Asset.CARD_KING_DARK2, Asset.CARD_KING_DARK3],
]

const cards = [
  {
    suits: darkSuits,
    faces: darkFaces,
  },
  {
    suits: lightSuits,
    faces: lightFaces,
  },
]

for (const { suits, faces } of cards) {
  for (const suit of suits) {
    for (const animatedFaces of faces) {
      PlayingCards[suit.name].push(
        CardWithFaceObject([animatedFaces, suit.faces], suit.name),
      )
    }
  }
}

export { PlayingCards }
