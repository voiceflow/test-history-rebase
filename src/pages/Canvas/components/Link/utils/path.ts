import { BLOCK_WIDTH } from '@/styles/theme';
import { Pair, Point } from '@/types';
import { pathBuilder } from '@/utils/svg';

import { PATH_CURVE_MIN_OFFSET, PATH_INFLECTION_OFFSET, STRAIGHT_PATH_OFFSET, STRAIGHT_PATH_RADIUS } from '../constants';

export const TOP_PORT_OFFSET = 32;
export const HALF_BLOCK_WIDTH = BLOCK_WIDTH / 2;
export const DOUBLE_BLOCK_WIDTH = BLOCK_WIDTH * 2;
export const DOUBLE_STRAIGHT_PATH_OFFSET = STRAIGHT_PATH_OFFSET * 2;

export const buildPath = (
  points: Pair<Point> | null,
  {
    straight = false,
    unconnected = false,
    targetIsBlock = false,
    sourceBlockEndY = null,
  }: {
    straight?: boolean;
    unconnected?: boolean;
    targetIsBlock?: boolean;
    sourceBlockEndY?: number | null;
  }
): string => {
  if (!points) return '';

  return straight ? buildStraightPath(points, { unconnected, targetIsBlock, sourceBlockEndY }) : buildCurvePath(points);
};

const buildCurvePath = (points: Pair<Point>): string => {
  const [[startX, startY], [endX, endY]] = points;

  const inflectionOffset = Math.abs(endY - startY) > PATH_CURVE_MIN_OFFSET ? PATH_INFLECTION_OFFSET : 0;

  return `M ${startX} ${startY} C ${startX + inflectionOffset} ${startY}, ${endX - inflectionOffset} ${endY}, ${endX} ${endY}`;
};

const buildStraightPath = (
  points: Pair<Point>,
  { unconnected, targetIsBlock, sourceBlockEndY }: { unconnected: boolean; targetIsBlock: boolean; sourceBlockEndY: number | null }
): string => (unconnected ? buildStraightUnconnectedPath(points) : buildStraightConnectedPath(points, { targetIsBlock, sourceBlockEndY }));

export const getOffset = (end: number, start: number): number => end - start;

const getRadiusY = (offsetY: number): number => Math.max(Math.min(Math.abs(offsetY) / 2, STRAIGHT_PATH_RADIUS), 0);

const isTargetPortUnderTheSourcePort = (endY: number, startY: number): boolean => endY > startY;

const buildRightZLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetX = getOffset(endX, startX);
  const offsetY = getOffset(endY, startY);
  const radiusY = getRadiusY(offsetY);
  const halfOffsetX = offsetX / 2;
  const halfRadiusY = radiusY / 2;
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const startXWithHalfOffsetX = startX + halfOffsetX;

  return pathBuilder(startX, startY)
    .lineTo(startXWithHalfOffsetX - radiusY, startY)
    .cubicCurveTo(
      [startXWithHalfOffsetX - halfRadiusY, startY],
      [startXWithHalfOffsetX, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startXWithHalfOffsetX, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startXWithHalfOffsetX, endY + (targetUnderSource ? -radiusY : radiusY))
    .cubicCurveTo(
      [startXWithHalfOffsetX, endY + (targetUnderSource ? -halfRadiusY : halfRadiusY)],
      [startXWithHalfOffsetX + halfRadiusY, endY],
      [startXWithHalfOffsetX + radiusY, endY]
    )
    .lineTo(endX, endY)
    .toString();
};

const buildRightSLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetY = getOffset(endY, startY);
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const halfOffsetY = offsetY / 2;
  const startXWithPathOffset = startX + STRAIGHT_PATH_OFFSET;
  const endXWithoutPathOffset = endX - STRAIGHT_PATH_OFFSET;
  const startYWithHalfOffsetY = startY + halfOffsetY;

  let radiusX = Math.max(Math.min(Math.abs(endX - (startX + DOUBLE_STRAIGHT_PATH_OFFSET)) / 2, STRAIGHT_PATH_RADIUS), 0);
  let radiusY = getRadiusY(offsetY);

  if (Math.abs(offsetY) <= STRAIGHT_PATH_OFFSET + STRAIGHT_PATH_RADIUS) {
    radiusX = radiusY < 4 ? 0 : radiusX / 2;
    radiusY = radiusY < 4 ? 0 : radiusY / 2;
  }

  const halfRadiusX = radiusX / 2;
  const halfRadiusY = radiusY / 2;

  return pathBuilder(startX, startY)
    .lineTo(startXWithPathOffset - radiusY, startY)
    .cubicCurveTo(
      [startXWithPathOffset - halfRadiusY, startY],
      [startXWithPathOffset, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startXWithPathOffset, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startXWithPathOffset, startYWithHalfOffsetY + (targetUnderSource ? -radiusX : radiusX))
    .cubicCurveTo(
      [startXWithPathOffset, startYWithHalfOffsetY + (targetUnderSource ? -halfRadiusX : halfRadiusX)],
      [startXWithPathOffset - halfRadiusX, startYWithHalfOffsetY],
      [startXWithPathOffset - radiusX, startYWithHalfOffsetY]
    )
    .lineTo(endXWithoutPathOffset + radiusX, startYWithHalfOffsetY)
    .cubicCurveTo(
      [endXWithoutPathOffset + halfRadiusX, startYWithHalfOffsetY],
      [endXWithoutPathOffset, startYWithHalfOffsetY + (targetUnderSource ? halfRadiusX : -halfRadiusX)],
      [endXWithoutPathOffset, startYWithHalfOffsetY + (targetUnderSource ? radiusX : -radiusX)]
    )
    .lineTo(endXWithoutPathOffset, endY + (targetUnderSource ? -radiusY : radiusY))
    .cubicCurveTo(
      [endXWithoutPathOffset, endY - (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [endXWithoutPathOffset + halfRadiusY, endY],
      [endXWithoutPathOffset + radiusY, endY]
    )
    .lineTo(endX, endY)
    .toString();
};

const buildRightSLikeToTopPath = ([[startX, startY], [endX, endY]]: Pair<Point>, { sourceBlockEndY }: { sourceBlockEndY: number | null }): string => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;

  const offsetY = getOffset(endYWithoutOffset, startY);

  const halfOffsetY = offsetY / 2;
  const startXWithPathOffset = startX + STRAIGHT_PATH_OFFSET;
  const endXWithHalfBlockWidth = endX + HALF_BLOCK_WIDTH;
  let startYWithHalfOffsetY = startY + halfOffsetY;

  if (sourceBlockEndY !== null && startYWithHalfOffsetY < sourceBlockEndY + STRAIGHT_PATH_OFFSET) {
    startYWithHalfOffsetY = Math.min(sourceBlockEndY + STRAIGHT_PATH_OFFSET, endYWithoutOffset - STRAIGHT_PATH_OFFSET);
  }

  let radiusX = Math.max(Math.min(Math.abs(endXWithHalfBlockWidth - (startX + STRAIGHT_PATH_OFFSET)) / 2, STRAIGHT_PATH_RADIUS), 0);
  let radiusY = getRadiusY(offsetY);

  if (Math.abs(offsetY) <= STRAIGHT_PATH_OFFSET + STRAIGHT_PATH_RADIUS) {
    radiusX = radiusY < 4 ? 0 : radiusX / 2;
    radiusY = radiusY < 4 ? 0 : radiusY / 2;
  }

  const halfRadiusX = radiusX / 2;
  const halfRadiusY = radiusY / 2;

  return pathBuilder(startX, startY)
    .lineTo(startXWithPathOffset - radiusY, startY)
    .cubicCurveTo(
      [startXWithPathOffset - halfRadiusY, startY],
      [startXWithPathOffset, startY + halfRadiusY],
      [startXWithPathOffset, startY + radiusY]
    )
    .lineTo(startXWithPathOffset, startYWithHalfOffsetY - radiusX)
    .cubicCurveTo(
      [startXWithPathOffset, startYWithHalfOffsetY - halfRadiusX],
      [startXWithPathOffset - halfRadiusX, startYWithHalfOffsetY],
      [startXWithPathOffset - radiusX, startYWithHalfOffsetY]
    )
    .lineTo(endXWithHalfBlockWidth + radiusX, startYWithHalfOffsetY)
    .cubicCurveTo(
      [endXWithHalfBlockWidth + halfRadiusX, startYWithHalfOffsetY],
      [endXWithHalfBlockWidth, startYWithHalfOffsetY + halfRadiusX],
      [endXWithHalfBlockWidth, startYWithHalfOffsetY + radiusX]
    )
    .lineTo(endXWithHalfBlockWidth, endYWithoutOffset)
    .toString();
};

const buildRightJLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetY = getOffset(endY, startY);
  const radiusY = getRadiusY(offsetY);
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const halfRadiusY = radiusY / 2;
  const endXWithBlockWidth = endX + BLOCK_WIDTH;
  const endXWithBlockWidthAndPathOffset = endXWithBlockWidth + STRAIGHT_PATH_OFFSET;

  return pathBuilder(startX, startY)
    .lineTo(endXWithBlockWidthAndPathOffset - radiusY, startY)
    .cubicCurveTo(
      [endXWithBlockWidthAndPathOffset - halfRadiusY, startY],
      [endXWithBlockWidthAndPathOffset, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [endXWithBlockWidthAndPathOffset, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(endXWithBlockWidthAndPathOffset, endY + (targetUnderSource ? -radiusY : radiusY))
    .cubicCurveTo(
      [endXWithBlockWidthAndPathOffset, endY + (targetUnderSource ? -halfRadiusY : halfRadiusY)],
      [endXWithBlockWidthAndPathOffset - halfRadiusY, endY],
      [endXWithBlockWidthAndPathOffset - radiusY, endY]
    )
    .lineTo(endXWithBlockWidth, endY)
    .toString();
};

const buildRightJLikeToTopPath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;

  const offsetY = getOffset(endYWithoutOffset, startY);
  const radiusY = getRadiusY(offsetY);

  const halfRadiusY = radiusY / 2;
  const endXWithHalfBlockWidth = endX + HALF_BLOCK_WIDTH;

  return pathBuilder(startX, startY)
    .lineTo(endXWithHalfBlockWidth - radiusY, startY)
    .cubicCurveTo(
      [endXWithHalfBlockWidth - halfRadiusY, startY],
      [endXWithHalfBlockWidth, startY + halfRadiusY],
      [endXWithHalfBlockWidth, startY + radiusY]
    )
    .lineTo(endXWithHalfBlockWidth, endYWithoutOffset)
    .toString();
};

const buildLeftJLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetX = getOffset(endX, startX);
  const offsetY = getOffset(endY, startY);
  const radiusY = getRadiusY(offsetY);
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const absOffsetX = Math.abs(offsetX);
  const halfRadiusY = radiusY / 2;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;
  const startEndXWithoutPathOffset = (absOffsetX < BLOCK_WIDTH ? startXWithoutBlockWidth : endX) - STRAIGHT_PATH_OFFSET;

  return pathBuilder(startXWithoutBlockWidth, startY)
    .lineTo(startEndXWithoutPathOffset + radiusY, startY)
    .cubicCurveTo(
      [startEndXWithoutPathOffset + halfRadiusY, startY],
      [startEndXWithoutPathOffset, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startEndXWithoutPathOffset, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startEndXWithoutPathOffset, endY + (targetUnderSource ? -radiusY : radiusY))
    .cubicCurveTo(
      [startEndXWithoutPathOffset, endY + (targetUnderSource ? -halfRadiusY : halfRadiusY)],
      [startEndXWithoutPathOffset + halfRadiusY, endY],
      [startEndXWithoutPathOffset + radiusY, endY]
    )
    .lineTo(endX, endY)
    .toString();
};

const buildLeftJLikeToTopPath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;

  const offsetY = getOffset(endYWithoutOffset, startY);
  const radiusY = getRadiusY(offsetY);

  const halfRadiusY = radiusY / 2;
  const endXWithHalfBlockWidth = endX + HALF_BLOCK_WIDTH;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  return pathBuilder(startXWithoutBlockWidth, startY)
    .lineTo(endXWithHalfBlockWidth + radiusY, startY)
    .cubicCurveTo(
      [endXWithHalfBlockWidth + halfRadiusY, startY],
      [endXWithHalfBlockWidth, startY + halfRadiusY],
      [endXWithHalfBlockWidth, startY + radiusY]
    )
    .lineTo(endXWithHalfBlockWidth, endYWithoutOffset)
    .toString();
};

const buildLeftSLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetY = getOffset(endY, startY);

  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const absOffsetY = Math.abs(offsetY);
  const halfOffsetY = offsetY / 2;
  const endXWithBlockWidth = endX + BLOCK_WIDTH;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  const endXWithBlockWidthAndPathOffset = endXWithBlockWidth + STRAIGHT_PATH_OFFSET;
  const startXWithoutBlockWidthAndPathOffset = startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET;
  const startYWithHalfOffsetY = startY + halfOffsetY;

  let radiusX = Math.max(
    Math.min(Math.abs(endXWithBlockWidth - (startXWithoutBlockWidth - DOUBLE_STRAIGHT_PATH_OFFSET)) / 2, STRAIGHT_PATH_RADIUS),
    0
  );
  let radiusY = getRadiusY(offsetY);

  if (absOffsetY <= STRAIGHT_PATH_OFFSET + STRAIGHT_PATH_RADIUS) {
    radiusX = radiusY < 4 ? 0 : radiusX / 2;
    radiusY = radiusY < 4 ? 0 : radiusY / 2;
  }

  const halfRadiusX = radiusX / 2;
  const halfRadiusY = radiusY / 2;

  return pathBuilder(startXWithoutBlockWidth, startY)
    .lineTo(startXWithoutBlockWidthAndPathOffset + radiusY, startY)
    .cubicCurveTo(
      [startXWithoutBlockWidthAndPathOffset + halfRadiusY, startY],
      [startXWithoutBlockWidthAndPathOffset, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startXWithoutBlockWidthAndPathOffset, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startXWithoutBlockWidthAndPathOffset, startYWithHalfOffsetY + (targetUnderSource ? -radiusX : radiusX))
    .cubicCurveTo(
      [startXWithoutBlockWidthAndPathOffset, startYWithHalfOffsetY + (targetUnderSource ? -halfRadiusX : halfRadiusX)],
      [startXWithoutBlockWidthAndPathOffset + halfRadiusX, startYWithHalfOffsetY],
      [startXWithoutBlockWidthAndPathOffset + radiusX, startYWithHalfOffsetY]
    )
    .lineTo(endXWithBlockWidthAndPathOffset - radiusX, startYWithHalfOffsetY)
    .cubicCurveTo(
      [endXWithBlockWidthAndPathOffset - halfRadiusX, startYWithHalfOffsetY],
      [endXWithBlockWidthAndPathOffset, startYWithHalfOffsetY + (targetUnderSource ? halfRadiusX : -halfRadiusX)],
      [endXWithBlockWidthAndPathOffset, startYWithHalfOffsetY + (targetUnderSource ? radiusX : -radiusX)]
    )
    .lineTo(endXWithBlockWidthAndPathOffset, endY + (targetUnderSource ? -radiusY : radiusY))
    .cubicCurveTo(
      [endXWithBlockWidthAndPathOffset, endY - (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [endXWithBlockWidthAndPathOffset - halfRadiusY, endY],
      [endXWithBlockWidthAndPathOffset - radiusY, endY]
    )
    .lineTo(endXWithBlockWidth, endY)
    .toString();
};

const buildLeftSLikeToTopPath = ([[startX, startY], [endX, endY]]: Pair<Point>, { sourceBlockEndY }: { sourceBlockEndY: number | null }): string => {
  const endYWithoutOffset = endY - TOP_PORT_OFFSET;

  const offsetY = getOffset(endYWithoutOffset, startY);

  const absOffsetY = Math.abs(offsetY);
  const halfOffsetY = offsetY / 2;
  const endXWithHalfBlockWidth = endX + HALF_BLOCK_WIDTH;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  const startXWithoutBlockWidthAndPathOffset = startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET;
  let startYWithHalfOffsetY = startY + halfOffsetY;

  if (sourceBlockEndY !== null && startYWithHalfOffsetY < sourceBlockEndY + STRAIGHT_PATH_OFFSET) {
    startYWithHalfOffsetY = Math.min(sourceBlockEndY + STRAIGHT_PATH_OFFSET, endYWithoutOffset - STRAIGHT_PATH_OFFSET);
  }

  let radiusX = Math.max(Math.min(Math.abs(endXWithHalfBlockWidth - (startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET)) / 2, STRAIGHT_PATH_RADIUS), 0);
  let radiusY = getRadiusY(offsetY);

  if (absOffsetY <= STRAIGHT_PATH_OFFSET + STRAIGHT_PATH_RADIUS) {
    radiusX = radiusY < 4 ? 0 : radiusX / 2;
    radiusY = radiusY < 4 ? 0 : radiusY / 2;
  }

  const halfRadiusX = radiusX / 2;
  const halfRadiusY = radiusY / 2;

  return pathBuilder(startXWithoutBlockWidth, startY)
    .lineTo(startXWithoutBlockWidthAndPathOffset + radiusY, startY)
    .cubicCurveTo(
      [startXWithoutBlockWidthAndPathOffset + halfRadiusY, startY],
      [startXWithoutBlockWidthAndPathOffset, startY + halfRadiusY],
      [startXWithoutBlockWidthAndPathOffset, startY + radiusY]
    )
    .lineTo(startXWithoutBlockWidthAndPathOffset, startYWithHalfOffsetY - radiusX)
    .cubicCurveTo(
      [startXWithoutBlockWidthAndPathOffset, startYWithHalfOffsetY - halfRadiusX],
      [startXWithoutBlockWidthAndPathOffset + halfRadiusX, startYWithHalfOffsetY],
      [startXWithoutBlockWidthAndPathOffset + radiusX, startYWithHalfOffsetY]
    )
    .lineTo(endXWithHalfBlockWidth - radiusX, startYWithHalfOffsetY)
    .cubicCurveTo(
      [endXWithHalfBlockWidth - halfRadiusX, startYWithHalfOffsetY],
      [endXWithHalfBlockWidth, startYWithHalfOffsetY + halfRadiusX],
      [endXWithHalfBlockWidth, startYWithHalfOffsetY + radiusX]
    )
    .lineTo(endXWithHalfBlockWidth, endYWithoutOffset)
    .toString();
};

const buildLeftZLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetY = getOffset(endY, startY);
  const radiusY = getRadiusY(offsetY);
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const halfRadiusY = radiusY / 2;
  const endXWithBlockWidth = endX + BLOCK_WIDTH;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  const halfOffsetX = (startXWithoutBlockWidth - endXWithBlockWidth) / 2;
  const startWithoutBlockWidthAndHalfOffsetX = startXWithoutBlockWidth - halfOffsetX;

  return pathBuilder(startXWithoutBlockWidth, startY)
    .lineTo(startWithoutBlockWidthAndHalfOffsetX + radiusY, startY)
    .cubicCurveTo(
      [startWithoutBlockWidthAndHalfOffsetX + halfRadiusY, startY],
      [startWithoutBlockWidthAndHalfOffsetX, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startWithoutBlockWidthAndHalfOffsetX, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startWithoutBlockWidthAndHalfOffsetX, endY + (targetUnderSource ? -radiusY : radiusY))
    .cubicCurveTo(
      [startWithoutBlockWidthAndHalfOffsetX, endY + (targetUnderSource ? -halfRadiusY : halfRadiusY)],
      [startWithoutBlockWidthAndHalfOffsetX - halfRadiusY, endY],
      [startWithoutBlockWidthAndHalfOffsetX - radiusY, endY]
    )
    .lineTo(endXWithBlockWidth, endY)
    .toString();
};

const buildUnconnectedRightZLikePath = (points: Pair<Point>): string => {
  const [[startX, startY], [endX, endY]] = points;
  const offsetX = getOffset(endX, startX);

  // without end line offset
  if (Math.abs(offsetX) >= DOUBLE_STRAIGHT_PATH_OFFSET) {
    return buildRightZLikePath(points);
  }

  const offsetY = getOffset(endY, startY);
  const radiusY = getRadiusY(offsetY);
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const halfRadiusY = radiusY / 2;
  const startXWithOffset = startX + STRAIGHT_PATH_OFFSET;
  const radiusX = Math.max(Math.min(Math.abs(endX - startXWithOffset) / 2, STRAIGHT_PATH_RADIUS), 0);

  const endRadius = Math.min(radiusX, radiusY);
  const halfEndRadius = endRadius / 2;

  return pathBuilder(startX, startY)
    .lineTo(startXWithOffset - radiusY, startY)
    .cubicCurveTo(
      [startXWithOffset - halfRadiusY, startY],
      [startXWithOffset, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startXWithOffset, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startXWithOffset, endY + (targetUnderSource ? -endRadius : endRadius))
    .cubicCurveTo(
      [startXWithOffset, endY + (targetUnderSource ? -halfEndRadius : halfEndRadius)],
      [startXWithOffset + halfEndRadius, endY],
      [startXWithOffset + endRadius, endY]
    )
    .lineTo(endX, endY)
    .toString();
};

const buildUnconnectedRightJLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetY = getOffset(endY, startY);
  const radiusY = getRadiusY(offsetY);
  const radiusX = Math.max(Math.min(Math.abs(endX - (startX + STRAIGHT_PATH_OFFSET)) / 2, STRAIGHT_PATH_RADIUS), 0);
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const halfRadiusY = radiusY / 2;
  const startXWithPathOffset = startX + STRAIGHT_PATH_OFFSET;

  const endAngleRadius = Math.min(radiusX, radiusY);
  const halfEndAngleRadius = endAngleRadius / 2;

  return pathBuilder(startX, startY)
    .lineTo(startXWithPathOffset - radiusY, startY)
    .cubicCurveTo(
      [startXWithPathOffset - halfRadiusY, startY],
      [startXWithPathOffset, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startXWithPathOffset, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startXWithPathOffset, endY + (targetUnderSource ? -endAngleRadius : endAngleRadius))
    .cubicCurveTo(
      [startXWithPathOffset, endY + (targetUnderSource ? -halfEndAngleRadius : halfEndAngleRadius)],
      [startXWithPathOffset - halfEndAngleRadius, endY],
      [startXWithPathOffset - endAngleRadius, endY]
    )
    .lineTo(endX, endY)
    .toString();
};

const buildUnconnectedLeftJLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetY = getOffset(endY, startY);
  const radiusY = getRadiusY(offsetY);
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const halfRadiusY = radiusY / 2;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;
  const startXWithoutBlockWidthAndPathOffset = startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET;

  const radiusX = Math.max(Math.min(Math.abs(endX - startXWithoutBlockWidthAndPathOffset) / 2, STRAIGHT_PATH_RADIUS), 0);

  const endRadius = Math.min(radiusX, radiusY);
  const halfEndRadius = endRadius / 2;

  return pathBuilder(startXWithoutBlockWidth, startY)
    .lineTo(startXWithoutBlockWidthAndPathOffset + radiusY, startY)
    .cubicCurveTo(
      [startXWithoutBlockWidthAndPathOffset + halfRadiusY, startY],
      [startXWithoutBlockWidthAndPathOffset, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startXWithoutBlockWidthAndPathOffset, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startXWithoutBlockWidthAndPathOffset, endY + (targetUnderSource ? -endRadius : endRadius))
    .cubicCurveTo(
      [startXWithoutBlockWidthAndPathOffset, endY + (targetUnderSource ? -halfEndRadius : halfEndRadius)],
      [startXWithoutBlockWidthAndPathOffset + halfEndRadius, endY],
      [startXWithoutBlockWidthAndPathOffset + endRadius, endY]
    )
    .lineTo(endX, endY)
    .toString();
};

const buildUnconnectedLeftZLikePath = ([[startX, startY], [endX, endY]]: Pair<Point>): string => {
  const offsetY = getOffset(endY, startY);
  const radiusY = getRadiusY(offsetY);
  const targetUnderSource = isTargetPortUnderTheSourcePort(endY, startY);

  const halfRadiusY = radiusY / 2;
  const startXWithoutBlockWidth = startX - BLOCK_WIDTH;

  const halfOffsetX = (startXWithoutBlockWidth - endX) / 2;

  if (halfOffsetX < STRAIGHT_PATH_OFFSET) {
    const startWithoutBlockWidthAndOffset = startXWithoutBlockWidth - STRAIGHT_PATH_OFFSET;

    const radiusX = Math.max(Math.min(Math.abs(endX - startWithoutBlockWidthAndOffset) / 2, STRAIGHT_PATH_RADIUS), 0);

    const endRadius = Math.min(radiusX, radiusY);
    const halfEndRadius = endRadius / 2;

    return pathBuilder(startXWithoutBlockWidth, startY)
      .lineTo(startWithoutBlockWidthAndOffset + radiusY, startY)
      .cubicCurveTo(
        [startWithoutBlockWidthAndOffset + halfRadiusY, startY],
        [startWithoutBlockWidthAndOffset, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
        [startWithoutBlockWidthAndOffset, startY + (targetUnderSource ? radiusY : -radiusY)]
      )
      .lineTo(startWithoutBlockWidthAndOffset, endY + (targetUnderSource ? -endRadius : endRadius))
      .cubicCurveTo(
        [startWithoutBlockWidthAndOffset, endY + (targetUnderSource ? -halfEndRadius : halfEndRadius)],
        [startWithoutBlockWidthAndOffset - halfEndRadius, endY],
        [startWithoutBlockWidthAndOffset - endRadius, endY]
      )
      .lineTo(endX, endY)
      .toString();
  }

  const startWithoutBlockWidthAndHalfOffsetX = startXWithoutBlockWidth - halfOffsetX;

  return pathBuilder(startXWithoutBlockWidth, startY)
    .lineTo(startWithoutBlockWidthAndHalfOffsetX + radiusY, startY)
    .cubicCurveTo(
      [startWithoutBlockWidthAndHalfOffsetX + halfRadiusY, startY],
      [startWithoutBlockWidthAndHalfOffsetX, startY + (targetUnderSource ? halfRadiusY : -halfRadiusY)],
      [startWithoutBlockWidthAndHalfOffsetX, startY + (targetUnderSource ? radiusY : -radiusY)]
    )
    .lineTo(startWithoutBlockWidthAndHalfOffsetX, endY + (targetUnderSource ? -radiusY : radiusY))
    .cubicCurveTo(
      [startWithoutBlockWidthAndHalfOffsetX, endY + (targetUnderSource ? -halfRadiusY : halfRadiusY)],
      [startWithoutBlockWidthAndHalfOffsetX - halfRadiusY, endY],
      [startWithoutBlockWidthAndHalfOffsetX - radiusY, endY]
    )
    .lineTo(endX, endY)
    .toString();
};

export const isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset = ([[, startY], [, endY]]: Pair<Point>): boolean =>
  endY >= startY + DOUBLE_STRAIGHT_PATH_OFFSET + TOP_PORT_OFFSET;

export const isTargetPortWithOffsetToRightOfSourcePort = ([[startX], [endX]]: Pair<Point>): boolean => endX >= startX + STRAIGHT_PATH_OFFSET;

export const isTargetPortWithDoubleOffsetToRightOfSourcePort = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX >= startX + DOUBLE_STRAIGHT_PATH_OFFSET;

export const isTargetPortWithOffsetToRightOfSourceBlockCenter = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX - STRAIGHT_PATH_OFFSET >= startX - HALF_BLOCK_WIDTH;

export const isTargetPortToRightOfSourceBlockCenter = ([[startX], [endX]]: Pair<Point>): boolean => endX >= startX - HALF_BLOCK_WIDTH;

export const isTargetBlockCenterToRightOfStartOfSourceBlock = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX + HALF_BLOCK_WIDTH >= startX - BLOCK_WIDTH;

export const isTargetPortWithOffsetToRightOfStartOfSourceBlock = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX + STRAIGHT_PATH_OFFSET >= startX - BLOCK_WIDTH;

export const isTargetBlockCenterWithOffsetToRightOfStartOfSourceBlock = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX + HALF_BLOCK_WIDTH + STRAIGHT_PATH_OFFSET >= startX - BLOCK_WIDTH;

export const isTargetBlockEndWithDoubleOffsetToRightOfStartOfSourceBlock = ([[startX], [endX]]: Pair<Point>): boolean =>
  endX + DOUBLE_STRAIGHT_PATH_OFFSET >= startX - DOUBLE_BLOCK_WIDTH;

export const isTargetBlockCenterToRightOfSourceBlockCenter = ([[startX], [endX]]: Pair<Point>): boolean => endX >= startX - BLOCK_WIDTH;

const buildStraightConnectedPath = (
  points: Pair<Point>,
  { targetIsBlock, sourceBlockEndY }: { targetIsBlock: boolean; sourceBlockEndY: number | null }
): string => {
  if (isTargetPortWithDoubleOffsetToRightOfSourcePort(points)) {
    return buildRightZLikePath(points);
  }

  if (isTargetPortWithOffsetToRightOfSourceBlockCenter(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return buildRightJLikeToTopPath(points);
    }

    return buildRightSLikePath(points);
  }

  if (isTargetPortToRightOfSourceBlockCenter(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return buildRightSLikeToTopPath(points, { sourceBlockEndY });
    }

    return buildRightJLikePath(points);
  }

  if (isTargetBlockCenterToRightOfStartOfSourceBlock(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return isTargetBlockCenterToRightOfSourceBlockCenter(points)
        ? buildRightSLikeToTopPath(points, { sourceBlockEndY })
        : buildLeftSLikeToTopPath(points, { sourceBlockEndY });
    }

    return buildLeftJLikePath(points);
  }

  if (isTargetBlockEndWithDoubleOffsetToRightOfStartOfSourceBlock(points)) {
    if (targetIsBlock && isTargetPortWithoutTopOffsetUnderSourcePortWithDoubleOffset(points)) {
      return isTargetBlockCenterWithOffsetToRightOfStartOfSourceBlock(points)
        ? buildLeftSLikeToTopPath(points, { sourceBlockEndY })
        : buildLeftJLikeToTopPath(points);
    }

    return buildLeftSLikePath(points);
  }

  return buildLeftZLikePath(points);
};

const buildStraightUnconnectedPath = (points: Pair<Point>): string => {
  if (isTargetPortWithOffsetToRightOfSourcePort(points)) {
    return buildUnconnectedRightZLikePath(points);
  }

  if (isTargetPortToRightOfSourceBlockCenter(points)) {
    return buildUnconnectedRightJLikePath(points);
  }

  if (isTargetPortWithOffsetToRightOfStartOfSourceBlock(points)) {
    return buildUnconnectedLeftJLikePath(points);
  }

  return buildUnconnectedLeftZLikePath(points);
};
