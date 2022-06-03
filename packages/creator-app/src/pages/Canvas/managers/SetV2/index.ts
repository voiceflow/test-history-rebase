import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import SetEditor from './SetEditorV2';
import SetStep from './SetStep';
import SetManagerV2 from './v2';

const SetManager: NodeManagerConfig<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Set',

  step: SetStep,
  editor: SetEditor,

  v2: SetManagerV2,
};

export default SetManager;
