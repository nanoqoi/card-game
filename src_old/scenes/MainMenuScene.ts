import { wait } from 'src/utils/promises'
import { Asset } from 'src/modules/AssetsModule'
import { AnimatedSprite, Point, Sprite } from 'pixi.js'
import { CustomScene } from 'src/scenes/CustomScene'
import { PlacementTileObject } from 'src/objects/PlacementTileObject'
import {
  clubs,
  diamonds,
  hearts,
  PlayingCards,
  spades,
} from 'src/objects/PlayingCardObject'
import { StackPosition } from 'src/objects/CardStack'

export class MainMenuScene extends CustomScene {
  board = new Sprite()
  sortableChildren = true
  isDealing = true

  async onStart() {
    this.alpha = 0

    this.board.texture = this.environment.assets.getTexture(Asset.BOARD)
    this.board.anchor.set(0.5)
    this.add(this.board)

    const createStackable = (initialTextures?: Asset[]) => {
      const placement = new PlacementTileObject(this, initialTextures)
      placement.isImmovable = true
      placement.isDraggable = false
      placement.initialStackingOffset = new Point(0, 0)
      placement.stackingOffset = new Point(0, 15)
      placement.hideCardsInStack = true
      placement.canPullFromTopOnly = true
      return placement
    }

    const everyPossibleCard = [
      ...Object.values(PlayingCards)
        .map((cards) => cards.map((card) => new card(this)))
        .flat()
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5)
        .map((card) => {
          card.mustReturnToPreviousStack = true
          return card
        }),
      ...Object.values(PlayingCards)
        .map((cards) => cards.map((card) => new card(this)))
        .flat()
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5)
        .map((card) => {
          card.mustReturnToPreviousStack = true
          return card
        }),
    ]

    const holders = [
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
    ]

    const stackables = [
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
      createStackable(),
    ]

    const cardsToAddForEach = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5]
    const suits = [hearts, spades, diamonds, clubs]
    const deck = createStackable([Asset.CARD_FLIP1])

    holders.forEach((holder, index) => {
      holder.x = index * 60 - 270
      holder.y = -100

      holder.maxAllowedInStack = 13
      holder.stackingOffset = new Point(0, -8)

      const suit = suits[index % suits.length]

      holder.item = new AnimatedSprite(
        suit.faces.map((face) => this.environment.assets.getTexture(face)),
      )
      holder.item.anchor.set(0.5)
      holder.item.animationSpeed = 0.1
      holder.item.play()
      holder.addChild(holder.item)

      holder.stackType = suit.name
      holder.canStackOnlySameType = true

      this.add(holder)
    })

    // const current = createStackable()
    // current.x = -270
    // current.y = -100

    // current.stackingOffset = new Point(0, -8)

    // this.add(current)

    deck.x = 270
    deck.y = -100

    deck.canBeStackedOn = false

    deck.stackingOffset = new Point(0, 0)
    deck.eventMode = 'dynamic'

    deck.on('pointerdown', async () => {
      if (this.isDealing) {
        return
      }

      this.isDealing = true

      for (let i = 0; i < stackables.length; i++) {
        const stackable = stackables[i]
        const card = everyPossibleCard.pop()
        if (card) {
          card.position.set(deck.position.x, deck.position.y)
          this.add(card)
          card.hasBeenTouched = true
          stackable.add(card, StackPosition.TOP, true)
          card.mustReturnToPreviousStack = true
          await wait(120)
        }
      }

      this.isDealing = false

      // if (card && current.stack.length < 10) {
      //   card.position.set(deck.position.x, deck.position.y)
      //   this.add(card)
      //   card.hasBeenTouched = true
      //   current.add(card, StackPosition.TOP, true)
      //   card.mustReturnToPreviousStack = true
      // }

      if (everyPossibleCard.length === 0) {
        deck.mesh.textures = holders[0].mesh.textures
        deck.mesh.animationSpeed = 0.1
        deck.mesh.play()
      }
    })

    for (let index = 0; index < stackables.length; index++) {
      const stackable = stackables[index]

      stackable.x = index * 60 - 270
      stackable.y = 0

      this.add(stackable)

      stackable.canStackOnlySameSuit = true
      stackable.canStackOnlyInSequence = true
    }

    const addRowOfCards = async (): Promise<void> => {
      for (let index = 0; index < stackables.length; index++) {
        const stackable = stackables[index]
        const cardsLeft = cardsToAddForEach[index]
        if (cardsLeft > 0) {
          const card = everyPossibleCard.pop()
          if (card) {
            card.position.set(deck.position.x, deck.position.y)
            this.add(card)
            stackable.stackSuit = card.stackSuit
            stackable.add(card, StackPosition.TOP, true)
            card.onStart = card.onStart.bind(card, false)
            card.setVisible(false)
            cardsToAddForEach[index]--
            if (cardsToAddForEach[index] === 0) {
              card.setVisible(true)
            }
            await wait(60)
          }
        }
      }

      if (cardsToAddForEach.some((cardsLeft) => cardsLeft > 0)) {
        return addRowOfCards()
      }
    }

    this.add(deck)

    await addRowOfCards()

    for (const stackable of stackables) {
      stackable.top.hasBeenTouched = true
    }

    this.isDealing = false
  }

  onUpdate(dt: number) {
    this.position.set(
      this.engine.renderer.width / 2,
      this.engine.renderer.height / 2,
    )

    if (this.isLoading) {
      this.alpha += 0.05
    }

    this.board.width = this.engine.renderer.width
    this.board.height = this.engine.renderer.height
  }

  async onBeforeActive() {
    await super.onBeforeActive()
    await wait(500)
  }
}
