import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(minMax);
dayjs.extend(relativeTime);
