import { AlexaNode } from '@voiceflow/alexa-types';

import type { NodeData } from '@/models';
import { transformVariablesFromReadable, transformVariablesToReadable } from '@/utils/slot';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextAndFailOnlyOutPortsAdapter,
  nextAndFailOnlyOutPortsAdapterV2,
} from '../utils';

const reminderDataAdapter = createBlockAdapter<AlexaNode.Reminder.StepData, NodeData.Reminder>(
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
      type === AlexaNode.Reminder.ReminderType.SCHEDULED_RELATIVE
        ? AlexaNode.Reminder.ReminderClientType.TIME
        : AlexaNode.Reminder.ReminderClientType.SCHEDULED,
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
    const isTimer = reminderType === AlexaNode.Reminder.ReminderClientType.TIME;

    return {
      reminder: {
        name,
        type: isTimer
          ? AlexaNode.Reminder.ReminderType.SCHEDULED_RELATIVE
          : AlexaNode.Reminder.ReminderType.SCHEDULED_ABSOLUTE,
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

export const reminderOutPortAdapterV2 = createOutPortsAdapterV2<NodeData.ReminderBuiltInPorts, NodeData.Reminder>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default reminderDataAdapter;
