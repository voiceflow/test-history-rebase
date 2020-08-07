import { Pair, Point } from '@/types';

import { Coords } from './geometry';

/**
 * Computes the centre-point of an unrotated quadrilateral with given `topleft` corner
 * and `size` (its width and height).
 *
 * @param topleft The top-left corner of the quadrilteral
 * @param size The width and height of the quadrilateral
 */
export const getCenter = ([left, top]: Point, [width, height]: Pair<number>): Point => [left + width / 2, top + height / 2];

/**
 * Given a vector/point `vec` and an `angle`, rotates the `vec` about the origin of its coordinate
 * system counterclockwise by `angle` radians, and returns the coordinates of the resulting
 * mapped point.
 *
 * @param vec the vector / point that must be rotated
 * @param angle the amount (in radians) to rotate counter-clockwise
 */
const applyCCWRotationMatrix = ([x, y]: Point, angle: number): Point => {
  /**
   * We matrix multiply the point [x, y] by a counter-clockwise Rotation Matrix where theta = `angle` to
   * obtain the coordinates of the rotated point.
   *
   * See here: https://en.wikipedia.org/wiki/Rotation_matrix
   */
  return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
};

/**
 * Rotates the point `pos` about the given `axis` clockwise by the given `angle`. To use
 * this function, ensure that `pos` and `axis` are part of the same coordinate system, e.g,
 * the browser viewport's coordinate system.
 *
 * @param pos The point that we want to rotate
 * @param axis The axis of rotation for `pos`
 * @param angle The amount (in radians) that we rotate
 */
export const rotateCoordsCW = (pos: Coords, axis: Coords, angle: number) => {
  /**
   * In linear algebra, vectors are always rotated with (0,0) as the axis of rotation.
   *
   * Thus, we implicitly define `axis` to be our origin, then map `pos` so that it is a point
   * relative to axis.
   */
  const mappedPos = pos.sub(axis);

  /**
   * Rotation matrices work under Cartesian coordinate systems as defined in mathematics. This
   * coordinate system defines "up" as positive.
   *
   * The browser defines "down" as positive, and because of this, what we see as clockwise
   * rotation on the screen is mathematically represented by a counter-clockwise rotation.
   *
   * Hence, we apply a CCW rotation matrix to perform a CW rotation.
   */
  const rotatedMappedPos = new Coords(applyCCWRotationMatrix(mappedPos.point, angle), mappedPos.plane);

  /**
   * We determine the displacement needed to move `pos` to `mappedPos` within the coordinate
   * system with `axis` as its origin...
   */
  const delta = rotatedMappedPos.sub(mappedPos);

  /**
   * ...and conveniently, this displacement vector allows us to compute `mappedPos` within the
   * original coordinate system of `pos`.
   */
  return pos.add(delta);
};
