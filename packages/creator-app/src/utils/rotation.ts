import { Pair, Point } from '@/types';

import { Coords } from './geometry';

/**
 * rotation.ts
 *
 * This is a file containing various methods to work with rotated coordinate systems using linear algebra.
 * One of the use-cases for these functions is in the Markup rotation system (see OverlayControls.tsx), in
 * various computations, for example:
 *
 *  - Calculating the transform-origin of a rotated image and the translation required to shift the
 *    transform-origin of the unrotated origin to the rotated transform-origin.
 *
 * The theory behind these functions is based on the idea that matrix multiplication can encode transformations
 * of n-th dimensional space.
 *
 * See 3Blue1Brown's "Essence of Linear Algebra" videos to get an intuitive understanding of why these
 * functions work. The most important videos are chapters 1-4 and 13.
 */

/** ----------------------------------- Type definitions ----------------------------------- */

export enum RotationDirection {
  CW,
  CCW,
}

/** ----------------------------------- Low-level code -----------------------------------
 *
 * These functions are the "workhorses" of the module and perform the main mathematics. Ideally,
 * the abstractions of this module is good enough that you never need to touch this or call it
 * directly.
 *
 */

/**
 * Given a vector/point `vec` and an `angle`, rotates the `vec` about the origin of its coordinate
 * system counterclockwise by `angle` radians, and returns the coordinates of the resulting
 * mapped point.
 *
 * @param vec the vector / point that must be rotated
 * @param angle the amount (in radians) to rotate counter-clockwise
 */
const applyCCWRotationMatrix = ([x, y]: Point, angle: number): Point =>
  /**
   * We matrix multiply the point [x, y] by a counter-clockwise Rotation Matrix where theta = `angle` to
   * obtain the coordinates of the rotated point.
   *
   * See here: https://en.wikipedia.org/wiki/Rotation_matrix
   */
  [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
/**
 * Given a vector/point `vec` and an `angle`, rotates the `vec` about the origin of its coordinate
 * system clockwise by `angle` radians, and returns the coordinates of the resulting
 * mapped point.
 *
 * @param vec the vector / point that must be rotated
 * @param angle the amount (in radians) to rotate clockwise
 */
const applyCWRotationMatrix = (vec: Point, angle: number): Point =>
  /**
   * We matrix multiply the point [x, y] by a clockwise Rotation Matrix where theta = `angle` to
   * obtain the coordinates of the rotated point.
   *
   * See here: https://en.wikipedia.org/wiki/Rotation_matrix (Ctrl-F for "clockwise")
   */
  applyCCWRotationMatrix(vec, -angle);
/** ----------------------------------- API implementations -----------------------------------
 *
 * These functions are the implementations of the API. These functions assume that "up" is the
 * positive vertical axis, rather than "down" being positive, which is what the browser expects.
 *
 * We do the implementation in the "up" direction so that it is less confusing, since mathematically
 * we need to work with positive "up" to apply linear algebra. The API will compensate for the
 * browser defining "down" as positive, before passing off the inputs to the implementation. This
 * separates the concern of correcting for the browser's conventions and the concern of actually
 * performing the computation.
 *
 */

interface RotateCoordsOptions {
  // Determines which direction we perform the rotation in.
  rotation: RotationDirection;
}

const defaultRotateOptions = { rotation: RotationDirection.CW };

/**
 * Same as rotateCoords but assumes "up" is positive rather than "down" is positive.
 */
const _rotateCoords = (pos: Coords, axis: Coords, angle: number, options: RotateCoordsOptions = defaultRotateOptions) => {
  /**
   * In linear algebra, vectors are always rotated with (0,0) as the axis of rotation.
   *
   * Thus, we implicitly define `axis` to be our origin, then map `pos` so that it is a point
   * relative to axis.
   */
  const mappedPos = pos.sub(axis);

  /**
   * Now compute the rotated point by multiplying the vector `pos` with the appropriate rotation matrix.
   */
  const rotatedMappedPos = new Coords(
    options.rotation === RotationDirection.CW ? applyCWRotationMatrix(mappedPos.point, angle) : applyCCWRotationMatrix(mappedPos.point, angle),
    mappedPos.plane
  );

  /**
   * We determine the displacement needed to move `mappedPos` to `rotatedMappedPos` within the coordinate
   * system with `axis` as its origin...
   */
  const delta = rotatedMappedPos.sub(mappedPos);

  /**
   * ...and conveniently, this displacement vector allows us to compute `rotatedMappedPos` within the
   * original coordinate system of `pos`.
   */
  return pos.add(delta);
};

/** ----------------------------------- Utilities -----------------------------------
 *
 * These functions aren't directly related to working with rotated coordinates, but might
 * be helpful when setting up a call to one of the main linear algebra functions.
 *
 */

/**
 * Returns the rotation direction opposite to the given `direction`.
 *
 * @param direction The direction of rotation
 */
const reverseDirection = (direction: RotationDirection) => (direction === RotationDirection.CW ? RotationDirection.CCW : RotationDirection.CW);

/**
 * Computes the centre-point of an unrotated quadrilateral with given `topleft` corner
 * and `size` (its width and height).
 *
 * @param topleft The top-left corner of the quadrilteral
 * @param size The width and height of the quadrilateral
 */
export const getCenter = ([left, top]: Point, [width, height]: Pair<number>): Point => [left + width / 2, top + height / 2];

/** ----------------------------------- API -----------------------------------
 *
 * These functions are what you should be using from this module, if you aren't fully
 * sure how the linear algebra works.
 *
 * NOTE:
 *    Rotation matrices work under Cartesian coordinate systems as defined in mathematics. This
 *    coordinate system defines "up" as positive.
 *
 *    The browser defines "down" as positive, and because of this, what we see as clockwise
 *    rotation on the screen is mathematically represented by a counter-clockwise rotation.
 *
 *    Hence, we apply a CCW rotation matrix to perform a CW rotation.
 *
 *    We apply a CW rotation matrix to apply a CCW rotation.
 *
 *    Therefore, the functions here will invoke `reverseDirection` to compensate for the browser's
 *    quirks, before passing it off to an implementation function that acts as the main workhorse.
 *
 */

/**
 * Rotates the point `pos` about the given `axis` (clockwise by default) by the given `angle`.
 * To use this function, ensure that `pos` and `axis` are part of the same coordinate system, e.g,
 * the browser viewport's coordinate system.
 *
 * Relevant chapters from "Essence of Linear Algebra" are chapters 1-4.
 *
 * @param pos The point that we want to rotate
 * @param axis The axis of rotation for `pos`
 * @param angle The amount (in radians) that we rotate
 * @param options Additional options to modify the function's behaviour.
 */
export const rotateCoords = (pos: Coords, axis: Coords, angle: number, options: RotateCoordsOptions = defaultRotateOptions) =>
  _rotateCoords(pos, axis, angle, {
    ...options,
    rotation: reverseDirection(options.rotation),
  });
