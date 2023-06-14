import { CardEvent, CardObject } from 'src/objects/CardObject'
import { IDestroyOptions, Point } from 'pixi.js'

export enum StackPosition {
  TOP,
  BOTTOM,
}

export enum StackDirection {
  TO_TOP,
  TO_BOTTOM,
}

type Position = StackPosition.TOP | StackPosition.BOTTOM | number

export class CardStack extends CardObject {
  stack: CardStack[] = []
  isInStack = false
  parentStack: CardStack | null = null

  onStart(flip = true) {
    super.onStart(flip)

    this.events.on(CardEvent.DROP, this.handleDropAndStack.bind(this))
    this.events.on(CardEvent.PICKUP, this.handlePickupAndUnstack.bind(this))
  }

  onUpdate(dt: number) {
    super.onUpdate(dt)

    this.alignStack()

    if (this.isImmovable) return

    this.checkBoundsAndMove()
  }

  add(card: CardStack, at: StackPosition) {
    if (at === StackPosition.TOP) {
      this.stack.push(card)
    } else if (at === StackPosition.BOTTOM) {
      this.stack.unshift(card)
    }
    if (card.stack.length > 0) {
      card.stack.forEach((subCard) => {
        card.remove(subCard)
        this.add(subCard, at)
      })
    }
    card.parentStack = this
    card.isInStack = true
  }

  remove(card: CardStack) {
    this.stack = this.stack.filter((c) => c !== card)
    card.parentStack = null
    card.isInStack = false
  }

  addStacks(stacks: CardStack[], at: StackPosition) {
    stacks.forEach((stack) => this.add(stack, at))
  }

  removeStacks(stacks: CardStack[]) {
    stacks.forEach((stack) => this.remove(stack))
  }

  isPartOfStack(card: CardStack): boolean {
    return this.stack.includes(card)
  }

  alignStack() {
    this.stack.forEach((stack, index) => {
      stack.zIndex = index + this.zIndex + 1
      const previous = index === 0 ? this : this.stack[index - 1]
      const pos = Point.from(previous.position.clone())
      const offset =
        this.name === 'PlacementTileObject' ? (index === 0 ? 0 : 20) : 20
      stack.moveTo(pos.x, pos.y + offset)
    })
  }

  getTouchingStacks(
    boundarySize: number,
    filter: (stack: CardStack) => boolean = () => true,
  ): CardStack[] {
    return this.scene.children.filter((object) => {
      if (object === this) return false
      if (object instanceof CardStack) {
        if (!filter(object)) return false
        return this.isTouching(object, boundarySize)
      }
    }) as CardStack[]
  }

  getDistanceToStack(stack: CardStack): number {
    const stackBounds = stack.getBounds()
    const thisBounds = this.getBounds()
    const distance = new Point()
    distance.x = stackBounds.x - thisBounds.x
    distance.y = stackBounds.y - thisBounds.y
    return distance.length
  }

  getClosestStack(
    boundarySize: number,
    filter: (stack: CardStack) => boolean = () => true,
  ): CardStack | null {
    const touchingStacks = this.getTouchingStacks(boundarySize, filter)
    if (touchingStacks.length === 0) return null
    return touchingStacks.reduce((prev, curr) => {
      const prevDistance = this.getDistanceToStack(prev)
      const currDistance = this.getDistanceToStack(curr)
      return prevDistance < currDistance ? prev : curr
    })
  }

  isTouching(stack: CardStack, boundarySize: number): boolean {
    const stackBounds = stack.getBounds()
    const thisBounds = this.getBounds()
    return (
      stackBounds.contains(
        thisBounds.x + boundarySize,
        thisBounds.y + boundarySize,
      ) ||
      stackBounds.contains(
        thisBounds.x + (thisBounds.width - boundarySize),
        thisBounds.y + boundarySize,
      ) ||
      stackBounds.contains(
        thisBounds.x + (thisBounds.width - boundarySize),
        thisBounds.y + (thisBounds.height - boundarySize),
      ) ||
      stackBounds.contains(
        thisBounds.x + boundarySize,
        thisBounds.y + (thisBounds.height - boundarySize),
      )
    )
  }

