import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import ComponentEditor from './ComponentEditor';
import ComponentStep from './ComponentStep';
import { NODE_CONFIG } from './constants';

const ComponentManager: NodeManagerConfig<Realtime.NodeData.Component> = {
  ...NODE_CONFIG,

  tip: 'Organize your project into manageable sections or perform computations',
  label: 'Component',

  step: ComponentStep,
  editor: ComponentEditor,
};

export default ComponentManager;
