import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, date, lorem } from 'faker';

import { NodeData } from '@/models';
import { getRandomEnumElement } from '@/tests/utils';

export const ReminderTime = define<NonNullable<Node.Reminder.Reminder['time']>>({
  h: datatype.number().toString(),
  m: datatype.number().toString(),
  s: datatype.number().toString(),
});

export const ReminderRecurrence = define<NonNullable<Node.Reminder.Reminder['recurrence']>>({
  freq: () => getRandomEnumElement(Node.Reminder.RecurrenceFreq),
  byDay: () => date.future().getDay().toString(),
});

export const Reminder = define<Node.Reminder.Reminder>({
  date: () => date.future().toDateString(),
  name: () => lorem.word(),
  text: () => lorem.words(),
  time: () => ReminderTime(),
  type: () => getRandomEnumElement(Node.Reminder.ReminderType),
  timezone: () => 'timezone',
  recurrence: () => ReminderRecurrence(),
  recurrenceBool: () => datatype.boolean(),
});

export const ReminderStepData = define<Node.Reminder.StepData>({
  reminder: () => Reminder(),
});

export const ReminderNodeData = define<NodeData.Reminder>({
  name: () => lorem.word(),
  text: () => lorem.words(),
  date: () => date.future().toDateString(),
  hours: datatype.number().toString(),
  minutes: datatype.number().toString(),
  seconds: datatype.number().toString(),
  timezone: () => '',
  recurrence: () => ReminderRecurrence(),
  reminderType: () => getRandomEnumElement(Node.Reminder.ReminderType),
  recurrenceBool: () => datatype.boolean(),
});
