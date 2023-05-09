import { faker } from '@faker-js/faker';
import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

export const ReminderTime = define<NonNullable<AlexaNode.Reminder.Reminder['time']>>({
  h: faker.datatype.number().toString(),
  m: faker.datatype.number().toString(),
  s: faker.datatype.number().toString(),
});

export const ReminderRecurrence = define<NonNullable<AlexaNode.Reminder.Reminder['recurrence']>>({
  freq: () => getRandomEnumElement(AlexaNode.Reminder.RecurrenceFreq),
  byDay: () => faker.date.future().getDay().toString(),
});

export const Reminder = define<AlexaNode.Reminder.Reminder>({
  date: () => faker.date.future().toDateString(),
  name: () => faker.lorem.word(),
  text: () => faker.lorem.words(),
  time: () => ReminderTime(),
  type: () => getRandomEnumElement(AlexaNode.Reminder.ReminderType),
  timezone: () => 'timezone',
  recurrence: () => ReminderRecurrence(),
  recurrenceBool: () => faker.datatype.boolean(),
});

export const ReminderStepData = define<AlexaNode.Reminder.StepData>({
  reminder: () => Reminder(),
});

export const ReminderNodeData = define<NodeData.Reminder>({
  name: () => faker.lorem.word(),
  text: () => faker.lorem.words(),
  date: () => faker.date.future().toDateString(),
  hours: faker.datatype.number().toString(),
  minutes: faker.datatype.number().toString(),
  seconds: faker.datatype.number().toString(),
  timezone: () => '',
  recurrence: () => ReminderRecurrence(),
  reminderType: () => getRandomEnumElement(AlexaNode.Reminder.ReminderType),
  recurrenceBool: () => faker.datatype.boolean(),
});
