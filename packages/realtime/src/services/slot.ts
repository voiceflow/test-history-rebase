import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl } from '@/control';
import { uniqueReverse } from '@/services/utils/uniq';

// TODO: refactor this to use atomic operations and the intent mongo model, similar to domain/canvasTemplate and etc models
class SlotService extends AbstractControl {
  public async getAll<T extends BaseModels.Version.PlatformData>(versionID: string): Promise<Realtime.VersionSlot<T>[]> {
    return this.services.version.getSlots(versionID);
  }

  public async replaceAll<T extends BaseModels.Version.PlatformData>(versionID: string, slots: Realtime.VersionSlot<T>[]): Promise<void> {
    await this.services.version.patchPlatformData(versionID, { slots: uniqueReverse(slots, (slot) => slot.key || slot) });
  }

  public async createMany<T extends BaseModels.Version.PlatformData>(versionID: string, slots: Realtime.VersionSlot<T>[]): Promise<void> {
    const currentSlots = await this.getAll(versionID);

    await this.replaceAll(versionID, [...currentSlots, ...slots]);
  }

  public async create<T extends BaseModels.Version.PlatformData>(versionID: string, slot: Realtime.VersionSlot<T>): Promise<void> {
    await this.createMany(versionID, [slot]);
  }

  public async delete<T extends BaseModels.Version.PlatformData>(versionID: string, slotID: string): Promise<void> {
    const currentSlots = await this.getAll<T>(versionID);

    await this.replaceAll(
      versionID,
      currentSlots.filter((slot) => slot.key !== slotID)
    );
  }

  public async deleteMany<T extends BaseModels.Version.PlatformData>(versionID: string, slotIDs: string[]): Promise<void> {
    const currentSlots = await this.getAll<T>(versionID);

    await this.replaceAll(
      versionID,
      currentSlots.filter((slot) => !slotIDs.includes(slot.key))
    );
  }
}

export default SlotService;
