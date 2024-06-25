import { BlockType } from '@/constants';

import type { NodeManagerConfig } from '../types';
import InvalidPlatformEditor from './InvalidPlatformEditor';
import InvalidPlatformStep from './InvalidPlatformStep';

// eslint-disable-next-line @typescript-eslint/ban-types
const InvalidPlatformManager: NodeManagerConfig<{}> = {
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
