import { BlockType } from '@realtime-sdk/constants';

import toIfV2Adapter from './if';
import toSetV2Adapter from './set';

export const migrationBlockAdapter = {
  [BlockType.IFV2]: toIfV2Adapter,
  [BlockType.SETV2]: toSetV2Adapter,
};
