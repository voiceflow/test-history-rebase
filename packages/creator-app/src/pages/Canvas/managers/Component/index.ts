import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import ComponentEditor from './ComponentEditor';
import ComponentStep from './ComponentStep';
import { NODE_CONFIG } from './constants';
import ComponentManagerV2 from './v2';

const ComponentManager: NodeManagerConfig<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Flow',

  step: ComponentStep,
  editor: ComponentEditor,

  v2: ComponentManagerV2,
};

export default ComponentManager;
