import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const CaptureManager: NodeManagerConfigV2<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Capture',

  step: Step,
  editorV2: Editor,
};

export default CaptureManager;
