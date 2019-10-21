import { BlockType } from '@/constants';
import RandomIcon from '@/svgs/solid/random.svg';

import RandomEditor from './RandomEditor';

const RandomManager = {
  type: BlockType.RANDOM,
  editor: RandomEditor,
  icon: RandomIcon,

  label: 'Random',
  tip: 'Choose randomly from a set number of paths',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Random',
      paths: 1,
    },
  }),
};

export default RandomManager;
