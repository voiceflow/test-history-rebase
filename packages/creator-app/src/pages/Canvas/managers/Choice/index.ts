import * as Realtime from '@voiceflow/realtime-sdk';

import { INPUT_STEPS_LINK } from '@/constants';

import { NodeManagerConfigV2 } from '../types';
import { Editor } from './components';
import { NODE_CONFIG } from './constants';
import { Step } from './v2';

const ChoiceManager: NodeManagerConfigV2<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Choice',

  step: Step,
  editorV2: Editor,

  tooltipText: 'Add choices to your assistant.',
  tooltipLink: INPUT_STEPS_LINK,
};

export default ChoiceManager;
