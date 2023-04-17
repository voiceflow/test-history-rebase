import { AlexaNode } from '@voiceflow/alexa-types';

export const RECURRENCE_OPTIONS = [
  {
    id: AlexaNode.Reminder.RecurrenceFreq.DAILY,
    label: 'Daily',
  },
  {
    id: AlexaNode.Reminder.RecurrenceFreq.WEEKLY,
    label: 'Weekly',
  },
];
