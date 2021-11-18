import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import SetEditor from './SetEditorV2';
import SetStep from './SetStep';

const SetManager: NodeManagerConfig<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Set the value of a variable, or many variables at once',
  label: 'Set',

  step: SetStep,
  editor: SetEditor,
};

export default SetManager;
