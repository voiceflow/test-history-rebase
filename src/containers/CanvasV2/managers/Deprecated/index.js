import { BlockType } from '@/constants';

import DeprecatedEditor from './DeprecatedEditor';

const DeprecatedManager = {
  type: BlockType.DEPRECATED,
  label: 'Deprecated',
  editor: DeprecatedEditor,
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
