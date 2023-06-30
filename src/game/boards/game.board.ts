import type { Environment } from 'src/environment'
import { Board } from 'src/registers/board.register'
import { Graphics, Sprite, Text } from 'pixi.js'
import { textStyles } from 'src/utils/text-styles'
import { CardObject } from 'src/game/objects/card.object'

const suits = ['spades', 'hearts', 'diamonds', 'clubs']

const values = [
  'ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'jack',
  'queen',
  'king',
]

export class GameBoard extends Board {
  constructor(environment: Environment) {
    super(environment, 'game')
  }

  public cards: CardObject[] = []
  public currentZ = 0

  async onInitialize() {
    for (const suit of suits) {
      for (const value of values) {
        const isDark = suit === 'spades' || suit === 'clubs'
        const darkVal = isDark ? 'dark' : ''
        const card = this.add(
          new CardObject(this, this.environment, 'card', [
            [
              `card_${value}_${darkVal}1`,
              `card_${value}_${darkVal}2`,
              `card_${value}_${darkVal}3`,
            ],
            [`card_${suit}1`, `card_${suit}2`, `card_${suit}3`],
          ]),
        )

        this.cards.push(card)
        this.cards[0].stack.add(card)

        card.zIndex = this.currentZ

        this.currentZ++
      }
    }
  }

  async onFirstTick() {
    this.position = this.environment.engine.center

    let index = 0
    for (const card of this.cards) {
      card.anchor.set(0.5)
      card.position.set(0, index * 5)
      index++
    }
  }

  onTick(delta: number) {}

  onResize() {
    this.position = this.environment.engine.center
  }
}
