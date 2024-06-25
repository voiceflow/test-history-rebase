import { SCALE_INCREMENTS, SCALE_MINIMUM } from './constants';
import type { AreaChartDatum } from './types';

const getScale = (value: number, scale = SCALE_MINIMUM): number => {
  const nextScale = SCALE_INCREMENTS.map((increment) => increment * scale).find((scale) => scale > value);

  return nextScale ?? getScale(value, scale * 10);
};

export const getMaxY = (data: AreaChartDatum[]) => {
  const actualMaxY = Math.max(...data.map(({ y }) => y));
  const scaleY = getScale(actualMaxY);

  return Math.ceil(actualMaxY / scaleY) * scaleY;
};
