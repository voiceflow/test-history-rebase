import { PathPoints } from '@/types';

export const buildHeadID = (id: string): string => `#head-${id}`;

export const buildHeadMarker = (id: string): string => `url(${buildHeadID(id)})`;

export interface MarkerAttrs {
  orient: string;
}

const TOP_MARKER_ATTRS = { orient: '90deg' };
const DEFAULT_MARKER_ATTRS = { orient: '0deg' };
const REVERTED_MARKER_ATTRS = { orient: '180deg' };

const getStraightMarkerAttrs = (points: PathPoints): MarkerAttrs => {
  const point = points[points.length - 1];

  if (point.toTop) {
    return TOP_MARKER_ATTRS;
  }

  return point.reversed ? REVERTED_MARKER_ATTRS : DEFAULT_MARKER_ATTRS;
};

export const getMarkerAttrs = (points: PathPoints | null, { isStraight }: { isStraight: boolean }): MarkerAttrs =>
  !points || !isStraight ? DEFAULT_MARKER_ATTRS : getStraightMarkerAttrs(points);
