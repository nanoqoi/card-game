import { Point } from 'pixi.js'

export class AdvancedPoint extends Point {
  distanceTo(point: Point) {
    return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2)
  }

  subtract(point: Point) {
    return new AdvancedPoint(this.x - point.x, this.y - point.y)
  }

  add(point: Point) {
    return new AdvancedPoint(this.x + point.x, this.y + point.y)
  }

  multiply(point: Point) {
    return new AdvancedPoint(this.x * point.x, this.y * point.y)
  }

  divide(point: Point) {
    return new AdvancedPoint(this.x / point.x, this.y / point.y)
  }

  normalize() {
    const length = this.distanceTo(new Point(0, 0))
    return new AdvancedPoint(this.x / length, this.y / length)
  }

  within(point: Point, distance: number) {
    return this.distanceTo(point) <= distance || this.equals(point)
  }

  static fromAngle(angle: number, length: number) {
    return new AdvancedPoint(Math.cos(angle) * length, Math.sin(angle) * length)
  }

  static from(point: Point) {
    return new AdvancedPoint(point.x, point.y)
  }

  static fromDirection(direction: Point, length: number) {
    return new AdvancedPoint(direction.x * length, direction.y * length)
  }
}

export class Points {
  static fromNumber(value: number) {
    return new AdvancedPoint(value, value)
  }

  static distance(a: Point, b: Point) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
  }

  static subtract(a: Point, b: Point) {
    return new AdvancedPoint(a.x - b.x, a.y - b.y)
  }

  static direction(a: Point, b: Point) {
    const distance = Points.distance(a, b)
    return new AdvancedPoint((a.x - b.x) / distance, (a.y - b.y) / distance)
  }

  static angle(a: Point, b: Point) {
    return Math.atan2(b.y - a.y, b.x - a.x)
  }

  static multiply(a: Point, b: Point) {
    return new AdvancedPoint(a.x * b.x, a.y * b.y)
  }

  static add(a: Point, b: Point) {
    return new AdvancedPoint(a.x + b.x, a.y + b.y)
  }
}
