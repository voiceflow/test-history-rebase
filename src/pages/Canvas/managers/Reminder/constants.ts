import { withProps } from 'recompose';

import { BlockType, ReminderType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
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

export const HELP_LINK = 'https://docs.voiceflow.com/#/alexa/reminder-block';

export const NODE_CONFIG: NodeConfig<NodeData.Reminder> = {
  type: BlockType.REMINDER,

  icon: 'reminder',
  iconColor: '#c998a4',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: 'Reminder',
      reminderType: 'timer',
      text: '',
      hours: '',
      minutes: '',
      seconds: '',
      recurrenceBool: false,
    },
  }),
};
