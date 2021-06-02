import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import RandomEditor from './RandomEditor';
import RandomStep from './RandomStep';

const RandomManager: NodeManagerConfig<NodeData.Random> = {
  ...NODE_CONFIG,

  tip: 'Choose randomly from a set number of paths',
  label: 'Random',

  step: RandomStep,
  editor: RandomEditor,
};

export default RandomManager;
