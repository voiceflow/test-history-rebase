import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';
import ChoiceStepManagerV2 from './v2';

const ChoiceManager: NodeManagerConfigV2<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Choice',

  step: Step,
  editorV2: Editor,

  v2: ChoiceStepManagerV2,
};

export default ChoiceManager;
