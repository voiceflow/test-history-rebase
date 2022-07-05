import * as Realtime from '@voiceflow/realtime-sdk';
import { SVG } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { RESPONSE_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import TextEditor from './TextEditor';
import TextStep from './TextStep';
import TextManagerV2 from './v2';

const TextManager: NodeManagerConfig<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Text',
  projectTypes: [VoiceflowConstants.ProjectType.CHAT],

  step: TextStep,
  editor: TextEditor,

  v2: TextManagerV2,

  tooltipText: 'Add text to your assistant.',
  tooltipLink: RESPONSE_STEPS_LINK,

  stepsMenuIcon: SVG.systemText,
};

export default TextManager;
