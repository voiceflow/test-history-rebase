import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '../../../../models';
import { transformVariablesFromReadable, transformVariablesToReadable } from '../../../../utils/slot';
import { createBlockAdapter } from '../utils';

const reminderDataAdapter = createBlockAdapter<Node.Reminder.StepData, NodeData.Reminder>(
  ({
    reminder: {
      name,
      type,
      text,
      time: { h, m, s },
      date,
      timezone,
      recurrence,
      recurrenceBool,
    },
  }) => ({
    name,
    reminderType:
      type === Node.Reminder.ReminderType.SCHEDULED_RELATIVE ? Node.Reminder.ReminderClientType.TIME : Node.Reminder.ReminderClientType.SCHEDULED,
    text,
    hours: h,
    minutes: m,
    seconds: s,

    date: typeof date === 'string' ? transformVariablesToReadable(date) : date,
    timezone: timezone || 'User Timezone',
    recurrence,
    recurrenceBool,
  }),
  ({ name, reminderType, text, hours, minutes, seconds, date, timezone, recurrence, recurrenceBool }) => {
    const isTimer = reminderType === Node.Reminder.ReminderClientType.TIME;

    return {
      reminder: {
        name,
        type: isTimer ? Node.Reminder.ReminderType.SCHEDULED_RELATIVE : Node.Reminder.ReminderType.SCHEDULED_ABSOLUTE,
        text,
        time: {
          h: hours,
          m: minutes,
          s: seconds,
        },
        ...(!isTimer && {
          date: typeof date === 'string' ? transformVariablesFromReadable(date) : date,
          timezone: timezone === 'User Timezone' ? null : timezone,
        }),
        recurrence,
        recurrenceBool: recurrenceBool || false,
        date: date ?? '',
        timezone: timezone || 'User Timezone',
      },
    };
  }
);

export default reminderDataAdapter;
