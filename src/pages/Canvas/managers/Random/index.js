import { BlockType } from '@/constants';

import RandomEditor from './RandomEditor';
import RandomStep from './RandomStep';

const RandomManager = {
  type: BlockType.RANDOM,
  icon: 'randomLoop',
  iconColor: '#616c60',

  editor: RandomEditor,
  step: RandomStep,

  label: 'Random',
  tip: 'Choose randomly from a set number of paths',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Random',
      paths: 2,
    },
  }),
};

export default RandomManager;
