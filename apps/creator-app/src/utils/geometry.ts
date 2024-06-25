/* eslint-disable max-classes-per-file */
import type { Pair, Point, Quad } from '@/types';

export interface CartesianPlane {
  origin: Coords;
  scale: number;
  size?: Pair<number>;
}

export const isPointEqual = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

export class Vector {
  static mapMagnitude(value: number, sourceScale: number, targetScale: number) {
    return (value * sourceScale) / targetScale;
  }

  static from(vecOrPoint: Vector | Point, plane: CartesianPlane) {
    return vecOrPoint instanceof Vector ? vecOrPoint.map(plane) : vecOrPoint;
  }

  constructor(
    public point: Point,
    public _plane?: CartesianPlane
  ) {}

  get plane() {
    return this._plane || Coords.WINDOW_PLANE;
  }

  factory(point: Point, plane?: CartesianPlane) {
    return new Vector(point, plane);
  }

  map(plane: CartesianPlane): Point {
    if (plane === this.plane) return this.point;

    const sourceScale = this.plane.scale;
    const targetScale = plane.scale;
    const x = Vector.mapMagnitude(this.point[0], sourceScale, targetScale);
    const y = Vector.mapMagnitude(this.point[1], sourceScale, targetScale);

    return [x, y];
  }

  raw(): Point {
    return this.map(Coords.WINDOW_PLANE);
  }

  transform(transform: (point: Point) => Point, plane: CartesianPlane) {
    return transform(this.map(plane));
  }

  mutate(transform: (point: Point) => Point, plane: CartesianPlane) {
    return this.factory(transform(this.map(plane)), plane);
  }

  add(vector: Vector): this;

  add(delta: Point, plane?: CartesianPlane): this;

  add(vecOrDelta: Vector | Point, plane = this.plane) {
    const [deltaX, deltaY] = Vector.from(vecOrDelta, plane);

    return this.mutate(([originX, originY]) => [originX + deltaX, originY + deltaY], plane);
  }

  sub(vector: Vector): this;

  sub(delta: Point, plane?: CartesianPlane): this;

  sub(vecOrDelta: Vector | Point, plane = this.plane) {
    const [deltaX, deltaY] = Vector.from(vecOrDelta, plane);

    return this.mutate(([originX, originY]) => [originX - deltaX, originY - deltaY], plane);
  }

  dot(vector: Vector): number {
    return this.point[0] * vector.point[0] + this.point[1] * vector.point[1];
  }

  mul(vector: Vector): Vector;

  mul(factor: Pair<number>, plane?: CartesianPlane): Vector;

  mul(vecOrFactor: Vector | Pair<number>, plane = this.plane) {
    const [factorX, factorY] = Vector.from(vecOrFactor, plane);

    return new Vector(
      this.transform(([originX, originY]) => [originX * factorX, originY * factorY], plane),
      plane
    );
  }

  div(vector: Vector): Vector;

  div(factor: Pair<number>, plane?: CartesianPlane): Vector;

  div(vecOrFactor: Vector | Pair<number>, plane = this.plane) {
    const [factorX, factorY] = Vector.from(vecOrFactor, plane);

    return new Vector(
      this.transform(([originX, originY]) => [originX / factorX, originY / factorY], plane),
      plane
    );
  }

  toVector(): Vector {
    return this;
  }

  scalarMul(scalar: number, plane = this.plane) {
    return this.mul([scalar, scalar], plane);
  }

  scalarDiv(scalar: number, plane = this.plane) {
    return this.scalarMul(1 / scalar, plane);
  }

  applyElementwise(fn: (coord: number) => number, plane = this.plane) {
    return this.mutate(([x, y]: Pair<number>) => [fn(x), fn(y)], plane);
  }
}

export class Coords extends Vector {
  static WINDOW_PLANE: CartesianPlane = {
    origin: new Coords([0, 0]),
    scale: 1,
  };

  static mapValue(value: number, sourceScale: number, sourceOffset: number, targetScale: number, targetOffset: number) {
    return (value * sourceScale + sourceOffset - targetOffset) / targetScale;
  }

  factory(point: Point, plane?: CartesianPlane) {
    return new Coords(point, plane);
  }

  map(plane: CartesianPlane): Point {
    if (plane === this.plane) return this.point;

    const sourceScale = this.plane.scale;
    const sourceOrigin = this.plane.origin.raw();
    const targetScale = plane.scale;
    const targetOrigin = plane.origin.raw();
    const x = Coords.mapValue(this.point[0], sourceScale, sourceOrigin[0], targetScale, targetOrigin[0]);
    const y = Coords.mapValue(this.point[1], sourceScale, sourceOrigin[1], targetScale, targetOrigin[1]);

    return [x, y];
  }

  min(point: Coords, plane = this.plane) {
    const [lhsX, lhsY] = this.map(plane);
    const [rhsX, rhsY] = point.map(plane);

    return new Coords([Math.min(lhsX, rhsX), Math.min(lhsY, rhsY)], this.plane);
  }

  onPlane(plane: CartesianPlane) {
    return new Coords(this.map(plane), plane);
  }

  toVector() {
    return new Vector(this.point, this.plane);
  }
}

export abstract class Shape<T extends Coords[] = Coords[]> {
  abstract getPoints(): T;

  abstract fromPoints(points: T): this;

  mapPoints(transform: (coords: Coords) => Coords) {
    return this.fromPoints(this.getPoints().map((point) => transform(point)) as T);
  }
}

export class Quadrilateral extends Shape<Quad<Coords>> {
  constructor(
    public origin: Coords,
    public dimensions: Vector,
    public rotation: number
  ) {
    super();
  }

  getPoints() {
    const [width, height] = this.dimensions.point;

    return [
      this.origin,
      this.origin.add([width, 0], this.dimensions.plane),
      this.origin.add(this.dimensions),
      this.origin.add([0, height], this.dimensions.plane),
    ] as Quad<Coords>;
  }

  fromPoints([topLeft, , bottomRight]: Quad<Coords>) {
    return new Quadrilateral(topLeft, bottomRight.sub(topLeft), 0) as this;
  }
}

export interface Transform {
  apply<T extends Shape>(shape: T): T;
}

export class TranslateTransform implements Transform {
  constructor(private movement: Vector) {}

  apply<T extends Shape>(shape: T) {
    return shape.mapPoints((point) => point.add(this.movement));
  }
}
