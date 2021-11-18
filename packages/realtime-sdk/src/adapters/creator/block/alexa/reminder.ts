import { NodeData } from '@realtime-sdk/models';
import { transformVariablesFromReadable, transformVariablesToReadable } from '@realtime-sdk/utils/slot';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter, createOutPortsAdapter, nextAndFailOnlyOutPortsAdapter } from '../utils';

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

export const reminderOutPortAdapter = createOutPortsAdapter<NodeData.ReminderBuiltInPorts, NodeData.Reminder>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default reminderDataAdapter;
