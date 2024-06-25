import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import type { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const RandomManagerV2: NodeManagerConfigV2<Realtime.NodeData.RandomV2> = {
  ...NODE_CONFIG,

  label: 'Random',

  step: Step,
  editorV2: Editor,

  tooltipText: 'Randomizes the conversation path at this point in the conversation.',
  tooltipLink: Documentation.RANDOM_STEP,
};

export default RandomManagerV2;
