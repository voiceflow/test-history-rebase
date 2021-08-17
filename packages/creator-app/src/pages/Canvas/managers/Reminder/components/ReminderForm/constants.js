import { Node } from '@voiceflow/alexa-types';

// eslint-disable-next-line import/prefer-default-export
export const RECURRENCE_OPTIONS = [
  {
    id: Node.Reminder.RecurrenceFreq.DAILY,
    label: 'Daily',
  },
  {
    id: Node.Reminder.RecurrenceFreq.WEEKLY,
    label: 'Weekly',
  },
];
