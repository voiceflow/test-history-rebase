import { Utils } from '@voiceflow/realtime-sdk';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(minMax);
dayjs.extend(advancedFormat);

export const { getCurrentTimestamp, getTimeDuration, getAbbrevatedFormat } = Utils.time;
