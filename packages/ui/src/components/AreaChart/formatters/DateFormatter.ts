import dayjs from 'dayjs';

import { AreaChartFormatter } from '../types';

const createDateFormatter = ({
  styleXAxis,
  formatXAxis = String,
  ticksX,
}: {
  styleXAxis?: AreaChartFormatter['axes']['styleX'];
  formatXAxis?: AreaChartFormatter['axes']['formatX'];
  ticksX?: AreaChartFormatter['axes']['ticksX'];
}): AreaChartFormatter => ({
  tooltip: {
    formatX: (value) => dayjs(value).format('D MMM, YYYY'),
    formatY: (value) => value.toLocaleString(),
  },
  axes: {
    ticksX,
    ticksY: (minY, maxY) => {
      const deltaY = (maxY - minY) / 4;

      return Array.from({ length: 5 }, (_, index) => Math.floor(minY + index * deltaY));
    },
    styleX: styleXAxis,
    formatX: formatXAxis,
  },
});

export default createDateFormatter;
