import { Point, ResolvablePoint } from 'pixi.js'

const resolveToPoint = (resolvable: ResolvablePoint) => {
  if (typeof resolvable === 'number') {
    return new Point(resolvable, resolvable)
  } else if (Array.isArray(resolvable)) {
    return new Point(resolvable[0], resolvable[1])
  } else if ('x' in resolvable && 'y' in resolvable) {
    return new Point(resolvable.x, resolvable.y)
  } else {
    return new Point(resolvable)
  }
}

Point.prototype.add = function (resolvable: ResolvablePoint) {
  const other = resolveToPoint(resolvable)
  return new Point(this.x + other.x, this.y + other.y)
}

Point.prototype.subtract = function (resolvable: ResolvablePoint) {
  const other = resolveToPoint(resolvable)
  return new Point(this.x - other.x, this.y - other.y)
}

Point.prototype.multiply = function (resolvable: ResolvablePoint) {
  const other = resolveToPoint(resolvable)
  return new Point(this.x * other.x, this.y * other.y)
}

Point.prototype.divide = function (resolvable: ResolvablePoint) {
  const other = resolveToPoint(resolvable)
  return new Point(this.x / other.x, this.y / other.y)
}

Point.prototype.scale = function (scalar: number) {
  return new Point(this.x * scalar, this.y * scalar)
}

Point.prototype.normalize = function () {
  const magnitude = this.magnitude()
  return new Point(this.x / magnitude, this.y / magnitude)
}

Point.prototype.magnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y)
}

Point.prototype.distance = function (resolvable: ResolvablePoint) {
  const other = resolveToPoint(resolvable)
  return Math.sqrt(
    (this.x - other.x) * (this.x - other.x) +
      (this.y - other.y) * (this.y - other.y),
  )
}

Point.prototype.dot = function (resolvable: ResolvablePoint) {
  const other = resolveToPoint(resolvable)
  return this.x * other.x + this.y * other.y
}

Point.prototype.angle = function (resolvable: ResolvablePoint) {
  const other = resolveToPoint(resolvable)
  return Math.atan2(other.y - this.y, other.x - this.x)
}

Point.prototype.clone = function () {
  return new Point(this.x, this.y)
}

Point.from = function (resolvable: ResolvablePoint) {
  return resolveToPoint(resolvable)
}

Object.defineProperty(Point.prototype, 'length', {
  get: function () {
    return this.magnitude()
  },
})

export {}
