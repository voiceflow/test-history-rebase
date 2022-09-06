import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '@/control';
import { uniqueReverse } from '@/services/utils/uniq';

// TODO: refactor this to use atomic operations and the intent mongo model, similar to domain/canvasTemplate and etc models
class IntentService extends AbstractControl {
  public async getAll<PlatformData extends BaseModels.Version.PlatformData>(versionID: string): Promise<Realtime.VersionIntent<PlatformData>[]> {
    return this.services.version.getIntents<PlatformData>(versionID);
  }

  public async replaceAll<PlatformData extends BaseModels.Version.PlatformData>(
    versionID: string,
    intents: Realtime.VersionIntent<PlatformData>[]
  ): Promise<void> {
    await this.services.version.patchPlatformData(versionID, {
      intents: uniqueReverse(intents, (intent) => intent.key || intent),
    });
  }

  public async createMany<T extends BaseModels.Version.PlatformData>(versionID: string, intents: Realtime.VersionIntent<T>[]): Promise<void> {
    const currentIntents = await this.getAll<T>(versionID);

    await this.replaceAll<T>(versionID, [...currentIntents, ...intents]);
  }

  public async create<T extends BaseModels.Version.PlatformData>(versionID: string, intent: Realtime.VersionIntent<T>): Promise<void> {
    await this.createMany(versionID, [intent]);
  }

  public async deleteMany<T extends BaseModels.Version.PlatformData>(
    versionID: string,
    intentIDs: string[]
  ): Promise<Realtime.VersionIntent<T>[] | null> {
    const currentIntents = await this.getAll<T>(versionID);

    const removedIntents = currentIntents.filter((intent) => intentIDs.includes(intent.key));

    await this.replaceAll<BaseModels.Version.PlatformData>(
      versionID,
      currentIntents.filter((intent) => !intentIDs.includes(intent.key))
    );

    return removedIntents ?? null;
  }

  public async delete<T extends BaseModels.Version.PlatformData>(versionID: string, intentID: string): Promise<Realtime.VersionIntent<T> | null> {
    const currentIntents = await this.getAll<T>(versionID);

    const removedIntent = currentIntents.find((intent) => intent.key === intentID);

    await this.replaceAll<BaseModels.Version.PlatformData>(
      versionID,
      currentIntents.filter((intent) => intent.key !== intentID)
    );

    return removedIntent ?? null;
  }
}

export default IntentService;
