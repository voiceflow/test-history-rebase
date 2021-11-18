import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import FlowEditor from './FlowEditor';
import FlowStep from './FlowStep';

const FlowManager: NodeManagerConfig<Realtime.NodeData.Flow, Realtime.NodeData.FlowBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Organize your project into manageable sections or perform computations',
  label: 'Flow',

  step: FlowStep,
  editor: FlowEditor,
};

export default FlowManager;
