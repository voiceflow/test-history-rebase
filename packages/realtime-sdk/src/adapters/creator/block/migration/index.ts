import { BlockType } from '../../../../constants';
import toIfV2Adapter from './if';
import toSetV2Adapter from './set';

// eslint-disable-next-line import/prefer-default-export
export const migrationBlockAdapter = {
  [BlockType.IFV2]: toIfV2Adapter,
  [BlockType.SETV2]: toSetV2Adapter,
};
