import { Pair, Point } from '@/types';

const applyCCWRotationMatrix = ([x, y]: Pair<number>, angle: number) => {
  return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
};

const applyCWRotationMatrix = ([x, y]: Pair<number>, angle: number) => {
  return [x * Math.cos(angle) + y * Math.sin(angle), -x * Math.sin(angle) + y * Math.cos(angle)];
};

export const mapToRotatedCoords = applyCWRotationMatrix;
export const mapToUnrotatedCoords = applyCCWRotationMatrix;

export const rotateVectorCW = (pos: Point, axis: Point, angle: number): Pair<number> => {
  const mappedPos: Pair<number> = [pos[0] - axis[0], pos[1] - axis[1]];

  // Rotation matrices work under Cartesian coordinate systems as defined in mathematics,
  // which has "up" defined as positive. Window coordinates has "up" defined
  // as negative, and because of this, what appears to be clockwise rotation on the
  // screen is actually counterclockwise rotation in these calculations.
  const rotatedMappedPos = applyCCWRotationMatrix(mappedPos, angle);

  const delta = [rotatedMappedPos[0] - mappedPos[0], rotatedMappedPos[1] - mappedPos[1]];

  return [pos[0] + delta[0], pos[1] + delta[1]];
};

export const getCenter = ([left, top]: Pair<number>, [width, height]: Pair<number>): Point => [left + width / 2, top + height / 2];

export const getVector = ([finalX, finalY]: Pair<number>, [initialX, initialY]: Pair<number>): Pair<number> => [finalX - initialX, finalY - initialY];

export const sub = ([x1, y1]: Pair<number>, [x2, y2]: Pair<number>) => [x2 - x1, y2 - y1] as Pair<number>;
