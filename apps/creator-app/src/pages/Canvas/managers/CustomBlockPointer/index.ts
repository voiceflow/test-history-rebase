import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const CustomBlockPointerManager: NodeManagerConfigV2<Realtime.NodeData.Pointer> = {
  ...NODE_CONFIG,

  label: 'Custom Block',
  step: Step,
  editorV2: Editor,
};

export default CustomBlockPointerManager;
