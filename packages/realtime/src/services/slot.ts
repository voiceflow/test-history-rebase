import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '@/control';

class SlotService extends AbstractControl {
  public async getAll<T extends BaseModels.Version.PlatformData>(creatorID: number, versionID: string): Promise<Realtime.VersionSlot<T>[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const {
      platformData: { slots },
    } = await client.version.get(versionID);

    return slots;
  }

  public async replaceAll<T extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    slots: Realtime.VersionSlot<T>[]
  ): Promise<void> {
    await this.services.version.patchPlatformData(creatorID, versionID, { slots });
  }

  public async createMany<T extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    slots: Realtime.VersionSlot<T>[]
  ): Promise<void> {
    const currentSlots = await this.getAll(creatorID, versionID);

    await this.replaceAll(creatorID, versionID, [...currentSlots, ...slots]);
  }

  public async create<T extends BaseModels.Version.PlatformData>(creatorID: number, versionID: string, slot: Realtime.VersionSlot<T>): Promise<void> {
    await this.createMany(creatorID, versionID, [slot]);
  }

  public async delete<T extends BaseModels.Version.PlatformData>(creatorID: number, versionID: string, slotID: string): Promise<void> {
    const currentSlots = await this.getAll<T>(creatorID, versionID);

    await this.replaceAll(
      creatorID,
      versionID,
      currentSlots.filter((slot) => slot.key !== slotID)
    );
  }

  public async deleteMany<T extends BaseModels.Version.PlatformData>(creatorID: number, versionID: string, slotIDs: string[]): Promise<void> {
    const currentSlots = await this.getAll<T>(creatorID, versionID);

    await this.replaceAll(
      creatorID,
      versionID,
      currentSlots.filter((slot) => !slotIDs.includes(slot.key))
    );
  }
}

export default SlotService;
