import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { Atomic } from '../utils';
import { PlatformDataModel } from './utils';

class IntentModel extends PlatformDataModel {
  readonly MODEL_PATH = 'intents' as const;

  async create<Intent extends BaseModels.Intent>(versionID: string, intent: Intent): Promise<Intent> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.PLATFORM_DATA_MODEL_PATH, value: intent }])]);

    return intent;
  }

  async createMany<Intent extends BaseModels.Intent>(versionID: string, intents: Intent[]): Promise<Intent[]> {
    await this.model.atomicUpdateByID(versionID, [Atomic.push([{ path: this.PLATFORM_DATA_MODEL_PATH, value: intents }])]);

    return intents;
  }

  async list<Intent extends BaseModels.Intent>(versionID: string): Promise<Intent[]> {
    const { platformData } = await this.model.findByID(versionID, [this.PLATFORM_DATA_PATH]);

    return platformData.intents as Intent[];
  }

  async getMany<Intent extends BaseModels.Intent>(versionID: string, intentKeys: string[]): Promise<Intent[]> {
    const intents = await this.list<Intent>(versionID);

    return intents.filter(({ key }) => intentKeys.includes(key));
  }

  async get<Intent extends BaseModels.Intent>(versionID: string, intentKey: string): Promise<Intent> {
    const intents = await this.list<Intent>(versionID);

    const intent = intents.find(({ key }) => key === intentKey);

    if (!intent) {
      throw new Error("Couldn't find intent");
    }

    return intent;
  }

  async update(versionID: string, intentKey: string, data: Partial<Omit<BaseModels.Intent, 'key'>>): Promise<void> {
    return this.model.atomicUpdateByID(
      versionID,
      Utils.object.getKeys(data).map((key) => Atomic.set([{ path: [this.PLATFORM_DATA_MODEL_PATH, { key: intentKey }, key], value: data[key] }]))
    );
  }

  async delete(versionID: string, intentKey: string): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.PLATFORM_DATA_MODEL_PATH, match: { key: intentKey } }])]);
  }

  async deleteMany(versionID: string, intentKeys: string[]): Promise<void> {
    return this.model.atomicUpdateByID(versionID, [Atomic.pull([{ path: this.PLATFORM_DATA_MODEL_PATH, match: { key: { $in: intentKeys } } }])]);
  }
}

export default IntentModel;
