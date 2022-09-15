import { BaseModels } from '@voiceflow/base-types';

import { AbstractControl } from '@/control';

class IntentService extends AbstractControl {
  public async get<Intent extends BaseModels.Intent>(versionID: string, intentKey: string): Promise<Intent> {
    return this.models.version.intent.get<Intent>(versionID, intentKey);
  }

  public async getMany<Intent extends BaseModels.Intent>(versionID: string, intentKeys: string[]): Promise<Intent[]> {
    return this.models.version.intent.getMany<Intent>(versionID, intentKeys);
  }

  public async getAll<Intent extends BaseModels.Intent>(versionID: string): Promise<Intent[]> {
    return this.models.version.intent.list<Intent>(versionID);
  }

  public async create<Intent extends BaseModels.Intent>(versionID: string, intent: Intent): Promise<void> {
    await this.models.version.intent.create(versionID, intent);
  }

  public async createMany<Intent extends BaseModels.Intent>(versionID: string, intents: Intent[]): Promise<void> {
    await this.models.version.intent.createMany(versionID, intents);
  }

  public async update(versionID: string, intentKey: string, intent: Partial<BaseModels.Intent>): Promise<void> {
    await this.models.version.intent.update(versionID, intentKey, intent);
  }

  public async delete(versionID: string, intentKey: string): Promise<void> {
    await this.models.version.intent.delete(versionID, intentKey);
  }

  public async deleteMany(versionID: string, intentKeys: string[]): Promise<void> {
    await this.models.version.intent.deleteMany(versionID, intentKeys);
  }
}

export default IntentService;
