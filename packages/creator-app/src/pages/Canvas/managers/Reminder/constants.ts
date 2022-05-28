import { BaseModels } from '@voiceflow/base-types';
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

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Reminder, Realtime.NodeData.ReminderBuiltInPorts> = {
  type: BlockType.REMINDER,
  icon: 'reminder',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.FAIL]: { label: BaseModels.PortType.FAIL },
          },
        },
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
