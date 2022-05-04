import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import ComponentEditor from './ComponentEditor';
import ComponentStep from './ComponentStep';
import { NODE_CONFIG } from './constants';

const ComponentManager: NodeManagerConfig<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Flow',

  step: ComponentStep,
  editor: ComponentEditor,
};

export default ComponentManager;
