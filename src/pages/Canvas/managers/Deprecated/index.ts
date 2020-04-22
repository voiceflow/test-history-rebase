import { BlockType } from '@/constants';

import { NodeConfig } from '../types';
import DeprecatedEditor from './DeprecatedEditor';
import DeprecatedStep from './DeprecatedStep';

const DeprecatedManager: NodeConfig<{}> = {
  type: BlockType.DEPRECATED,
  icon: 'warning',
  mergeTerminator: true,

  label: 'Deprecated',

  step: DeprecatedStep,
  editor: DeprecatedEditor,

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
