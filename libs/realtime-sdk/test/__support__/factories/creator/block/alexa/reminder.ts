import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype, date, lorem } from 'faker';

export const ReminderTime = define<NonNullable<AlexaNode.Reminder.Reminder['time']>>({
  h: datatype.number().toString(),
  m: datatype.number().toString(),
  s: datatype.number().toString(),
});

export const ReminderRecurrence = define<NonNullable<AlexaNode.Reminder.Reminder['recurrence']>>({
  freq: () => getRandomEnumElement(AlexaNode.Reminder.RecurrenceFreq),
  byDay: () => date.future().getDay().toString(),
});

export const Reminder = define<AlexaNode.Reminder.Reminder>({
  date: () => date.future().toDateString(),
  name: () => lorem.word(),
  text: () => lorem.words(),
  time: () => ReminderTime(),
  type: () => getRandomEnumElement(AlexaNode.Reminder.ReminderType),
  timezone: () => 'timezone',
  recurrence: () => ReminderRecurrence(),
  recurrenceBool: () => datatype.boolean(),
});

export const ReminderStepData = define<AlexaNode.Reminder.StepData>({
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
  reminderType: () => getRandomEnumElement(AlexaNode.Reminder.ReminderType),
  recurrenceBool: () => datatype.boolean(),
});
