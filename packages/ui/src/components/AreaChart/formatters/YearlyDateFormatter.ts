import dayjs from 'dayjs';

import createDateFormatter from './DateFormatter';

const YearlyDateFormatter = createDateFormatter({
  ticksX: (data) => {
    const [firstDatum] = data;
    const firstDate = dayjs(firstDatum.x);
    const firstOfNextMonth = firstDate.month(firstDate.month() + 1).date(1);

    return Array.from({ length: 12 }, (_, index) => dayjs(firstOfNextMonth).add(index, 'month').toDate().getTime());
  },

  formatXAxis: (value) => dayjs(value).format('MMM'),
});

export default YearlyDateFormatter;
