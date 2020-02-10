import { BlockType, PlatformType } from '@/constants';
import BellIcon from '@/svgs/solid/bell.svg';

import ReminderEditor from './ReminderEditor';

const ReminderManager = {
  type: BlockType.REMINDER,
  editor: ReminderEditor,
  icon: BellIcon,

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
