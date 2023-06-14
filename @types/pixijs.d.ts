import type { ObservablePoint, Point } from 'pixi.js'

declare module 'pixi.js' {
  type ResolvablePoint =
    | Point
    | ObservablePoint
    | { x: number; y: number }
    | [a: number, b: number]
    | number

  interface Point {
    add(resolvable: ResolvablePoint): Point
    subtract(resolvable: ResolvablePoint): Point
    multiply(resolvable: ResolvablePoint): Point
    divide(resolvable: ResolvablePoint): Point
    scale(scalar: number): Point
    normalize(): Point
    magnitude(): number
    distance(resolvable: ResolvablePoint): number
    dot(resolvable: ResolvablePoint): number
    angle(resolvable: ResolvablePoint): number
    clone(): Point
    length: number
  }

  // statics
  namespace Point {
    function from(resolvable: ResolvablePoint): Point
  }
}

export {}
