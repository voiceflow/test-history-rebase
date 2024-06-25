import type { PathPoint, Point } from '@/types';

interface CreatePointData {
  toTop?: boolean;
  locked?: boolean;
  reversed?: boolean;
  allowedToTop?: boolean;
}

const round = (val: number): number => Math.round((val + Number.EPSILON) * 100) / 100;

export function createPoint(point: Point, data?: CreatePointData): PathPoint;
export function createPoint(x: number, y: number, data?: CreatePointData): PathPoint;
export function createPoint(
  xOrPoint: Point | number,
  yOrData: number | CreatePointData = {},
  data: CreatePointData = {}
): PathPoint {
  if (Array.isArray(xOrPoint)) {
    return {
      point: [round(xOrPoint[0]), round(xOrPoint[1])],
      toTop: (yOrData as CreatePointData).toTop,
      locked: (yOrData as CreatePointData).locked,
      reversed: (yOrData as CreatePointData).reversed,
      allowedToTop: (yOrData as CreatePointData).allowedToTop,
    };
  }

  return {
    point: [round(xOrPoint), round(yOrData as number)],
    toTop: data.toTop,
    locked: data.locked,
    reversed: data.reversed,
    allowedToTop: data.allowedToTop,
  };
}

export const clonePoint = (pathPoint: PathPoint, data: CreatePointData = {}): PathPoint =>
  createPoint(pathPoint.point, {
    toTop: (data.toTop ?? pathPoint.toTop) || undefined,
    locked: (data.locked ?? pathPoint.locked) || undefined,
    reversed: (data.reversed ?? pathPoint.reversed) || undefined,
    allowedToTop: (data.allowedToTop ?? pathPoint.allowedToTop) || undefined,
  });

export const isEqualPoints = (pathPoint1: PathPoint, pathPoint2: PathPoint): boolean =>
  pathPoint1.point[0] === pathPoint2.point[0] && pathPoint1.point[1] === pathPoint2.point[1];

export const getPoint = ({ point }: PathPoint): Point => point;
export const getPointX = (pathPoint: PathPoint): number => getPoint(pathPoint)[0];
export const getPointY = (pathPoint: PathPoint): number => getPoint(pathPoint)[1];

export const getPointsOffset = (start: number, end: number): number => end - start;
