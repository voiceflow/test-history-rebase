import { BlockType } from '@/constants';

import { NodeConfig } from '../types';
import ExitEditor from './ExitEditor';
import ExitStep from './ExitStep';

const ExitManager: NodeConfig<{}> = {
  type: BlockType.EXIT,
  icon: 'exit',
  iconColor: '#d94c4c',
  mergeTerminator: true,

  label: 'Exit',
  tip: 'End the skill on the current flow',

  step: ExitStep,
  editor: ExitEditor,

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
