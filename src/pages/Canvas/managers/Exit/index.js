import { BlockType } from '@/constants';
import SignOutIcon from '@/svgs/solid/sign-out.svg';

import ExitEditor from './ExitEditor';

const ExitManager = {
  type: BlockType.EXIT,
  editor: ExitEditor,
  icon: SignOutIcon,

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
