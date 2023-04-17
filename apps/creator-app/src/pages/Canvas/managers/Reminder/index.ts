import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import ReminderEditor from './ReminderEditor';
import ReminderStep from './ReminderStep';

const ReminderManager: NodeManagerConfig<Realtime.NodeData.Reminder, Realtime.NodeData.ReminderBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Reminder',

  step: ReminderStep,
  editor: ReminderEditor,
};

export default ReminderManager;
