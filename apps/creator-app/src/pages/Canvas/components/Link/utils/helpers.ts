import { PathPoint, Point } from '@/types';

interface CreatePointData {
  toTop?: boolean;
  locked?: boolean;
  reversed?: boolean;
  allowedToTop?: boolean;
}

export function createPoint(point: Point, data?: CreatePointData): PathPoint;
export function createPoint(x: number, y: number, data?: CreatePointData): PathPoint;
export function createPoint(xOrPoint: Point | number, yOrData: number | CreatePointData = {}, data: CreatePointData = {}): PathPoint {
  if (Array.isArray(xOrPoint)) {
    return {
      point: [xOrPoint[0], xOrPoint[1]],
      toTop: (yOrData as CreatePointData).toTop ?? false,
      locked: (yOrData as CreatePointData).locked ?? false,
      reversed: (yOrData as CreatePointData).reversed ?? false,
      allowedToTop: (yOrData as CreatePointData).allowedToTop ?? false,
    };
  }

  return {
    point: [xOrPoint, yOrData as number],
    toTop: data.toTop ?? false,
    locked: data.locked ?? false,
    reversed: data.reversed ?? false,
    allowedToTop: data.allowedToTop ?? false,
  };
}

export const clonePoint = (pathPoint: PathPoint, data: CreatePointData = {}): PathPoint =>
  createPoint(pathPoint.point, {
    toTop: data.toTop ?? pathPoint.toTop,
    locked: data.locked ?? pathPoint.locked,
    reversed: data.reversed ?? pathPoint.reversed,
    allowedToTop: data.allowedToTop ?? pathPoint.allowedToTop,
  });

export const isEqualPoints = (pathPoint1: PathPoint, pathPoint2: PathPoint): boolean =>
  pathPoint1.point[0] === pathPoint2.point[0] && pathPoint1.point[1] === pathPoint2.point[1];

export const getPoint = ({ point }: PathPoint): Point => point;
export const getPointX = (pathPoint: PathPoint): number => getPoint(pathPoint)[0];
export const getPointY = (pathPoint: PathPoint): number => getPoint(pathPoint)[1];

export const getPointsOffset = (start: number, end: number): number => end - start;