  checkBoundsAndMove() {
    const touchingStacks = this.getTouchingStacks(
      4,
      (stack) =>
        !stack.isFlipping &&
        !stack.isDragging &&
        !this.isFlipping &&
        !this.isDragging &&
        !this.isInStack &&
        !stack.isInStack &&
        !this.isPartOfStack(stack) &&
        !stack.isPartOfStack(this) &&
        !this.isParentDragging &&
        this.isImmovable &&
        !this.isDraggable &&
        !stack.isParentDragging,
    )

    // move away from each other
    if (touchingStacks.length > 0) {
      for (const stack of touchingStacks) {
        const stackBounds = stack.getBounds()
        const thisBounds = this.getBounds()

        const stackCenter = new Point(
          stackBounds.x + stackBounds.width / 2,
          stackBounds.y + stackBounds.height / 2,
        )
        const thisCenter = new Point(
          thisBounds.x + thisBounds.width / 2,
          thisBounds.y + thisBounds.height / 2,
        )

        const distance = stackCenter.distance(thisCenter)

        const direction = new Point(
          thisCenter.x - stackCenter.x,
          thisCenter.y - stackCenter.y,
        )

        const directionNormalized = new Point(
          direction.x / distance,
          direction.y / distance,
        )

        const projectedNewPosition = new Point(
          this.position.x + directionNormalized.x * 5,
          this.position.y + directionNormalized.y * 5,
        )

        this.moveTo(projectedNewPosition.x, projectedNewPosition.y)
      }
    }
  }

  migrateToStack(stack: CardStack, at: Position) {
    stack.combineWithStack(this, at)
  }

  combineWithStack(stack: CardStack, at: Position) {
    switch (at) {
      case StackPosition.TOP:
        this.add(stack, StackPosition.TOP)
        return
      case StackPosition.BOTTOM:
        this.add(stack, StackPosition.BOTTOM)
        return
      default:
        if (at < 0 || at > this.stack.length) {
          return out.error('Invalid stack position.')
        }
        return
    }
  }

  handleDropAndStack() {
    this.stack.forEach((item) => {
      item.isParentDragging = false
      item.zIndex = 1
    })

    const filter = (stack: CardStack) => {
      if (stack === this) return false
      if (stack.parentStack === this) return false
      if (stack.isPartOfStack(this)) return false
      if (this.isPartOfStack(stack)) return false
      if (stack.isInStack) return false
      if (stack.isFlipping) return false
      if (stack.isDragging) return false
      if (this.isParentDragging) return false
      if (stack.isParentDragging) return false
      return true
    }

    const touching = this.getTouchingStacks(30, filter)
    if (touching.length > 0) {
      const closest = this.getClosestStack(30, filter)
      if (closest && closest !== this) {
        this.migrateToStack(
          closest.isInStack ? closest.parentStack! : closest,
          StackPosition.TOP,
        )
      }
    }
  }

  removeFromParentStack() {
    if (!this.parentStack) return
    this.parentStack.remove(this)
  }

  handlePickupAndUnstack() {
    this.stack.forEach((item) => {
      item.isParentDragging = true
      item.zIndex = 100
    })

    if (this.parentStack) {
      if (this.scene.isPressingShift) {
        this.removeFromParentStack()
      } else {
        const cardsAfterMe = this.parentStack.stack.slice(
          this.parentStack.stack.indexOf(this) + 1,
        )
        if (cardsAfterMe.length === 0) {
          return this.removeFromParentStack()
        }
        for (const card of cardsAfterMe) {
          this.parentStack!.remove(card)
          this.add(card, StackPosition.TOP)
        }
        this.removeFromParentStack()
      }
    }
  }

  destroy(_options?: IDestroyOptions | boolean) {
    this.stack.forEach((item) => item.destroy())
    super.destroy(_options)
  }
}
