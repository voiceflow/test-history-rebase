import { BlockType } from '@/constants';

import { NodeConfig } from '../types';
import InvalidPlatformEditor from './InvalidPlatformEditor';
import InvalidPlatformStep from './InvalidPlatformStep';

const InvalidPlatformManager: NodeConfig<{}> = {
  type: BlockType.INVALID_PLATFORM,
  mergeTerminator: true,

  label: 'Invalid Platform',

  step: InvalidPlatformStep,
  editor: InvalidPlatformEditor,

  factory: () => ({
    node: {
      ports: {},
    },
    data: {
      name: 'Invalid Platform Block',
    },
  }),
};

export default InvalidPlatformManager;
