import * as Realtime from '@voiceflow/realtime-sdk';
import { SVG } from '@voiceflow/ui';

import { INPUT_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import RandomEditor from './RandomEditor';
import RandomStep from './RandomStep';

const RandomManager: NodeManagerConfig<Realtime.NodeData.Random> = {
  ...NODE_CONFIG,

  label: 'Random',

  step: RandomStep,
  editor: RandomEditor,

  stepsMenuIcon: SVG.randomV2,
  tooltipText: 'Randomizes the conversation path at this point in the conversation.',
  tooltipLink: INPUT_STEPS_LINK,
};

export default RandomManager;
