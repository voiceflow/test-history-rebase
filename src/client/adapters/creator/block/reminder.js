import { draftJSContentAdapter } from '@/client/adapters/draft';

import { createBlockAdapter } from './utils';

const reminderBlockAdapter = createBlockAdapter(
  ({ reminder: { reminder_type, text, time, date, timezone, recurrence, recurrenceBool } }) => {
    const isTimer = reminder_type === 'SCHEDULED_RELATIVE';
    return {
      reminderType: isTimer ? 'timer' : 'scheduled',
      text: draftJSContentAdapter.fromDB(text),
      hours: draftJSContentAdapter.fromDB(time.h),
      minutes: draftJSContentAdapter.fromDB(time.m),
      seconds: draftJSContentAdapter.fromDB(time.s),
      ...(!isTimer && {
        date,
        timezone: timezone === 'User Timezone' ? null : timezone,
      }),
      recurrence: recurrence || {},
      recurrenceBool: recurrenceBool || false,
    };
  },
  ({ reminderType, text, hours, minutes, seconds, date, timezone, recurrence, recurrenceBool }) => ({
    reminder: {
      reminder_type: reminderType === 'timer' ? 'SCHEDULED_RELATIVE' : 'SCHEDULED_ABSOLUTE',
      text: draftJSContentAdapter.toDB(text),
      time: {
        h: draftJSContentAdapter.toDB(hours),
        m: draftJSContentAdapter.toDB(minutes),
        s: draftJSContentAdapter.toDB(seconds),
      },
      date,
      timezone: timezone || 'User Timezone',
      recurrence,
      recurrenceBool,
    },
  })
);

export default reminderBlockAdapter;
