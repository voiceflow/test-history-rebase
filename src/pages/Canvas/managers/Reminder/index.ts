import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import ReminderEditor from './ReminderEditor';
import ReminderStep from './ReminderStep';

const ReminderManager: NodeConfig<NodeData.Reminder> = {
  type: BlockType.REMINDER,
  icon: 'reminder',
  iconColor: '#c998a4',
  platforms: [PlatformType.ALEXA],

  label: 'Reminder',
  tip: 'Send a remind to the user in a set amount of time',

  step: ReminderStep,
  editor: ReminderEditor,

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

export default ReminderManager;
