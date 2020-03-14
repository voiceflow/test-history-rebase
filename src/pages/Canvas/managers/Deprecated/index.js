import { BlockType } from '@/constants';

import DeprecatedEditor from './DeprecatedEditor';
import DeprecatedStep from './DeprecatedStep';

const DeprecatedManager = {
  type: BlockType.DEPRECATED,
  label: 'Deprecated',
  editor: DeprecatedEditor,
  step: DeprecatedStep,

  icon: 'warning',
  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {},
    },
    data: {
      name: 'Deprecated Block',
    },
  }),
};

export default DeprecatedManager;
