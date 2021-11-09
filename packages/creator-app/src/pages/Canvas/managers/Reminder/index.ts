import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import ReminderEditor from './ReminderEditor';
import ReminderStep from './ReminderStep';

const ReminderManager: NodeManagerConfig<Realtime.NodeData.Reminder> = {
  ...NODE_CONFIG,

  tip: 'Send a remind to the user in a set amount of time',
  label: 'Reminder',

  step: ReminderStep,
  editor: ReminderEditor,
};

export default ReminderManager;
