import { BaseModels } from '@voiceflow/base-types';

import { NestedMongoModel } from '../_mongo';
import { Atomic } from '../utils';
import type VersionModel from './index';

class NluUnclassifiedDataModel extends NestedMongoModel<VersionModel> {
  readonly MODEL_PATH = 'nluUnclassifiedData' as const;

  async add(versionID: string, unclassifiedData: BaseModels.Version.NLUUnclassifiedData): Promise<void> {
    const value = {
      path: this.MODEL_PATH,
      value: { ...unclassifiedData, utterances: unclassifiedData.utterances.map((u) => ({ ...u, importedAt: new Date(u.importedAt) })) },
    };

    await this.model.atomicUpdateByID(versionID, [Atomic.push([value])]);
  }

  async list<NluUnclassifiedData extends BaseModels.Version.NLUUnclassifiedData>(versionID: string): Promise<NluUnclassifiedData[]> {
    const { nluUnclassifiedData } = await this.model.findByID(versionID, [this.MODEL_PATH]);

    return nluUnclassifiedData as NluUnclassifiedData[];
  }
}

export default NluUnclassifiedDataModel;
