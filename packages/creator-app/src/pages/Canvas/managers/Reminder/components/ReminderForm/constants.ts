import { AlexaNode } from '@voiceflow/alexa-types';

// eslint-disable-next-line import/prefer-default-export
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
