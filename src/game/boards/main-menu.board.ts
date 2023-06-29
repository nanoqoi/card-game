import type { Environment } from 'src/environment'
import { Board } from 'src/registers/board.register'
import { Graphics, Sprite, Text } from 'pixi.js'
import { textStyles } from 'src/utils/text-styles'

export class MainMenuBoard extends Board {
  constructor(environment: Environment) {
    super(environment, 'main-menu')
  }

  private bg = this.add(new Graphics())

  private renderBg() {
    const { bg } = this
    const { width, height, center } = this.environment.engine

    bg.clear()
    bg.beginFill(0x544e68)
    bg.drawRect(-center.x, -center.y, width, height)
    bg.endFill()
  }

  indicators?: {
    left: Sprite
    right: Sprite
  }

  private isPointerDown = false

  async onInitialize() {
    const text = new Text('Untitled Card Game', textStyles.title(0xffecd6))
    text.anchor.set(0.5)
    text.position.set(0, -40)

    const indicator = this.environment.assets.get('menu-indicator')!
    const indicatorTexture = indicator.toTexture()
    const indicatorActiveTexture = this.environment.assets
      .get('menu-indicator-active')!
      .toTexture()

    const sounds = {
      beep: this.environment.assets.get('click2')!.toSound(),
      click: this.environment.assets.get('click')!.toSound(),
    }

    const beep = () => sounds.beep.play()
    const click = () => sounds.click.play()

    addEventListener('mousedown', () => click())

    const colors = {
      default: 0xffd4a3,
      hover: 0xffaa5e,
      active: 0xd08159,
    }

    const indicators = {
      left: indicator.toSprite(),
      right: indicator.toSprite(),
    }

    indicators.left.anchor.set(0.5)
    indicators.right.anchor.set(0.5)

    indicators.right.rotation = Math.PI

    const menu = [
      [
        new Text('Play', textStyles.medium(colors.default)),
        {
          onClick: () => this.environment.boards.switch('game'),
        },
      ],
      [
        new Text('Options', textStyles.medium(colors.default)),
        {
          onClick: () => console.log('click Options'),
        },
      ],
    ] as const

    const setIndicators = (i: number, active: boolean) => {
      const [sprite] = menu[i]

      indicators.left.visible = active
      indicators.right.visible = active
      indicators.left.x = -(
        sprite.x +
        sprite.width / 2 +
        indicators.left.width +
        4
      )
      indicators.right.x =
        sprite.x + sprite.width / 2 + indicators.right.width + 4
      indicators.left.y = sprite.y + 1
      indicators.right.y = sprite.y + 1
    }

    menu.forEach(([item, events], i) => {
      item.eventMode = 'dynamic'

      item.on('click', events.onClick)

      item.on('mouseenter', () => {
        beep()
        item.style.fill = colors.hover
        setIndicators(i, true)
      })

      item.on('mousedown', () => {
        this.isPointerDown = true

        item.style.fill = colors.active

        indicators.left.texture = indicatorActiveTexture
        indicators.right.texture = indicatorActiveTexture

        setIndicators(i, true)
      })

      item.on('mouseup', () => {
        this.isPointerDown = false

        item.style.fill = colors.hover

        indicators.left.texture = indicatorTexture
        indicators.right.texture = indicatorTexture

        setIndicators(i, true)
      })

      item.on('mouseleave', () => {
        item.style.fill = colors.default
        setIndicators(i, false)
      })

      item.anchor.set(0.5)
      item.position.y = i * 20
    })

    this.add(text)
    this.add(indicators.left)
    this.add(indicators.right)

    menu.forEach(([item]) => this.add(item))

    setIndicators(0, false)
    this.indicators = indicators
  }

  async onFirstTick() {
    this.position = this.environment.engine.center
    this.renderBg()
  }

  private _time = 0

  onTick(delta: number) {
    // sine wave move indicators
    if (this.indicators) {
      const { left, right } = this.indicators
      const { x: lx, y: ly } = left
      const { x: rx, y: ry } = right

      const speed = 0.2
      const amplitude = 0.2

      if (!this.isPointerDown) {
        left.position.set(lx + Math.sin(this._time * speed) * amplitude, ly)
        right.position.set(rx - Math.sin(this._time * speed) * amplitude, ry)
      }
    }

    this._time += delta
  }

  onResize() {
    this.position = this.environment.engine.center
    this.renderBg()
  }
}
