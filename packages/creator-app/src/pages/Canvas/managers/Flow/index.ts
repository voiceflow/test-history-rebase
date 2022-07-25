import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import FlowEditor from './FlowEditor';
import FlowStep from './FlowStep';

const FlowManager: NodeManagerConfig<Realtime.NodeData.Flow, Realtime.NodeData.FlowBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Flow',

  step: FlowStep,
  editor: FlowEditor,

  tooltipText: 'Points the conversation to an existing Flow.',
  tooltipLink: Documentation.FLOW_STEP,
};

export default FlowManager;
