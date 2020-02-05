import { withProps } from 'recompose';

import { ReminderType } from '@/constants';

import ReminderForm from './components/ReminderForm';

export const REMINDER_ROUTES = [
  {
    id: ReminderType.TIMER,
    label: 'Timer',
    component: ReminderForm,
  },
  {
    id: ReminderType.SCHEDULED,
    label: 'Scheduled',
    component: withProps({ withDate: true })(ReminderForm),
  },
];

export const HELP_LINK = 'https://docs.voiceflow.com/voiceflow-documentation/untitled/reminder-block';
