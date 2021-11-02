import { Models as BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '@/control';

class IntentService extends AbstractControl {
  public async getAll<T extends BaseModels.VersionPlatformData>(creatorID: number, versionID: string): Promise<Realtime.VersionIntent<T>[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const {
      platformData: { intents },
    } = await client.version.get<T>(versionID);

    return intents;
  }

  public async replaceAll<T extends BaseModels.VersionPlatformData>(
    creatorID: number,
    versionID: string,
    intents: Realtime.VersionIntent<T>[]
  ): Promise<void> {
    await this.services.version.patchPlatformData(creatorID, versionID, { intents });
  }

  public async createMany<T extends BaseModels.VersionPlatformData>(
    creatorID: number,
    versionID: string,
    intents: Realtime.VersionIntent<T>[]
  ): Promise<void> {
    const currentIntents = await this.getAll<T>(creatorID, versionID);

    await this.replaceAll<T>(creatorID, versionID, [...currentIntents, ...intents]);
  }

  public async create<T extends BaseModels.VersionPlatformData>(
    creatorID: number,
    versionID: string,
    intent: Realtime.VersionIntent<T>
  ): Promise<void> {
    await this.createMany(creatorID, versionID, [intent]);
  }

  public async delete<T extends BaseModels.VersionPlatformData>(creatorID: number, versionID: string, intentID: string): Promise<void> {
    const currentIntents = await this.getAll<T>(creatorID, versionID);

    await this.replaceAll<BaseModels.VersionPlatformData>(
      creatorID,
      versionID,
      currentIntents.filter((slot) => slot.key !== intentID)
    );
  }
}

export default IntentService;
