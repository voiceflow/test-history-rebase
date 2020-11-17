import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import RandomEditor from './RandomEditor';
import RandomStep from './RandomStep';

const RandomManager: NodeConfig<NodeData.Random> = {
  type: BlockType.RANDOM,
  icon: 'randomLoop',
  iconColor: '#616c60',
  mergeTerminator: true,

  label: 'Random',
  tip: 'Choose randomly from a set number of paths',

  step: RandomStep,
  editor: RandomEditor,

  factory: (factoryData?) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Random',
      paths: 2,
      noDuplicates: false,
      ...factoryData,
    },
  }),
};

export default RandomManager;
