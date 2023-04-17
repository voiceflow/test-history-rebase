import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import { PointerEditor as Editor } from './editor';
import { ConnectedPointerStep as Step } from './step';

const CustomBlockPointerManager: NodeManagerConfigV2<Realtime.NodeData.Pointer> = {
  ...NODE_CONFIG,

  label: 'Custom Block',
  step: Step,
  editorV2: Editor,
};

export default CustomBlockPointerManager;
