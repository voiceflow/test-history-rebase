import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../../types';
import ComponentEditor from './ComponentEditor';
import ComponentStep from './ComponentStep';
import { COMPONENT_STEP_ICON } from './constants';

const ComponentManagerV2: Partial<NodeManagerConfigV2<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts>> = {
  icon: COMPONENT_STEP_ICON,
  step: ComponentStep,
  editorV2: ComponentEditor,
};

export default ComponentManagerV2;
