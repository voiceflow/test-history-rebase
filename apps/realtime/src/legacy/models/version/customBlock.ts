import { Utils } from '@voiceflow/common';
import type { VersionCustomBlock } from '@voiceflow/dtos';

import { NestedMongoModel } from '../_mongo';
import { Atomic } from '../utils';
import type VersionModel from './index';

class CustomBlockModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'customBlocks' as const;

  async upsertMany(versionID: string, customBlocks: VersionCustomBlock[]): Promise<void> {
    await this.model.updateByID(
      versionID,
      customBlocks.reduce(
        (acc, customBlock) => ({ ...acc, [`${this.MODEL_PATH}.${customBlock.key}`]: customBlock }),
        {}
      )
    );
  }

  async update(versionID: string, customBlockKey: string, data: Partial<VersionCustomBlock>): Promise<void> {
    return this.model.atomicUpdateByID(
      versionID,
      Utils.object
        .getKeys(data)
        .map((key) => Atomic.set([{ path: [this.MODEL_PATH, customBlockKey, key], value: data[key] }]))
    );
  }

  async delete(versionID: string, customBlockKey: string): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.unset([{ path: `${this.MODEL_PATH}.${customBlockKey}` }])]);
  }
}

export default CustomBlockModel;
