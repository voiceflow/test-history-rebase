import { BlockType, PlatformType } from '@/constants';
import BellIcon from '@/svgs/solid/bell.svg';

import ReminderEditor from './ReminderEditor';
import ReminderStep from './ReminderStep';

const ReminderManager = {
  type: BlockType.REMINDER,
  icon: BellIcon,

  editor: ReminderEditor,
  step: ReminderStep,

  label: 'Reminder',
  tip: 'Send a remind to the user in a set amount of time',

  addable: true,
  platforms: [PlatformType.ALEXA],

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
      recurrence: {},
    },
  }),
};

export default ReminderManager;
