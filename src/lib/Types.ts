/**
 * Type Utility
 * reference: https://github.com/wellflat/imageprocessing-labs/blob/master/cv/lsd/src/types.js
 * and original code.
 */

/**
 * Vector4
 */
class Vec4 {
    constructor(public x1: number = 0, public y1: number = 0, public x2: number = 0, public y2: number = 0) { }
}

/**
 * Point
 */
class Point {
    constructor(public x: number = 0.0, public y: number = 0.0) { }
}

/**
 * Point Linked List
 */
class PointList {
    p: Point;
    next: PointList | null;

    constructor() {
        this.p = new Point();
        this.next = null;
    }
}

/**
 * Region Point
 */
class RegionPoint {
    constructor(public x: number = 0, public y: number = 0, public angle: number = 0.0, public modgrad: number = 0.0, public used: number | null = null) { }
}

/**
 * Rectangle
 */
class Rect {
    constructor(
        public x1: number = 0, public y1: number = 0, public x2: number = 0, public y2: number = 0,
        public width: number = 0, public height: number = 0, public x: number = 0, public y: number = 0, public theta: number = 0,
        public dx: number = 0, public dy: number = 0, public prec: number = 0, public p: number = 0
    ) { }

    /**
     * @param rect 
     */
    public copy(rect: Rect) {
        this.x1 = rect.x1;
        this.y1 = rect.y1;
        this.x2 = rect.x2;
        this.y2 = rect.y2;
        this.width = rect.width;
        this.height = rect.height;
        this.x = rect.x;
        this.y = rect.y;
        this.theta = rect.theta;
        this.dx = rect.dx;
        this.dy = rect.dy;
        this.prec = rect.prec;
        this.p = rect.p;
    }
}

/**
 * Edge
 */
class Edge {
    p: Point;
    taken: boolean | null;
    constructor() {
        this.p = new Point();
        this.taken = null;
    }
}

/**
 * Color
 */
class Color {
    constructor(public red: number, public green: number, public blue: number, public alpha: number) { }
}


export {
    Vec4, Point, PointList, RegionPoint, Rect, Edge, Color
};