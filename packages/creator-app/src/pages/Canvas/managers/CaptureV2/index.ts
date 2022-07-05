import * as Realtime from '@voiceflow/realtime-sdk';

import { INPUT_STEPS_LINK } from '@/constants';

import { NodeManagerConfigV2 } from '../types';
import { Editor } from './components';
import { NODE_CONFIG } from './constants';
import { Step } from './v2';

const CaptureV2Manager: NodeManagerConfigV2<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Capture',

  step: Step,
  editorV2: Editor,

  tooltipText: 'Add capture steps to your assistant.',
  tooltipLink: INPUT_STEPS_LINK,
};

export default CaptureV2Manager;
