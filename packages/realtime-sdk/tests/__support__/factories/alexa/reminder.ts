import { Node } from '@voiceflow/alexa-types';
import { Reminder, ReminderType } from '@voiceflow/alexa-types/build/node/reminder';
import { define } from 'cooky-cutter';
import { datatype, date, lorem } from 'faker';

import { NodeData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

export const timeFactory = define({
  h: datatype.number().toString(),
  m: datatype.number().toString(),
  s: datatype.number().toString(),
});

export const recurrenceFactory = define({
  byDay: () => date.future().getDay(),
  freq: () => getRandomEnumElement(Node.Reminder.RecurrenceFreq),
});

export const reminderFactory = define<Reminder>({
  date: () => date.future().toDateString(),
  name: () => lorem.word(),
  recurrenceBool: () => datatype.boolean(),
  text: () => lorem.words(),
  time: () => timeFactory(),
  timezone: () => 'timezone',
  type: () => getRandomEnumElement(ReminderType),
  recurrence: () => recurrenceFactory() as any,
});

export const reminderStepDataFactory = define<Node.Reminder.StepData>({
  reminder: () => reminderFactory(),
});

export const reminderNodeDataFactory = define<NodeData.Reminder>({
  hours: datatype.number().toString(),
  minutes: datatype.number().toString(),
  name: () => lorem.word(),
  recurrenceBool: () => datatype.boolean(),
  reminderType: () => getRandomEnumElement(ReminderType),
  seconds: datatype.number().toString(),
  text: () => lorem.words(),
  date: () => date.future().toDateString(),
  recurrence: () => recurrenceFactory() as any,
  timezone: () => '',
});
