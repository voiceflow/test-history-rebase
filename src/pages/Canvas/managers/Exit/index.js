import { BlockType } from '@/constants';

import ExitEditor from './ExitEditor';
import ExitStep from './ExitStep';

const ExitManager = {
  type: BlockType.EXIT,
  editor: ExitEditor,
  icon: 'exit',
  iconColor: '#d94c4c',

  step: ExitStep,
  label: 'Exit',
  tip: 'End the skill on the current flow',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
      },
    },
    data: {
      name: 'Exit',
    },
  }),
};

export default ExitManager;
