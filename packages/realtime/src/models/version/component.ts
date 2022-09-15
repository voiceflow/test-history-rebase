import { BaseModels } from '@voiceflow/base-types';

import { NestedMongoModel } from '../_mongo';
import { Atomic } from '../utils';
import type VersionModel from './index';

class ComponentModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'components' as const;

  async add({ index, item, versionID }: { index?: number; item: BaseModels.Version.FolderItem; versionID: string }): Promise<void> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.MODEL_PATH, value: item, index }])]);
  }

  async remove({ componentID, versionID }: { componentID: string; versionID: string }): Promise<void> {
    await this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.MODEL_PATH, match: { sourceID: componentID } }])]);
  }

  async reorder({ index, sourceID, versionID }: { index: number; sourceID: string; versionID: string }): Promise<void> {
    const version = await this.model.findAndAtomicUpdateByID(versionID, [Atomic.pull([{ path: this.MODEL_PATH, match: { sourceID } }])]);

    const item = version.components?.find((folder) => folder.sourceID === sourceID);

    if (!item) throw new Error('Could not find item to reorder');

    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.MODEL_PATH, value: item, index }])]);
  }
}

export default ComponentModel;
