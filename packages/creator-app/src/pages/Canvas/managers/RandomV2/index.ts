import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import RandomEditor from './RandomEditorV2';
import RandomStep from './RandomStep';

const RandomManagerV2: NodeManagerConfigV2<Realtime.NodeData.RandomV2> = {
  ...NODE_CONFIG,

  label: 'Random',

  step: RandomStep,
  editorV2: RandomEditor,

  tooltipText: 'Randomizes the conversation path at this point in the conversation.',
  tooltipLink: Documentation.RANDOM_STEP,
};

export default RandomManagerV2;
