import { TextStyle } from 'pixi.js'

export const textStyles = {
  title(color: number) {
    return new TextStyle({
      fill: color,
      fontSize: 32,
      fontFamily: 'pixelFJ8pt1',
    })
  },
  medium(color: number) {
    return new TextStyle({
      fill: color,
      fontSize: 12,
      fontFamily: 'pixelFJ8pt1',
    })
  },
  small(color: number) {
    return new TextStyle({
      fill: color,
      fontSize: 8,
      fontFamily: 'pixelFJ8pt1',
    })
  },
}
