import { PieProps } from 'recharts';

const RADIAL_TICK_COUNT = 100;

/**
 * 360° broken up into 100 equally-spaced tick marks
 */
export const RADIAL_TICKS = new Array(RADIAL_TICK_COUNT).fill(360 / RADIAL_TICK_COUNT).reduce<number[]>((acc, angle, index) => {
  acc.push(angle + (acc.length ? acc[index - 1] : 0));

  return acc;
}, []);

// needed to draw the chart starting at 0°
const START_ANGLE_OFFSET = 90;

export const PIE_PROPS: Omit<PieProps, 'ref'> = {
  dataKey: 'value',
  paddingAngle: 1,

  startAngle: START_ANGLE_OFFSET,
  endAngle: 360 + START_ANGLE_OFFSET,
};
