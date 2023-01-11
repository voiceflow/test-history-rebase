import dayjs from 'dayjs';

import createDateFormatter from './DateFormatter';

const WeeklyDateFormatter = createDateFormatter({
  ticksX: (data) => data.map((datum) => datum.x),

  styleXAxis: (value) => {
    const date = new Date(value);

    return date.getDate() === 1 ? { fill: '#62778c' } : {};
  },

  formatXAxis: (value) => {
    const date = new Date(value);
    const dayOfMonth = date.getDate();

    if (dayOfMonth === 1) {
      return dayjs(date).format('MMM');
    }

    return dayjs(date).format('DD');
  },
});

export default WeeklyDateFormatter;
