import dayjs from 'dayjs';

import createDateFormatter from './DateFormatter';

const MonthlyDateFormatter = createDateFormatter({
  ticksX: (data) => [data[0].x, data[data.length - 1].x],

  formatXAxis: (value) => dayjs(value).format('MMM DD'),
});

export default MonthlyDateFormatter;
