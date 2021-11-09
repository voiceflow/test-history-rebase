import * as Realtime from '@voiceflow/realtime-sdk';
import { withProps } from 'recompose';

import { BlockType, ReminderType } from '@/constants';

import { NodeConfig } from '../types';
import ReminderForm, { ReminderFormProps } from './components/ReminderForm';

export const REMINDER_ROUTES = [
  {
    id: ReminderType.TIMER,
    label: 'Timer',
    component: ReminderForm,
  },
  {
    id: ReminderType.SCHEDULED,
    label: 'Scheduled',
    component: withProps<Pick<ReminderFormProps, 'withDate'>, Omit<ReminderFormProps, 'withDate'>>({ withDate: true })(ReminderForm),
  },
];

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Reminder> = {
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
