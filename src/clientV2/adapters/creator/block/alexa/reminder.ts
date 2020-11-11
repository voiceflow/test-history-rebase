import type { StepData as ReminderData } from '@voiceflow/alexa-types/build/nodes/reminder';
import { ReminderClientType, ReminderType } from '@voiceflow/alexa-types/build/nodes/reminder';
import _ from 'lodash';

import { NodeData } from '@/models';
import { transformVariablesFromReadable, transformVariablesToReadable } from '@/utils/slot';

import { createBlockAdapter } from '../utils';

const reminderDataAdapter = createBlockAdapter<ReminderData, NodeData.Reminder>(
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
    reminderType: type === ReminderType.SCHEDULED_RELATIVE ? ReminderClientType.TIME : ReminderClientType.SCHEDULED,
    text,
    hours: h,
    minutes: m,
    seconds: s,

    date: _.isString(date) ? transformVariablesToReadable(date) : date,
    timezone: timezone || 'User Timezone',
    recurrence,
    recurrenceBool,
  }),
  ({ name, reminderType, text, hours, minutes, seconds, date, timezone, recurrence, recurrenceBool }) => {
    const isTimer = reminderType === ReminderClientType.TIME;

    return {
      reminder: {
        name,
        type: isTimer ? ReminderType.SCHEDULED_RELATIVE : ReminderType.SCHEDULED_ABSOLUTE,
        text,
        time: {
          h: hours,
          m: minutes,
          s: seconds,
        },
        ...(!isTimer && {
          date: _.isString(date) ? transformVariablesFromReadable(date) : date,
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
