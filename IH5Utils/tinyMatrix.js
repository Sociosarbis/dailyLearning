export const RAD_TO_ANGLE = 180 / Math.PI
export class Point2 {
  constructor({ x, y }) {
    this.x = x
    this.y = y
  }

  normalize() {
    const hypot = Math.hypot(this.x, this.y)
    this.x /= hypot
    this.y /= hypot
    return this
  }

  add({ x, y }) {
    this.x += x
    this.y += y
    return this
  }

  multiplyScalar(n) {
    this.x *= n
    this.y *= n
    return this
  }
}

export class Matrix3 {
  constructor({ a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0 } = {}) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.tx = tx
    this.ty = ty
  }

  translate({ x = 0, y = 0 } = {}) {
    this.tx += this.a * x + this.c * y
    this.ty += this.b * x + this.d * y
    return this
  }

  rotate(rad) {
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const nextA = this.a * cos + this.c * sin
    const nextC = -this.a * sin + this.c * cos
    const nextB = this.b * cos + this.d * sin
    const nextD = -this.b * sin + this.d * cos
    this.a = nextA
    this.b = nextB
    this.c = nextC
    this.d = nextD
    return this
  }

  skewY(y) {
    const tanY = Math.tan(y)
    this.a += this.c * tanY
    this.b += this.d * tanY
    return this
  }

  skewX(x) {
    const tanX = Math.tan(x)
    this.c += this.a * tanX
    this.d += this.b * tanX
    return this
  }

  scale({ x = 1, y = 1 } = {}) {
    this.a *= x
    this.c *= y
    this.b *= x
    this.d *= y
    return this
  }

  dot({ a, b, c, d, tx, ty }) {
    const nextA = this.a * a + this.c * b
    const nextC = this.a * c + this.c * d
    const nextTx = this.a * tx + this.c * ty + this.tx
    const nextB = this.b * a + this.d * b
    const nextD = this.b * c + this.d * d
    const nextTy = this.b * tx + this.d * ty + this.ty
    this.a = nextA
    this.b = nextB
    this.c = nextC
    this.d = nextD
    this.tx = nextTx
    this.ty = nextTy
    return this
  }

  det() {
    return this.a * this.d - this.c * this.b
  }

  inv() {
    const det = this.det()
    const a = this.d / det
    const c = -this.c / det
    const tx = (this.c * this.ty - this.d * this.tx) / det
    const b = -this.b / det
    const d = this.a / det
    const ty = (-this.a * this.ty + this.b * this.tx) / det
    return new Matrix3({ a, b, c, d, tx, ty })
  }

  set({ a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0 } = {}) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.tx = tx
    this.ty = ty
  }

  apply({ x = 0, y = 0 } = {}) {
    const nextX = this.a * x + this.c * y + this.tx
    const nextY = this.b * x + this.d * y + this.ty
    return new Point2({ x: nextX, y: nextY })
  }

  toCSS() {
    const { a, b, c, d, tx, ty } = this
    return `matrix(${a},${b},${c},${d},${tx},${ty})`
  }

  toArr() {
    const { a, b, c, d, tx, ty } = this
    return [[a, c, tx], [b, d, ty], [0, 0, 1]]
  }

  isIdentity() {
    const { a, b, c, d, tx, ty } = this
    return a === 1 && d === 1 && c === 0 && b === 0 && tx === 0 && ty === 0
  }
}
