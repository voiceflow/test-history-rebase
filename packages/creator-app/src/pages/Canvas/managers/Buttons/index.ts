import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { INPUT_STEPS_LINK } from '@/constants';

import { NodeManagerConfigV2 } from '../types';
import { Editor } from './components';
import { NODE_CONFIG } from './constants';
import { Step } from './v2';

const ButtonsManager: NodeManagerConfigV2<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Buttons',
  projectTypes: [VoiceflowConstants.ProjectType.CHAT],

  step: Step,
  editorV2: Editor,

  tooltipText: 'Add buttons to your assistant.',
  tooltipLink: INPUT_STEPS_LINK,
};

export default ButtonsManager;
