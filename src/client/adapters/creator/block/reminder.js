import { textEditorContentAdapter } from '@/client/adapters/textEditor';

import { createBlockAdapter } from './utils';

const reminderBlockAdapter = createBlockAdapter(
  ({ reminder: { reminder_type, text, time, date, timezone, recurrence, recurrenceBool } }) => {
    const isTimer = reminder_type === 'SCHEDULED_RELATIVE';
    return {
      reminderType: isTimer ? 'timer' : 'scheduled',
      text: textEditorContentAdapter.fromDB(text),
      hours: textEditorContentAdapter.fromDB(time.h),
      minutes: textEditorContentAdapter.fromDB(time.m),
      seconds: textEditorContentAdapter.fromDB(time.s),
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
      text: textEditorContentAdapter.toDB(text),
      time: {
        h: textEditorContentAdapter.toDB(hours),
        m: textEditorContentAdapter.toDB(minutes),
        s: textEditorContentAdapter.toDB(seconds),
      },
      date,
      timezone: timezone || 'User Timezone',
      recurrence,
      recurrenceBool,
    },
  })
);

export default reminderBlockAdapter;
