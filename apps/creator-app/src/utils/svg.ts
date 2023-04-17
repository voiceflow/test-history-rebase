import { Point } from '@/types';

export const pathBuilder = (initialX: number, initialY: number) => {
  let str = `M ${initialX} ${initialY}`;

  const api = {
    lineTo: (x: number, y: number) => {
      str += ` L ${x} ${y}`;

      return api;
    },

    moveTo: (x: number, y: number) => {
      str += ` M ${x} ${y}`;

      return api;
    },

    cubicCurveTo: ([startControlX, startControlY]: Point, [endControlX, endControlY]: Point, [endX, endY]: Point) => {
      str += ` C ${startControlX},${startControlY} ${endControlX},${endControlY} ${endX},${endY}`;

      return api;
    },

    toString: () => str,
  };

  return api;
};
