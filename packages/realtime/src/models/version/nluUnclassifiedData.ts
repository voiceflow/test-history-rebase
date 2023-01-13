import { BaseModels } from '@voiceflow/base-types';

import { NestedMongoModel } from '../_mongo';
import { Atomic } from '../utils';
import type VersionModel from './index';

class NluUnclassifiedDataModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'nluUnclassifiedData' as const;

  async add(versionID: string, unclassifiedData: BaseModels.Version.NLUUnclassifiedData): Promise<void> {
    const value = {
      path: this.MODEL_PATH,
      value: { ...unclassifiedData, importedAt: new Date() },
    };

    await this.model.atomicUpdateByID(versionID, [Atomic.push([value])]);
  }

  async list(versionID: string): Promise<BaseModels.Version.NLUUnclassifiedData[]> {
    const { nluUnclassifiedData } = await this.model.findByID(versionID, [this.MODEL_PATH]);

    return nluUnclassifiedData as BaseModels.Version.NLUUnclassifiedData[];
  }

  async delete(versionID: string, key: string): Promise<void> {
    await this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.MODEL_PATH, match: { key } }])]);
  }
}

export default NluUnclassifiedDataModel;
