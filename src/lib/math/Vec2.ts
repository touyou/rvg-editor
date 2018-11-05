export default class Vec2 {
  constructor(public x: number, public y: number) { }

  public get width() { return this.x; }
  public get height() { return this.y; }

  static add(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x - v2.x, v1.y - v2.y);
  }

  static mul(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x * v2.x, v1.y * v2.y);
  }

  static div(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x / v2.x, v1.y / v2.y);
  }
}