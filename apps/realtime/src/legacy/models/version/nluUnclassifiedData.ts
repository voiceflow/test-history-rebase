import { BaseModels } from '@voiceflow/base-types';

import { NestedMongoModel } from '../_mongo';
import { Atomic } from '../utils';
import type VersionModel from './index';

interface RemoveManyUtterancesPayload {
  datasourceKey: string;
  utteranceIDs: string[];
}

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

  async removeManyUtterancesFromDatasource(versionID: string, datasourceKey: string, utteranceIDs: string[]): Promise<void> {
    await this.model.atomicUpdateOne({ ...this.model.idFilter(versionID), [`${this.MODEL_PATH}.key`]: datasourceKey }, [
      Atomic.pull([{ path: `${this.MODEL_PATH}.$.utterances`, match: { id: { $in: utteranceIDs } } }]),
    ]);
  }

  async updateManyUtterancesFromDatasource(
    versionID: string,
    datasourceKey: string,
    utterances: BaseModels.Version.NLUUnclassifiedUtterances[]
  ): Promise<void> {
    await this.model.atomicUpdateOne({ ...this.model.idFilter(versionID), [`${this.MODEL_PATH}.key`]: datasourceKey }, [
      Atomic.set([{ path: [`${this.MODEL_PATH}.$.utterances`, { match: { id: { $in: utterances.map((u) => u.id) } } }], value: utterances }]),
    ]);
  }

  // TODO: [Unclassified] fix it
  async removeManyUtterances(versionID: string, updates: RemoveManyUtterancesPayload[]): Promise<void> {
    const mapper = updates.map(({ datasourceKey: key, utteranceIDs: uttIDs }, index) => ({
      ...Atomic.pull([{ path: `${this.MODEL_PATH}.$[item${index}].utterances`, match: { id: { $in: uttIDs } } }]),
      arrayFilters: [{ [`item${index}`]: { key } }],
    }));

    await this.model.atomicUpdateByID(versionID, mapper);
  }
}

export default NluUnclassifiedDataModel;
