import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import RandomEditor from './RandomEditor';
import RandomStep from './RandomStep';

const RandomManager: NodeManagerConfig<Realtime.NodeData.Random> = {
  ...NODE_CONFIG,

  label: 'Random',

  step: RandomStep,
  editor: RandomEditor,

  tooltipText: 'Randomizes the conversation path at this point in the conversation.',
  tooltipLink: Documentation.RANDOM_STEP,
};

export default RandomManager;
