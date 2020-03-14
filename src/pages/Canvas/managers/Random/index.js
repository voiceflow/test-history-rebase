import { BlockType } from '@/constants';
import RandomIcon from '@/svgs/solid/random.svg';

import RandomEditor from './RandomEditor';
import RandomStep from './RandomStep';

const RandomManager = {
  type: BlockType.RANDOM,
  icon: RandomIcon,

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
