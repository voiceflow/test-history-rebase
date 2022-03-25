import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '@/control';

class IntentService extends AbstractControl {
  public async getAll<T extends BaseModels.Version.PlatformData>(creatorID: number, versionID: string): Promise<Realtime.VersionIntent<T>[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const {
      platformData: { intents },
    } = await client.version.get<T>(versionID);

    return intents;
  }

  public async replaceAll<T extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    intents: Realtime.VersionIntent<T>[]
  ): Promise<void> {
    await this.services.version.patchPlatformData(creatorID, versionID, { intents });
  }

  public async createMany<T extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    intents: Realtime.VersionIntent<T>[]
  ): Promise<void> {
    const currentIntents = await this.getAll<T>(creatorID, versionID);

    await this.replaceAll<T>(creatorID, versionID, [...currentIntents, ...intents]);
  }

  public async create<T extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    intent: Realtime.VersionIntent<T>
  ): Promise<void> {
    await this.createMany(creatorID, versionID, [intent]);
  }

  public async delete<T extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    intentID: string
  ): Promise<Realtime.VersionIntent<T> | null> {
    const currentIntents = await this.getAll<T>(creatorID, versionID);

    const removedIntent = currentIntents.find((intent) => intent.key === intentID);

    await this.replaceAll<BaseModels.Version.PlatformData>(
      creatorID,
      versionID,
      currentIntents.filter((intent) => intent.key !== intentID)
    );

    return removedIntent ?? null;
  }
}

export default IntentService;
