import type { CardObject } from 'src/game/objects/card.object'

export class CardStack {
  private _stack: CardObject[] = []

  constructor(public leader: CardObject) {
    this.leader.environment.ticker.add(this.onTick.bind(this))
    this.leader.environment.ticker.addOnce(this.onFirstTick.bind(this))
  }

  public get stack() {
    return this._stack
  }

  public add(card: CardObject) {
    if (this._stack.includes(card) || card === this.leader) return
    card.parentStack = this
    this._stack.push(card)
  }

  public remove(card: CardObject) {
    const index = this._stack.indexOf(card)
    if (index === -1) return
    this._stack.splice(index, 1)
    card.parentStack = null
  }

  public has(card: CardObject) {
    return this._stack.includes(card)
  }

  public get length() {
    return this._stack.length
  }

  public get top() {
    return this._stack[this._stack.length - 1]
  }

  public get bottom() {
    return this.leader
  }

  public get isEmpty() {
    return this._stack.length === 0
  }

  public isLast(card: CardObject) {
    return this.stack[this.length - 1] === card
  }

  public onTick() {
    if (this.isEmpty) return

    this.followTheLeader()
  }

  public onFirstTick() {}

  public followTheLeader() {
    for (let i = 0; i < this.length; i++) {
      const card = this._stack[i]
      const previous = this._stack[i - 1] ?? this.leader

      card.zIndex = previous.zIndex + 1
      card.moveTo(previous.position.x, previous.position.y + 16)
    }
  }

  /**
   * Cut's the stack at the given card and returns the top part of the stack.
   */
  cutAt(card: CardObject) {
    const indexOfCard = this._stack.indexOf(card)
    if (indexOfCard === -1) {
      throw new Error('Card not found in stack')
    }

    this.remove(card)

    const topPart = this._stack.splice(indexOfCard)

    for (const c of topPart) {
      this.remove(c)
      card.stack.add(c)
    }

    return topPart
  }

  /**
   * Cut's the stack at the given index and returns the top part of the stack.
   */
  cutAtIndex(index: number) {
    const card = this._stack[index]
    if (!card) {
      throw new Error('Card not found in stack')
    }

    return this.cutAt(card)
  }
}
