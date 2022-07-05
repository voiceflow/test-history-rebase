import * as Realtime from '@voiceflow/realtime-sdk';
import { SVG } from '@voiceflow/ui';

import { LOGIC_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import FlowEditor from './FlowEditor';
import FlowStep from './FlowStep';

const FlowManager: NodeManagerConfig<Realtime.NodeData.Flow, Realtime.NodeData.FlowBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Flow',

  step: FlowStep,
  editor: FlowEditor,

  stepsMenuIcon: SVG.flowV2,
  tooltipText: 'Add flows to your assistant.',
  tooltipLink: LOGIC_STEPS_LINK,
};

export default FlowManager;
